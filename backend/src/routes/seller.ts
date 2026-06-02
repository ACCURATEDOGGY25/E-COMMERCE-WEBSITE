import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { uniqueSlug } from "../utils/slug.js";
import { param } from "../utils/params.js";

const router = Router();

router.use(authenticate);
router.use(authorize("SELLER", "ADMIN"));

async function getVendor(userId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { userId } });
  if (!vendor) throw new AppError(404, "Vendor profile not found");
  if (vendor.status !== "APPROVED" && process.env.NODE_ENV === "production") {
    throw new AppError(403, "Vendor account pending approval");
  }
  return vendor;
}

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  categoryId: z.string(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().int().min(0),
  location: z.string().optional(),
  images: z.array(z.object({ url: z.string().url(), alt: z.string().optional() })).optional(),
});

router.get("/dashboard", async (req: AuthRequest, res, next) => {
  try {
    const vendor = await getVendor(req.user!.userId);

    const [productCount, orderItems, paidItems] = await Promise.all([
      prisma.product.count({ where: { vendorId: vendor.id } }),
      prisma.orderItem.findMany({
        where: { vendorId: vendor.id },
        include: {
          order: { select: { status: true, createdAt: true } },
        },
        orderBy: { order: { createdAt: "desc" } },
        take: 10,
      }),
      prisma.orderItem.findMany({
        where: {
          vendorId: vendor.id,
          order: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        },
        select: { price: true, quantity: true },
      }),
    ]);

    const totalRevenue = paidItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const recentOrders = orderItems.map((item) => ({
      id: item.id,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      orderStatus: item.order.status,
      createdAt: item.order.createdAt,
    }));

    res.json({
      success: true,
      data: {
        vendor,
        stats: {
          productCount,
          totalRevenue,
          pendingOrders: orderItems.filter(
            (i) => i.order.status === "PAID" || i.order.status === "PROCESSING"
          ).length,
        },
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/products", async (req: AuthRequest, res, next) => {
  try {
    const vendor = await getVendor(req.user!.userId);
    const products = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get("/products/:id", async (req: AuthRequest, res, next) => {
  try {
    const vendor = await getVendor(req.user!.userId);
    const product = await prisma.product.findFirst({
      where: { id: param(req, "id"), vendorId: vendor.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!product) throw new AppError(404, "Product not found");

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.post("/products", validateBody(productSchema), async (req: AuthRequest, res, next) => {
  try {
    const vendor = await getVendor(req.user!.userId);
    const { images, ...data } = req.body;

    const slug = await uniqueSlug(data.name, async (s) => {
      const exists = await prisma.product.findUnique({ where: { slug: s } });
      return !!exists;
    });

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        vendorId: vendor.id,
        images: images?.length
          ? {
              create: images.map(
                (img: { url: string; alt?: string }, i: number) => ({
                  url: img.url,
                  alt: img.alt,
                  sortOrder: i,
                })
              ),
            }
          : undefined,
      },
      include: { images: true, category: true },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/products/:id",
  validateBody(productSchema.partial()),
  async (req: AuthRequest, res, next) => {
    try {
      const vendor = await getVendor(req.user!.userId);
      const existing = await prisma.product.findFirst({
        where: { id: param(req, "id"), vendorId: vendor.id },
      });

      if (!existing) throw new AppError(404, "Product not found");

      const { images, ...data } = req.body;

      const product = await prisma.product.update({
        where: { id: param(req, "id") },
        data,
        include: { images: true, category: true },
      });

      if (images) {
        await prisma.productImage.deleteMany({ where: { productId: product.id } });
        await prisma.productImage.createMany({
          data: images.map((img: { url: string; alt?: string }, i: number) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt,
            sortOrder: i,
          })),
        });
      }

      const updated = await prisma.product.findUnique({
        where: { id: product.id },
        include: { images: true, category: true },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/products/:id", async (req: AuthRequest, res, next) => {
  try {
    const vendor = await getVendor(req.user!.userId);
    const existing = await prisma.product.findFirst({
      where: { id: param(req, "id"), vendorId: vendor.id },
    });

    if (!existing) throw new AppError(404, "Product not found");

    await prisma.product.update({
      where: { id: param(req, "id") },
      data: { isActive: false },
    });

    res.json({ success: true, message: "Product deactivated" });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", async (req: AuthRequest, res, next) => {
  try {
    const vendor = await getVendor(req.user!.userId);

    const items = await prisma.orderItem.findMany({
      where: { vendorId: vendor.id },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
          },
        },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
    });

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/orders/:orderId/status",
  validateBody(z.object({ status: z.enum(["PROCESSING", "SHIPPED", "DELIVERED"]) })),
  async (req: AuthRequest, res, next) => {
    try {
      const vendor = await getVendor(req.user!.userId);

      const hasItems = await prisma.orderItem.findFirst({
        where: { orderId: param(req, "orderId"), vendorId: vendor.id },
      });

      if (!hasItems) throw new AppError(404, "Order not found for this vendor");

      const order = await prisma.order.update({
        where: { id: param(req, "orderId") },
        data: { status: req.body.status },
      });

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
