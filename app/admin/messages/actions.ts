"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setMessageRead(id: string, read: boolean) {
  if (!(await getAdminUser())) return;
  const supabase = createAdminClient();
  await supabase.from("messages").update({ read }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  if (!(await getAdminUser())) return;
  const supabase = createAdminClient();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin/messages");
}
