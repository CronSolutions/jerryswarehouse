-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — reservation lock + tax columns
-- Run AFTER orders.sql.
-- ───────────────────────────────────────────────────────────────────────────

-- When a checkout starts, the item is reserved with a timestamp so a second
-- buyer can't pay for the same one-of-a-kind piece. Reservations expire.
alter table public.products
  add column if not exists reserved_at timestamptz;

create index if not exists products_reserved_idx on public.products (reserved_at);

-- Sales tax captured on the order.
alter table public.orders
  add column if not exists tax_cents integer not null default 0;
