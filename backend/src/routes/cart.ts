import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { param } from "../utils/params.js";

const router = Router();

router.use(authenticate);

const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1).max(99).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

async function getOrCreateCart(userId: string) {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
              vendor: { select: { storeName: true, slug: true } },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: "asc" }, take: 1 },
                vendor: { select: { storeName: true, slug: true } },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user!.userId);
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    res.json({
      success: true,
      data: cart,
      summary: { itemCount: cart.items.length, subtotal },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/items", validateBody(addItemSchema), async (req: AuthRequest, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.userId;

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
    });

    if (!product) throw new AppError(404, "Product not found");
    if (product.stock < quantity) {
      throw new AppError(400, "Insufficient stock");
    }

    const cart = await getOrCreateCart(userId);

    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        throw new AppError(400, "Insufficient stock");
      }
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    const updated = await getOrCreateCart(userId);
    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/items/:itemId",
  validateBody(updateItemSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const cart = await getOrCreateCart(req.user!.userId);
      const item = cart.items.find((i) => i.id === param(req, "itemId"));
      if (!item) throw new AppError(404, "Cart item not found");

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product || product.stock < req.body.quantity) {
        throw new AppError(400, "Insufficient stock");
      }

      await prisma.cartItem.update({
        where: { id: param(req, "itemId") },
        data: { quantity: req.body.quantity },
      });

      const updated = await getOrCreateCart(req.user!.userId);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/items/:itemId", async (req: AuthRequest, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user!.userId);
    const item = cart.items.find((i) => i.id === param(req, "itemId"));
    if (!item) throw new AppError(404, "Cart item not found");

    await prisma.cartItem.delete({ where: { id: param(req, "itemId") } });

    const updated = await getOrCreateCart(req.user!.userId);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req: AuthRequest, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user!.userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    const updated = await getOrCreateCart(req.user!.userId);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
