import { Router } from "express";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { param } from "../utils/params.js";

const router = Router();
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

router.use(authenticate);

const checkoutSchema = z.object({
  shippingStreet: z.string().min(3),
  shippingCity: z.string().min(2),
  shippingState: z.string().optional(),
  shippingCountry: z.string().min(2),
  shippingZip: z.string().min(3),
});

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${date}-${rand}`;
}

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: { images: { take: 1 } },
            },
          },
        },
        payment: true,
      },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: param(req, "id"), userId: req.user!.userId },
      include: {
        items: {
          include: {
            product: { include: { images: { take: 1 } } },
          },
        },
        payment: true,
      },
    });

    if (!order) throw new AppError(404, "Order not found");

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.post("/checkout", validateBody(checkoutSchema), async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const shipping = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart?.items.length) {
      throw new AppError(400, "Cart is empty");
    }

    for (const item of cart.items) {
      if (!item.product.isActive || item.product.stock < item.quantity) {
        throw new AppError(400, `Insufficient stock for ${item.product.name}`);
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingCost = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          subtotal,
          shipping: shippingCost,
          tax,
          total,
          status: "PENDING",
          ...shipping,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              vendorId: item.product.vendorId,
              quantity: item.quantity,
              price: item.product.price,
              name: item.product.name,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      await tx.payment.create({
        data: {
          orderId: created.id,
          amount: total,
          status: "PENDING",
        },
      });

      await tx.notification.create({
        data: {
          userId,
          title: "Order placed",
          message: `Your order ${created.orderNumber} has been placed.`,
          type: "order",
          link: `/orders/${created.id}`,
        },
      });

      return created;
    });

    let clientSecret: string | null = null;

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(total) * 100),
        currency: "usd",
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
        automatic_payment_methods: { enabled: true },
      });

      await prisma.payment.update({
        where: { orderId: order.id },
        data: { stripePaymentId: paymentIntent.id },
      });

      clientSecret = paymentIntent.client_secret;
    }

    res.status(201).json({
      success: true,
      data: order,
      payment: {
        clientSecret,
        mockMode: !stripe,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/confirm-payment", async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: param(req, "id"), userId: req.user!.userId },
      include: { payment: true },
    });

    if (!order) throw new AppError(404, "Order not found");

    if (!stripe && process.env.NODE_ENV !== "production") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        }),
        prisma.payment.update({
          where: { orderId: order.id },
          data: { status: "COMPLETED" },
        }),
      ]);

      res.json({ success: true, message: "Payment confirmed (mock mode)" });
      return;
    }

    if (!order.payment?.stripePaymentId) {
      throw new AppError(400, "No payment intent found");
    }

    const intent = await stripe!.paymentIntents.retrieve(
      order.payment.stripePaymentId
    );

    if (intent.status === "succeeded") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        }),
        prisma.payment.update({
          where: { orderId: order.id },
          data: { status: "COMPLETED" },
        }),
      ]);
      res.json({ success: true, message: "Payment confirmed" });
    } else {
      res.json({
        success: false,
        message: "Payment not completed",
        status: intent.status,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
