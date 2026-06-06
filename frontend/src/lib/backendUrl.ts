/** Upstream MarketHub API (server-only on Vercel; also used by the /api/backend proxy). */
export function getUpstreamApiUrl(): string {
  const fromEnv =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:4000";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/backend`;
  }

  return (
    process.env.RENDER_API_URL?.trim()?.replace(/\/$/, "") ||
    "https://markethub-api.onrender.com"
  );
}
