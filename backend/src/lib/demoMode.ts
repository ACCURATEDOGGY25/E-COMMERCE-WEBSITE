/** True when Supabase URLs are still placeholders — serve read-only demo catalog. */
export function isDemoMode(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return (
    url.includes("PROJECT_REF") ||
    url.includes("YOUR_PASSWORD") ||
    url.includes("REGION.pooler")
  );
}
