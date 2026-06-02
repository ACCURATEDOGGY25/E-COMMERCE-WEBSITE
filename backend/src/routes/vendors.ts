import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { param } from "../utils/params.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED" },
      select: {
        id: true,
        storeName: true,
        slug: true,
        logo: true,
        description: true,
        _count: { select: { products: true } },
      },
      take: 12,
    });

    res.json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: {
        OR: [{ slug: param(req, "slug") }, { id: param(req, "slug") }],
        status: "APPROVED",
      },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
          },
          take: 24,
        },
      },
    });

    if (!vendor) throw new AppError(404, "Vendor not found");

    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
});

export default router;
