import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { param } from "../utils/params.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.userId, read: false },
    });

    res.json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    next(error);
  }
});

router.patch("/read-all", async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { id: param(req, "id"), userId: req.user!.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
