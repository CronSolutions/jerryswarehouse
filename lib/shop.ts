import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/public";

export const PRODUCTS_TAG = "products";

export type ProductStatus = "available" | "sold" | "hidden";

export type Product = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  size: string;
  category: string;
  condition: string;
  images: string[];
  status: ProductStatus;
  created_at: string;
};

/** Public CDN URL for an image path stored in the product-images bucket. */
export function productImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/product-images/${path}`;
}

/** Format cents as USD, e.g. 1299 → "$12.99". */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Public catalog — available + sold (so sold items can show "SOLD"), newest first. */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const client = supabasePublic;
    if (!client) return [];
    const { data, error } = await client
      .from("products")
      .select("*")
      .in("status", ["available", "sold"])
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as Product[]) ?? [];
  },
  ["products-list"],
  { tags: [PRODUCTS_TAG], revalidate: 3600 }
);

export const getProduct = unstable_cache(
  async (id: string): Promise<Product | null> => {
    const client = supabasePublic;
    if (!client) return null;
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("id", id)
      .neq("status", "hidden")
      .maybeSingle();
    if (error) return null;
    return (data as Product) ?? null;
  },
  ["product-detail"],
  { tags: [PRODUCTS_TAG], revalidate: 3600 }
);
