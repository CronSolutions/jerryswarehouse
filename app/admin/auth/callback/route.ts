import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Restrict access to an allowlist of admin emails (ADMIN_EMAILS, comma-separated).
      const allowed = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (
        allowed.length > 0 &&
        (!user?.email || !allowed.includes(user.email.toLowerCase()))
      ) {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/admin/login?error=not-allowed`);
      }

      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth`);
}
