-- AGIL Travels — staff accounts & roles (run in Supabase SQL Editor).
-- Replaces the shared-password gate with real per-user logins (Supabase Auth)
-- plus roles and a permission level.
--
-- Prereq: Supabase Auth email/password sign-in is enabled (default).

create table if not exists public.staff_users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'staff',   -- admin | staff
  -- permission level: true = "unlimited" (can approve/decline applications),
  --                   false = "limited" (view-only).
  can_manage  boolean not null default false,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Profiles are read/written only via the server service-role key. No public policies.
alter table public.staff_users enable row level security;
