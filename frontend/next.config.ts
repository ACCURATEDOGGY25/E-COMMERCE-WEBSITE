import type { NextConfig } from "next";
import { readFileSync } from "fs";
import { join } from "path";

const isDev = process.env.NODE_ENV === "development";

/** Bake tunnel/API URL from repo vercel.json when Vercel dashboard env is unset. */
function apiUrlFromVercelJson(): string {
  try {
    const raw = readFileSync(join(__dirname, "..", "vercel.json"), "utf8");
    const j = JSON.parse(raw) as { env?: { API_URL?: string; NEXT_PUBLIC_API_URL?: string } };
    return (
      process.env.NEXT_PUBLIC_API_URL?.trim() ||
      process.env.API_URL?.trim() ||
      j.env?.NEXT_PUBLIC_API_URL?.trim() ||
      j.env?.API_URL?.trim() ||
      ""
    );
  } catch {
    return process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.API_URL?.trim() || "";
  }
}

const publicApiUrl = apiUrlFromVercelJson();

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
