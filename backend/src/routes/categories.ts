import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { param } from "../utils/params.js";
import { isDemoMode } from "../lib/demoMode.js";
import { DEMO_CATEGORIES } from "../lib/demoData.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    if (isDemoMode()) {
      res.setHeader("X-Demo-Mode", "true");
      res.json({ success: true, data: DEMO_CATEGORIES, demo: true });
      return;
    }

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: param(req, "slug") }, { id: param(req, "slug") }],
      },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!category) throw new AppError(404, "Category not found");

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
