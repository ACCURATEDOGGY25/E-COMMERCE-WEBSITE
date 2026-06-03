"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { uploadImage, ApiError } from "@/lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({ value, onChange, label = "Product image" }: Props) {
  const { token } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setError("");

    try {
      const { url } = await uploadImage(file, token);
      onChange(url);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Upload failed — paste an image URL below instead"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-2 flex flex-wrap items-start gap-4">
        {value && (
          <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-gray-50">
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-primary-400 hover:text-primary-600">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading || !token}
            onChange={handleFile}
          />
        </label>
      </div>
      <input
        type="url"
        className="input mt-3"
        placeholder="Or paste image URL (https://...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-amber-700">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">
        Cloudinary upload when configured in backend/.env; URL always works.
      </p>
    </div>
  );
}
