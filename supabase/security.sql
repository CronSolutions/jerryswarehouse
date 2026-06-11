-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — LOCK DOWN content writes to admins only
-- Run this in the Supabase SQL Editor AFTER schema.sql.
--
-- Why: the seed policies allowed ANY authenticated user to write content.
-- Since the anon key is public and Supabase can create users, that's unsafe.
-- This restricts writes to a managed allowlist, enforced at the database layer
-- (so it can't be bypassed by calling the REST API directly).
-- ───────────────────────────────────────────────────────────────────────────

-- Allowlist of admin emails. RLS enabled with NO policies = only the service
-- role / dashboard can touch it; nobody can read or edit it via the API.
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;

-- SECURITY DEFINER lets this read public.admins regardless of RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- Replace the permissive write policies with admin-only ones.
drop policy if exists "Authenticated can insert content" on public.content;
drop policy if exists "Authenticated can update content" on public.content;

create policy "Admins can insert content" on public.content
  for insert to authenticated
  with check (public.is_admin());

create policy "Admins can update content" on public.content
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Add your admin email(s) here ────────────────────────────────────────────
insert into public.admins (email) values
  ('owner@example.com')      -- ← change to the real owner email
on conflict (email) do nothing;
