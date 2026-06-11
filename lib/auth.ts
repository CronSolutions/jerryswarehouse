import { createClient } from "@/lib/supabase/server";

/** Parsed allowlist from ADMIN_EMAILS (comma-separated, lowercased). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Fail-closed: an empty allowlist means nobody is an admin. */
export function isAllowedEmail(email?: string | null): boolean {
  const list = adminEmails();
  if (list.length === 0) return false;
  return !!email && list.includes(email.toLowerCase());
}

/** Returns the signed-in user only if they're an allowlisted admin, else null. */
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAllowedEmail(user.email)) return null;
  return user;
}
