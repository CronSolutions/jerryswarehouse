"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_TAG } from "@/lib/content";

/** Upsert one content section, then refresh the cached public site. */
export async function saveSection(
  section: string,
  data: Record<string, unknown>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

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
