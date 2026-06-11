"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth";
import { PRODUCTS_TAG, type ProductStatus } from "@/lib/shop";

export type ProductInput = {
  name: string;
  description: string;
  price_cents: number;
  size: string;
  category: string;
  condition: string;
  images: string[];
  status: ProductStatus;
};

type Result = { ok: true } | { ok: false; error: string };

function validate(input: ProductInput): string | null {
  if (!input.name.trim()) return "Name is required.";
  if (!Number.isInteger(input.price_cents) || input.price_cents < 0)
    return "Price must be a valid amount.";
  return null;
}

function refresh() {
  revalidateTag(PRODUCTS_TAG);
  revalidatePath("/shop");
}

export async function createProduct(input: ProductInput): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: "Not authorized." };
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createClient();
  const { error } = await supabase.from("products").insert(input);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: "Not authorized." };
  const err = validate(input);
  if (err) return { ok: false, error: err };

  const supabase = createClient();
  const { error } = await supabase.from("products").update(input).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function setProductStatus(
  id: string,
  status: ProductStatus
): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: "Not authorized." };
  const supabase = createClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function deleteProduct(
  id: string,
  imagePaths: string[]
): Promise<Result> {
  if (!(await getAdminUser())) return { ok: false, error: "Not authorized." };
  const supabase = createClient();

  if (imagePaths.length > 0) {
    await supabase.storage.from("product-images").remove(imagePaths);
  }
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}
