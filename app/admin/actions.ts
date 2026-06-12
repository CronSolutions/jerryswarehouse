"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";

const ALLOWED_SECTIONS = new Set([
  "hero",
  "about",
  "store_info",
  "hours",
  "value_props",
  "reviews",
  "categories",
  "footer",
  "media",
]);

/** Upsert one content section, then refresh the cached public site. */
export async function saveSection(
  section: string,
  data: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  // Authorize: must be an allowlisted admin
  const user = await getAdminUser();
  if (!user) return { ok: false, error: "Not authorized." };

  // Validate the section name (don't let arbitrary keys be written)
  if (!ALLOWED_SECTIONS.has(section)) {
    return { ok: false, error: "Unknown section." };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("content")
    .upsert({ section, data }, { onConflict: "section" });

  if (error) return { ok: false, error: error.message };

  revalidateTag(CONTENT_TAG);
  return { ok: true };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
