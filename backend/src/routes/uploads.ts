import { Router } from "express";
import multer from "multer";
import { authenticate, type AuthRequest } from "../middleware/auth.js";
import { AppError } from "../lib/errors.js";
import { cloudinary, isCloudinaryConfigured } from "../lib/cloudinary.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

router.post(
  "/image",
  authenticate,
  upload.single("file"),
  async (req: AuthRequest, res, next) => {
    try {
      if (!isCloudinaryConfigured()) {
        throw new AppError(
          503,
          "Image upload not configured. Add CLOUDINARY_* to backend/.env or use an image URL."
        );
      }

      if (!req.file) {
        throw new AppError(400, "No file uploaded");
      }

      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "markethub/products",
        resource_type: "image",
      });

      res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/status", (_req, res) => {
  res.json({ success: true, cloudinary: isCloudinaryConfigured() });
});

export default router;
