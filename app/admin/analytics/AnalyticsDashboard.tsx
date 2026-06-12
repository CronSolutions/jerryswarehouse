"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { signOut } from "../actions";
import { formatPrice } from "@/lib/shop";
import type { Analytics } from "@/lib/analytics";

const AMBER = "#c49335";
const PIE_COLORS = ["#c49335", "#8a6420"];

export default function AnalyticsDashboard({
  email,
  data,
}: {
  email: string;
  data: Analytics;
}) {
  const revenueSeries = data.salesByDay.map((d) => ({
    date: d.date.slice(5).replace("-", "/"), // MM/DD
    revenue: d.cents / 100,
  }));
  const categorySales = data.salesByCategory.map((c) => ({
    category: c.category,
    sales: c.cents / 100,
    units: c.count,
  }));
  const monthSeries = data.revenueByMonth.map((m) => ({
    month: new Date(`${m.month}-01T00:00:00`).toLocaleString("en-US", {
      month: "short",
    }),
    revenue: m.cents / 100,
  }));
  const hasSales = data.totalOrders > 0;

  return (
    <div className="min-h-screen bg-[#faf6ed] text-[#4a2c0a]">
      <header className="border-b border-[#e8d8c0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="leading-none">
            <span className="font-serif text-2xl font-bold text-[#c49335]">Jerry&apos;s</span>
            <span className="font-serif text-xs tracking-[0.3em] uppercase text-[#9a6840] ml-2">
              Analytics
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-xs text-[#9a6840]">{email}</span>
            <a href="/admin" className="text-[#6e4218] hover:text-[#c49335] transition-colors">
              Site text
            </a>
            <a href="/admin/products" className="text-[#6e4218] hover:text-[#c49335] transition-colors">
              Shop
            </a>
            <a href="/admin/messages" className="text-[#6e4218] hover:text-[#c49335] transition-colors">
              Messages
            </a>
            <form action={signOut}>
              <button className="font-medium text-[#6e4218] hover:text-[#c49335] transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <h1 className="font-serif text-3xl font-bold">Analytics</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Stat label="Total revenue" value={formatPrice(data.totalRevenueCents)} />
          <Stat label="Orders" value={String(data.totalOrders)} />
          <Stat label="Avg order value" value={formatPrice(data.averageOrderCents)} />
          <Stat label="Items sold" value={String(data.totalItemsSold)} />
          <Stat label="Items listed" value={String(data.availableCount)} />
          <Stat
            label="Avg days to sell"
            value={data.avgDaysToSell == null ? "—" : `${data.avgDaysToSell} days`}
          />
        </div>

        {/* Revenue over time */}
        <Panel title="Revenue — last 30 days">
          {hasSales ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={AMBER} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d8c0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9a6840" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#9a6840" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke={AMBER} strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Empty>No sales yet — your revenue graph will appear here.</Empty>
          )}
        </Panel>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Revenue by month */}
          <Panel title="Revenue by month (last 6)">
            {hasSales ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8d8c0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9a6840" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9a6840" }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill={AMBER} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty>No sales yet.</Empty>
            )}
          </Panel>

          {/* Top sellers */}
          <Panel title="Top sellers">
            {data.topProducts.length ? (
              <ul className="divide-y divide-[#f0e7d8]">
                {data.topProducts.map((p, i) => (
                  <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-[#4a2c0a] truncate pr-3">
                      <span className="text-[#9a6840] mr-2">{i + 1}.</span>
                      {p.name}
                    </span>
                    <span className="text-[#6e4218] whitespace-nowrap">
                      {p.units} sold · {formatPrice(p.revenueCents)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No sales yet.</Empty>
            )}
          </Panel>

          {/* Sales by category */}
          <Panel title="Sales by category ($)">
            {categorySales.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categorySales} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8d8c0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#9a6840" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9a6840" }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, "Sales"]} />
                  <Bar dataKey="sales" fill={AMBER} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty>No sales yet.</Empty>
            )}
          </Panel>

          {/* Units sold by category */}
          <Panel title="Units sold by category">
            {categorySales.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categorySales} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8d8c0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#9a6840" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9a6840" }} />
                  <Tooltip formatter={(v: any) => [v, "Units"]} />
                  <Bar dataKey="units" fill="#8a6420" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty>No sales yet.</Empty>
            )}
          </Panel>

          {/* Listed inventory by category */}
          <Panel title="Listed inventory by category">
            {data.listedByCategory.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.listedByCategory} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8d8c0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#9a6840" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9a6840" }} />
                  <Tooltip formatter={(v: any) => [v, "Listed"]} />
                  <Bar dataKey="count" fill="#d4a853" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty>No items listed yet.</Empty>
            )}
          </Panel>

          {/* Fulfillment split */}
          <Panel title="Pickup vs. shipping">
            {hasSales ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Pickup", value: data.fulfillment.pickup },
                      { name: "Shipping", value: data.fulfillment.shipping },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {PIE_COLORS.map((c) => (
                      <Cell key={c} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty>No orders yet.</Empty>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[#e8d8c0] rounded-xl p-5">
      <p className="text-xs uppercase tracking-wide text-[#9a6840] mb-1">{label}</p>
      <p className="font-serif text-2xl font-bold text-[#4a2c0a]">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e8d8c0] rounded-xl p-5">
      <h2 className="text-sm font-semibold text-[#4a2c0a] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[200px] flex items-center justify-center text-sm text-[#9a6840] text-center px-4">
      {children}
    </div>
  );
}
