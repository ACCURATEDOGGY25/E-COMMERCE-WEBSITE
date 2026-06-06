import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";
import { AppError } from "../lib/errors.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { isDemoMode } from "../lib/demoMode.js";

const router = Router();

const DEMO_AUTH_MSG =
  "Database not configured. Add Supabase URLs to backend/.env, then run: bash scripts/setup.sh";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["CUSTOMER", "SELLER"]).default("CUSTOMER"),
  storeName: z.string().min(2).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function authResponse(user: {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string | null;
  vendor?: { id: string; storeName: string; slug: string; status: string } | null;
}) {
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      vendor: user.vendor,
    },
  };
}

router.post(
  "/register",
  validateBody(registerSchema),
  async (req, res, next) => {
    try {
      if (isDemoMode()) {
        throw new AppError(503, DEMO_AUTH_MSG, "DEMO_MODE");
      }

      const { email, password, name, role, storeName } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(409, "Email already registered");
      }

      if (role === "SELLER" && !storeName) {
        throw new AppError(400, "Store name is required for sellers");
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            email,
            passwordHash,
            name,
            role: role as Role,
          },
        });

        if (role === "SELLER" && storeName) {
          const slug = storeName
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-");
          await tx.vendor.create({
            data: {
              userId: created.id,
              storeName,
              slug: `${slug}-${created.id.slice(-6)}`,
              status: process.env.NODE_ENV === "production" ? "PENDING" : "APPROVED",
            },
          });
        }

        await tx.cart.create({ data: { userId: created.id } });
        await tx.wishlist.create({ data: { userId: created.id } });

        return tx.user.findUnique({
          where: { id: created.id },
          include: { vendor: true },
        });
      });

      if (!user) throw new AppError(500, "Registration failed");

      res.status(201).json(authResponse(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    if (isDemoMode()) {
      throw new AppError(503, DEMO_AUTH_MSG, "DEMO_MODE");
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { vendor: true },
    });

    if (!user || !user.passwordHash) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: z.string().min(8).optional(),
});

router.patch(
  "/me",
  authenticate,
  validateBody(updateProfileSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (isDemoMode()) {
        throw new AppError(503, DEMO_AUTH_MSG, "DEMO_MODE");
      }

      const { name, currentPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
      });

      if (!user) throw new AppError(404, "User not found");

      const data: { name?: string; passwordHash?: string } = {};

      if (name) data.name = name;

      if (newPassword) {
        if (!user.passwordHash || !currentPassword) {
          throw new AppError(400, "Current password required");
        }
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) throw new AppError(401, "Current password is incorrect");
        data.passwordHash = await bcrypt.hash(newPassword, 12);
      }

      const updated = await prisma.user.update({
        where: { id: user.id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          vendor: {
            select: {
              id: true,
              storeName: true,
              slug: true,
              status: true,
              logo: true,
            },
          },
        },
      });

      res.json({ success: true, user: updated });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/me", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        vendor: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            status: true,
            logo: true,
          },
        },
      },
    });

    if (!user) throw new AppError(404, "User not found");

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// Google OAuth: exchange ID token or redirect flow handled on frontend;
// this endpoint links/creates user from Google profile
const googleSchema = z.object({
  googleId: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
});

router.post("/google", validateBody(googleSchema), async (req, res, next) => {
  try {
    if (isDemoMode()) {
      throw new AppError(503, DEMO_AUTH_MSG, "DEMO_MODE");
    }

    const { googleId, email, name, avatar } = req.body;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
      include: { vendor: true },
    });

    if (!user) {
      user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: {
            googleId,
            email,
            name,
            avatar,
            emailVerified: true,
          },
        });
        await tx.cart.create({ data: { userId: created.id } });
        await tx.wishlist.create({ data: { userId: created.id } });
        return tx.user.findUnique({
          where: { id: created.id },
          include: { vendor: true },
        });
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar: avatar || user.avatar },
        include: { vendor: true },
      });
    }

    if (!user) throw new AppError(500, "Google auth failed");

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

export default router;
