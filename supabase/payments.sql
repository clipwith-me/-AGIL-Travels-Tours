-- AGIL Travels — payments table
-- Run this in Supabase → SQL Editor (in addition to schema.sql).
--
-- Records every payment attempt across providers (Stripe + Ziina). Rows start
-- 'pending' when a checkout is created and move to 'paid' / 'failed' /
-- 'cancelled' via the provider webhook / return verification.

create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique,          -- AGIL-P-XXXXXX
  provider       text not null,                 -- stripe | ziina
  provider_ref   text,                          -- Stripe session id / Ziina intent id
  amount         integer not null,              -- MINOR units (cents / fils)
  currency       text not null,                 -- e.g. usd, aed
  description     text,
  customer_email text,
  status         text not null default 'pending', -- pending | paid | failed | cancelled
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists payments_reference_idx on public.payments (reference);

-- Writes only via the server service-role key (bypasses RLS). No public policies.
alter table public.payments enable row level security;
