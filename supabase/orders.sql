-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — Orders (created server-side via the service role)
-- Run AFTER shop.sql.
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists public.orders (
  id                     uuid primary key default gen_random_uuid(),
  square_order_id        text,
  square_payment_link_id text,
  status                 text not null default 'pending'
                         check (status in ('pending', 'paid', 'canceled')),
  fulfillment            text not null check (fulfillment in ('pickup', 'shipping')),
  subtotal_cents         integer not null default 0,
  shipping_cents         integer not null default 0,
  total_cents            integer not null default 0,
  created_at             timestamptz not null default now()
);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  name        text not null,
  price_cents integer not null
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- RLS on, NO policies → unreachable via anon/authenticated API.
-- All order access happens server-side with the service-role key (bypasses RLS).
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Track which item belongs to which open order (prevents double-selling).
alter table public.products
  add column if not exists reserved_order_id uuid references public.orders(id) on delete set null;
