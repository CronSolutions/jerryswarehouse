import { createAdminClient } from "@/lib/supabase/admin";

export type CategoryStat = { category: string; cents: number; count: number };
export type DayStat = { date: string; cents: number };

export type TopProduct = { name: string; units: number; revenueCents: number };
export type MonthStat = { month: string; cents: number };

export type Analytics = {
  totalRevenueCents: number;
  totalOrders: number;
  totalItemsSold: number;
  availableCount: number;
  soldCount: number;
  averageOrderCents: number;
  avgDaysToSell: number | null;
  salesByDay: DayStat[];
  salesByCategory: CategoryStat[];
  listedByCategory: { category: string; count: number }[];
  fulfillment: { pickup: number; shipping: number };
  topProducts: TopProduct[];
  revenueByMonth: MonthStat[];
};

const UNCATEGORIZED = "Uncategorized";
const DAYS = 30;

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function getAnalytics(): Promise<Analytics> {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: products }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total_cents, created_at, fulfillment")
      .eq("status", "paid"),
    supabase.from("products").select("category, status"),
  ]);

  const paid = orders ?? [];
  const paidIds = paid.map((o) => o.id);

  // Sold line items, joined to their product's category + created date
  type ProdRel = { category?: string; created_at?: string };
  type Joined = {
    price_cents: number;
    name: string;
    order_id: string;
    products: ProdRel | ProdRel[] | null;
  };
  let items: Joined[] = [];
  if (paidIds.length > 0) {
    const { data } = await supabase
      .from("order_items")
      .select("price_cents, name, order_id, products(category, created_at)")
      .in("order_id", paidIds);
    items = (data as unknown as Joined[]) ?? [];
  }
  const prodOf = (it: Joined): ProdRel | null =>
    Array.isArray(it.products) ? it.products[0] ?? null : it.products;
  const categoryOf = (it: Joined): string =>
    prodOf(it)?.category?.trim() || UNCATEGORIZED;

  const orderDateById = new Map<string, string>();
  for (const o of paid) orderDateById.set(o.id, o.created_at);

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalRevenueCents = paid.reduce((s, o) => s + (o.total_cents ?? 0), 0);
  const totalOrders = paid.length;
  const totalItemsSold = items.length;

  const allProducts = products ?? [];
  const availableCount = allProducts.filter((p) => p.status === "available").length;
  const soldCount = allProducts.filter((p) => p.status === "sold").length;

  // ── Sales by day (last 30 days, zero-filled) ───────────────────────────────
  const dayMap = new Map<string, number>();
  for (const o of paid) {
    const k = dayKey(new Date(o.created_at));
    dayMap.set(k, (dayMap.get(k) ?? 0) + (o.total_cents ?? 0));
  }
  const salesByDay: DayStat[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    salesByDay.push({ date: k, cents: dayMap.get(k) ?? 0 });
  }

  // ── Sales by category ($ and units) ────────────────────────────────────────
  const catMap = new Map<string, { cents: number; count: number }>();
  for (const it of items) {
    const cat = categoryOf(it);
    const cur = catMap.get(cat) ?? { cents: 0, count: 0 };
    cur.cents += it.price_cents ?? 0;
    cur.count += 1;
    catMap.set(cat, cur);
  }
  const salesByCategory: CategoryStat[] = Array.from(catMap.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.cents - a.cents);

  // ── Listed inventory by category (available only) ──────────────────────────
  const listMap = new Map<string, number>();
  for (const p of allProducts) {
    if (p.status !== "available") continue;
    const cat = p.category?.trim() || UNCATEGORIZED;
    listMap.set(cat, (listMap.get(cat) ?? 0) + 1);
  }
  const listedByCategory = Array.from(listMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // ── Fulfillment split ──────────────────────────────────────────────────────
  const fulfillment = { pickup: 0, shipping: 0 };
  for (const o of paid) {
    if (o.fulfillment === "shipping") fulfillment.shipping += 1;
    else fulfillment.pickup += 1;
  }

  // ── Average order value ─────────────────────────────────────────────────────
  const averageOrderCents = totalOrders
    ? Math.round(totalRevenueCents / totalOrders)
    : 0;

  // ── Top selling items (by units, then revenue) ─────────────────────────────
  const prodMap = new Map<string, { units: number; revenueCents: number }>();
  for (const it of items) {
    const cur = prodMap.get(it.name) ?? { units: 0, revenueCents: 0 };
    cur.units += 1;
    cur.revenueCents += it.price_cents ?? 0;
    prodMap.set(it.name, cur);
  }
  const topProducts: TopProduct[] = Array.from(prodMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.units - a.units || b.revenueCents - a.revenueCents)
    .slice(0, 8);

  // ── Average days to sell ────────────────────────────────────────────────────
  let dtsTotal = 0;
  let dtsCount = 0;
  for (const it of items) {
    const created = prodOf(it)?.created_at;
    const sold = orderDateById.get(it.order_id);
    if (!created || !sold) continue;
    const days = (new Date(sold).getTime() - new Date(created).getTime()) / 86400000;
    if (days >= 0) {
      dtsTotal += days;
      dtsCount += 1;
    }
  }
  const avgDaysToSell = dtsCount ? Math.round(dtsTotal / dtsCount) : null;

  // ── Revenue by month (last 6 months, zero-filled) ──────────────────────────
  const monthMap = new Map<string, number>();
  for (const o of paid) {
    const k = new Date(o.created_at).toISOString().slice(0, 7); // YYYY-MM
    monthMap.set(k, (monthMap.get(k) ?? 0) + (o.total_cents ?? 0));
  }
  const revenueByMonth: MonthStat[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const k = d.toISOString().slice(0, 7);
    revenueByMonth.push({ month: k, cents: monthMap.get(k) ?? 0 });
  }

  return {
    totalRevenueCents,
    totalOrders,
    totalItemsSold,
    availableCount,
    soldCount,
    averageOrderCents,
    avgDaysToSell,
    salesByDay,
    salesByCategory,
    listedByCategory,
    fulfillment,
    topProducts,
    revenueByMonth,
  };
}
