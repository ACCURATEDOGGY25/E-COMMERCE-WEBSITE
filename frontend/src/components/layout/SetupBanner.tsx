"use client";

import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";

type DbHealth = {
  status: string;
  database?: string;
  hint?: string;
};

/** Shown when the API is in demo/preview mode (no live database). */
export function SetupBanner() {
  const [health, setHealth] = useState<DbHealth | null>(null);

  useEffect(() => {
    const base = getApiUrl();
    if (!base) return;

    fetch(`${base}/health/db`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: DbHealth) => {
        if (data.database === "demo" || data.status === "error") {
          setHealth(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!health) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      <strong>Preview mode</strong> — browsing only. Login, cart, and checkout need a
      connected database. Run{" "}
      <code className="rounded bg-amber-100 px-1">bash scripts/setup.sh</code> locally, or
      resume the API on Render for production.
      {health.hint && (
        <span className="mt-1 block text-xs text-amber-800">{health.hint}</span>
      )}
    </div>
  );
}
