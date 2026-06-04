import { getUpstreamApiUrl } from "./backendUrl";

export function getApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  if (typeof window === "undefined") {
    const upstream = getUpstreamApiUrl();
    if (upstream && !upstream.includes("onrender.com")) return upstream;
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/backend`;
    }
    return upstream;
  }

  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    const pub = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (pub && !pub.includes("onrender.com")) return pub.replace(/\/$/, "");
    return "/api/backend";
  }

  return "http://localhost:4000";
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const base = getApiUrl();
  if (!base) {
    throw new ApiError(503, "API URL not configured");
  }

  const res = await fetch(`${base}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data.message || "Request failed",
      data.errors
    );
  }

  return data as T;
}

export async function uploadImage(
  file: File,
  token: string
): Promise<{ url: string; publicId: string }> {
  const base = getApiUrl();
  if (!base) throw new ApiError(503, "API URL not configured");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${base}/api/uploads/image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, data.message || "Upload failed");
  }
  return data.data as { url: string; publicId: string };
}
