import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
});

router.post("/", authenticate, validateBody(reviewSchema), async (req: AuthRequest, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError(404, "Product not found");

    const review = await prisma.review.upsert({
      where: {
        userId_productId: {
          userId: req.user!.userId,
          productId,
        },
      },
      create: {
        userId: req.user!.userId,
        productId,
        rating,
        title,
        comment,
      },
      update: { rating, title, comment },
    });

    const aggregates = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregates._avg.rating || 0,
        reviewCount: aggregates._count,
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

export default router;
