import { type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RESERVATION_MINUTES = 15;

// Cancels abandoned pending orders and frees their reserved items.
// Note: checkout already treats reservations older than 15 min as expired, so
// the catalog self-heals even without this — this just tidies order statuses.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const cutoff = new Date(
    Date.now() - RESERVATION_MINUTES * 60 * 1000
  ).toISOString();

  const { data: stale } = await supabase
    .from("orders")
    .select("id")
    .eq("status", "pending")
    .lt("created_at", cutoff);

  const ids = (stale ?? []).map((o) => o.id);
  if (ids.length > 0) {
    await supabase
      .from("products")
      .update({ reserved_order_id: null, reserved_at: null })
      .in("reserved_order_id", ids);
    await supabase.from("orders").update({ status: "canceled" }).in("id", ids);
  }

  return NextResponse.json({ canceled: ids.length });
}
