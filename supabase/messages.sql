-- ───────────────────────────────────────────────────────────────────────────
-- Jerry's Warehouse — contact form messages
-- ───────────────────────────────────────────────────────────────────────────

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_idx on public.messages (created_at desc);

-- RLS on, NO policies → unreachable via anon/authenticated API.
-- Inserts (contact form) and reads (admin) both go through server actions using
-- the service-role key, which bypasses RLS.
alter table public.messages enable row level security;
