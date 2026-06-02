import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { param } from "../utils/params.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.userId },
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

    res.json({ success: true, data: wishlist?.items || [] });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  validateBody(z.object({ productId: z.string() })),
  async (req: AuthRequest, res, next) => {
    try {
      let wishlist = await prisma.wishlist.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId: req.user!.userId },
        });
      }

      const product = await prisma.product.findFirst({
        where: { id: req.body.productId, isActive: true },
      });
      if (!product) throw new AppError(404, "Product not found");

      await prisma.wishlistItem.upsert({
        where: {
          wishlistId_productId: {
            wishlistId: wishlist.id,
            productId: req.body.productId,
          },
        },
        create: {
          wishlistId: wishlist.id,
          productId: req.body.productId,
        },
        update: {},
      });

      res.status(201).json({ success: true, message: "Added to wishlist" });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:productId", async (req: AuthRequest, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.userId },
    });

    if (!wishlist) throw new AppError(404, "Wishlist not found");

    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId: param(req, "productId"),
      },
    });

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
});

export default router;
