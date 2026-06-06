import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

const isDev = process.env.NODE_ENV === "development";

/** API URL for production builds (dashboard env overrides this file). */
function productionApiUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.API_URL?.trim() || "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  try {
    const file = readFileSync(join(__dirname, "..", "config", "production-api-url.txt"), "utf8");
    const url = file.trim().split("\n")[0]?.trim();
    if (url && !url.startsWith("#")) return url.replace(/\/$/, "");
  } catch {
    /* optional file */
  }
  return "https://markethub-api.onrender.com";
}

const publicApiUrl = productionApiUrl();

const nextConfig: NextConfig = {
  env: {
    API_URL: publicApiUrl,
    NEXT_PUBLIC_API_URL: publicApiUrl,
  },
  images: {
    // Dev + Cloudflare tunnel: Next image optimizer often 400; direct URLs work
    unoptimized: isDev || process.env.IMAGES_UNOPTIMIZED === "1",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
