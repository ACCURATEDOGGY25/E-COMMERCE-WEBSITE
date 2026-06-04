import { Router } from "express";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { optionalAuth, type AuthRequest } from "../middleware/auth.js";
import { param } from "../utils/params.js";
import { isDemoMode } from "../lib/demoMode.js";
import {
  filterDemoProducts,
  findDemoProduct,
  DEMO_PRODUCTS,
} from "../lib/demoData.js";
import { getCategoryDescendantIds } from "../lib/categoryTree.js";

const router = Router();

function demoHeaders(res: import("express").Response) {
  res.setHeader("X-Demo-Mode", "true");
}

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  location: z.string().optional(),
  vendor: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z
    .enum(["newest", "price_asc", "price_desc", "rating", "popular"])
    .default("newest"),
});

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const query = listQuerySchema.parse(req.query);

    if (isDemoMode()) {
      demoHeaders(res);
      const { data, pagination } = filterDemoProducts(query);
      res.json({ success: true, data, pagination, demo: true });
      return;
    }
    const {
      page,
      limit,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      location,
      vendor,
      featured,
      sort,
    } = query;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      stock: { gt: 0 },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      const categoryIds = await getCategoryDescendantIds(category);
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      } else {
        where.category = {
          OR: [{ slug: category }, { id: category }],
        };
      }
    }

    if (brand) where.brand = { equals: brand, mode: "insensitive" };
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (featured) where.isFeatured = true;
    if (minRating) where.rating = { gte: minRating };

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (vendor) {
      where.vendor = {
        OR: [{ slug: vendor }, { id: vendor }],
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    switch (sort) {
      case "price_asc":
        orderBy.push({ price: "asc" });
        break;
      case "price_desc":
        orderBy.push({ price: "desc" });
        break;
      case "rating":
        orderBy.push({ rating: "desc" });
        break;
      case "popular":
        orderBy.push({ reviewCount: "desc" });
        break;
      default:
        orderBy.push({ createdAt: "desc" });
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: { select: { id: true, name: true, slug: true } },
          vendor: { select: { id: true, storeName: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/search/autocomplete", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (q.length < 2) {
      res.json({ success: true, suggestions: [] });
      return;
    }

    if (isDemoMode()) {
      demoHeaders(res);
      const suggestions = DEMO_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase())
      )
        .slice(0, 8)
        .map((p) => ({ id: p.id, name: p.name, slug: p.slug }));
      res.json({ success: true, suggestions });
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        name: { contains: q, mode: "insensitive" },
      },
      select: { id: true, name: true, slug: true },
      take: 8,
    });

    res.json({ success: true, suggestions: products });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", optionalAuth, async (req, res, next) => {
  try {
    const slug = param(req, "slug");

    if (isDemoMode()) {
      demoHeaders(res);
      const product = findDemoProduct(slug);
      if (!product) throw new AppError(404, "Product not found");
      const related = DEMO_PRODUCTS.filter(
        (p) => p.categoryId === product.categoryId && p.id !== product.id
      ).slice(0, 8);
      res.json({
        success: true,
        data: {
          ...product,
          reviews: [
            {
              id: "r1",
              rating: 5,
              title: "Excellent!",
              comment: "Exactly as described. Fast shipping.",
              user: { id: "u1", name: "Sarah M.", avatar: null },
            },
          ],
        },
        related,
        demo: true,
      });
      return;
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        vendor: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            logo: true,
            description: true,
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
        },
      },
    });

    if (!product) throw new AppError(404, "Product not found");

    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 8,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        vendor: { select: { storeName: true, slug: true } },
      },
    });

    res.json({ success: true, data: product, related });
  } catch (error) {
    next(error);
  }
});

export default router;
