import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { isAppError } from "../lib/errors.js";

function isDatabaseConfigError(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientInitializationError)) return false;
  const msg = err.message;
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("Environment variable not found") ||
    msg.includes("PROJECT_REF") ||
    msg.includes("YOUR_PASSWORD")
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (isAppError(err)) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (isDatabaseConfigError(err)) {
    res.status(503).json({
      success: false,
      message:
        "Database unavailable. Add your Supabase credentials to backend/.env, then run: npm run setup",
      code: "DATABASE_UNAVAILABLE",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
