-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — site content store
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists public.content (
  section    text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every write
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_touch_updated_at on public.content;
create trigger content_touch_updated_at
  before update on public.content
  for each row execute function public.touch_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.content enable row level security;

-- Public website can READ content
drop policy if exists "Public can read content" on public.content;
create policy "Public can read content"
  on public.content for select
  using (true);

-- Only signed-in admins can WRITE content
drop policy if exists "Authenticated can insert content" on public.content;
create policy "Authenticated can insert content"
  on public.content for insert to authenticated
  with check (true);

drop policy if exists "Authenticated can update content" on public.content;
create policy "Authenticated can update content"
  on public.content for update to authenticated
  using (true) with check (true);

-- ── Seed (only fills missing rows; safe to re-run) ──────────────────────────
insert into public.content (section, data) values
('hero', $$
{
  "headline": "Jerry's\nWarehouse",
  "tagline": "Worcester's Hidden Gem for Unique Finds"
}
$$::jsonb),
('about', $$
{
  "paragraph1": "What started as a small vintage spot has grown into one of Worcester's most-loved hidden gems. Jerry's Warehouse is built on a simple idea — that great things deserve a second life, and everyone deserves the thrill of the find.",
  "paragraph2": "Every rack and shelf is hand-curated, from 90s denim and band tees to one-of-a-kind furniture and collectibles. New treasures arrive constantly, so no two visits are ever the same.",
  "paragraph3": "More than a store, it's a community — a place to dig, to discover, and to leave with something that feels like it was waiting just for you."
}
$$::jsonb)
on conflict (section) do nothing;
