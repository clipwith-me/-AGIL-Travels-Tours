-- AGIL Travels — Supabase schema
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Covers the two Week-1 enquiry flows:
--   • visa_enquiries  — Tier-2 visa enquiry form (UK/US/Schengen/other)
--   • tour_enquiries  — custom / personalized tour itinerary requests
-- Both are "staff follows up manually" flows — no automated status emails here.
-- (The Tier-1 UAE visa application portal + status dashboard comes in Week 2.)

-- ---------------------------------------------------------------------------
-- Visa enquiries (Tier 2)
-- ---------------------------------------------------------------------------
create table if not exists public.visa_enquiries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  country       text not null,
  visa_type     text not null,
  full_name     text not null,
  email         text not null,
  phone         text not null,
  message       text,
  status        text not null default 'new',   -- new | contacted | closed
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tour enquiries (custom itineraries)
-- ---------------------------------------------------------------------------
create table if not exists public.tour_enquiries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  full_name     text not null,
  email         text not null,
  phone         text not null,
  destination   text,                          -- where / what they're interested in
  travellers    int,
  travel_dates  text,
  budget_range  text,
  message       text,
  status        text not null default 'new',   -- new | contacted | closed
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Writes happen ONLY from our server route handlers using the service-role key,
-- which bypasses RLS. So we enable RLS and add NO public policies — anon/public
-- clients cannot read or write these tables directly.
-- ---------------------------------------------------------------------------
alter table public.visa_enquiries enable row level security;
alter table public.tour_enquiries enable row level security;
