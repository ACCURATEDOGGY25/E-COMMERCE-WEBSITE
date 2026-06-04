/** Upstream MarketHub API (server-only on Vercel; also used by the /api/backend proxy). */
export function getUpstreamApiUrl(): string {
  const fromEnv =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  // Default production API (set API_URL in Vercel env when Render is live)
  return "https://markethub-api.onrender.com";
}
