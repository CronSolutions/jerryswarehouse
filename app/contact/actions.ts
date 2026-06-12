"use server";

import { createAdminClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !EMAIL_RE.test(email) || !message) {
    return { ok: false, error: "Please fill in all fields with a valid email." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("messages")
      .insert({ name, email, message });
    if (error) {
      console.error("[contact] insert:", error);
      return { ok: false, error: "Could not send your message. Please try again." };
    }
    return { ok: true };
  } catch (e) {
    console.error("[contact] action:", e);
    return { ok: false, error: "Could not send your message. Please try again." };
  }
}
