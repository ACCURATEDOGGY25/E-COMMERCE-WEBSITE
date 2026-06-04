/** Upstream MarketHub API (server-only on Vercel; also used by the /api/backend proxy). */
export function getUpstreamApiUrl(): string {
  const fromEnv =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://markethub-api.onrender.com";
}
