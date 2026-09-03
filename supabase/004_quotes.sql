-- AGIL Travels — instant-quote requests (run in Supabase SQL Editor).
-- Leads from the /quote budget calculator; staff follow up with a firm quote.

create table if not exists public.quote_requests (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,          -- AGIL-Q-XXXXXX
  full_name     text not null,
  email         text not null,
  phone         text not null,
  destination   text,
  travellers    integer,
  nights        integer,
  services      text[],                        -- selected service keys
  hotel_rating  text,
  tour_category text,
  estimate_aed  integer,                        -- indicative estimate shown to the customer
  currency      text,
  notes         text,
  status        text not null default 'new',   -- new | contacted | closed
  created_at    timestamptz not null default now()
);

alter table public.quote_requests enable row level security;
