-- AGIL Travels — UAE visa portal (Tier 1)
-- Run in Supabase → SQL Editor (after schema.sql / payments.sql).
--
-- Tables for the UAE visa application flow + a PRIVATE storage bucket for the
-- uploaded documents. Documents are written/read only via signed URLs created
-- with the server service-role key, so the bucket has no public policies.

-- Applications ---------------------------------------------------------------
create table if not exists public.visa_applications (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,        -- AGIL-UAE-XXXXXX
  visa_type       text not null,               -- 96hrs | 30-day | 60-day
  full_name       text not null,
  email           text not null,
  phone           text not null,
  nationality     text,
  passport_number text,
  date_of_birth   date,
  travel_date     date,
  notes           text,
  status          text not null default 'submitted', -- submitted | under_review | approved | declined
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists visa_applications_status_idx on public.visa_applications (status);
create index if not exists visa_applications_created_idx on public.visa_applications (created_at desc);

-- Documents ------------------------------------------------------------------
create table if not exists public.visa_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.visa_applications(id) on delete cascade,
  doc_type       text not null,   -- passport_data_page | passport_photo | flight_ticket | proof_of_accommodation | bank_statement | other
  storage_path   text not null,
  file_name      text,
  created_at     timestamptz not null default now()
);

create index if not exists visa_documents_app_idx on public.visa_documents (application_id);

-- RLS: writes/reads happen only via the server service-role key. No public policies.
alter table public.visa_applications enable row level security;
alter table public.visa_documents enable row level security;

-- Private storage bucket for the uploaded documents.
-- (Alternatively create it in the dashboard: Storage → New bucket → "visa-documents", NOT public.)
insert into storage.buckets (id, name, public)
values ('visa-documents', 'visa-documents', false)
on conflict (id) do nothing;
