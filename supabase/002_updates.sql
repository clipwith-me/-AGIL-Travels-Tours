-- AGIL Travels — schema updates (run in Supabase SQL Editor, after schema.sql)
-- Adds: nationality on visa enquiries; hotel/apartment enquiries table.

-- Nationality on the Tier-2 visa enquiry form.
alter table public.visa_enquiries
  add column if not exists nationality text;

-- Hotel & apartment rental enquiries (no live API yet — structured request that
-- staff follow up on via WhatsApp/email).
create table if not exists public.hotel_enquiries (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,          -- AGIL-H-XXXXXX
  country       text not null,
  city          text not null,
  check_in      date,
  check_out     date,
  rooms         integer,
  adults        integer,
  children      integer,
  star_rating   text,
  hotel_name    text,
  full_name     text not null,
  email         text not null,
  phone         text not null,
  notes         text,
  status        text not null default 'new',   -- new | contacted | closed
  created_at    timestamptz not null default now()
);

alter table public.hotel_enquiries enable row level security;
