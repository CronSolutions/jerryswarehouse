-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — Shop (products + image storage)
-- Run AFTER schema.sql and security.sql (it reuses public.is_admin()).
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  size        text not null default '',
  category    text not null default '',
  condition   text not null default '',
  images      text[] not null default '{}',   -- storage paths in the product-images bucket
  status      text not null default 'available'
              check (status in ('available', 'sold', 'hidden')),
  created_at  timestamptz not null default now()
);

create index if not exists products_status_created_idx
  on public.products (status, created_at desc);

alter table public.products enable row level security;

-- Public can read everything except hidden drafts
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (status <> 'hidden');

-- Admins can read/write everything
drop policy if exists "Admins read all products" on public.products;
create policy "Admins read all products"
  on public.products for select to authenticated
  using (public.is_admin());

drop policy if exists "Admins write products" on public.products;
create policy "Admins write products"
  on public.products for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Storage bucket for product images (public read, admin write) ────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins manage product images" on storage.objects;
create policy "Admins manage product images"
  on storage.objects for all to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
