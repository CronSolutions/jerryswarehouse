import { createClient } from "@/lib/supabase/client";

const MAX_DIMENSION = 1600; // px — cap the longest edge
const QUALITY = 0.82;

/** Resize (keeping aspect ratio) and re-encode an image File to a WebP Blob. */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY)
  );
  if (!blob) throw new Error("Image conversion failed");
  return blob;
}

/**
 * Compress an image and upload it to the product-images bucket.
 * Returns the storage path to persist on the product row.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const blob = await compressImage(file);
  const path = `${crypto.randomUUID()}.webp`;
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, blob, { contentType: "image/webp", upsert: false });
  if (error) throw new Error(error.message);
  return path;
}

/** Remove images from storage (best-effort; used when deleting/replacing). */
export async function deleteProductImages(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const supabase = createClient();
  await supabase.storage.from("product-images").remove(paths);
}
