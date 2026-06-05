create extension if not exists pgcrypto;

create table if not exists public.research_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_version text not null default 'v1',
  submitted_at timestamptz not null,
  full_name text not null,
  email text not null,
  company_name text not null,
  role text not null,
  industry text not null,
  region text not null,
  answers jsonb not null default '{}'::jsonb,
  consent_contact boolean not null,
  consent_data boolean not null,
  honeypot text not null default '',
  referrer text,
  user_agent text,
  ip_address text,
  status text not null default 'new'
);

create index if not exists research_submissions_created_at_idx
  on public.research_submissions (created_at desc);

create index if not exists research_submissions_email_idx
  on public.research_submissions (email);

create index if not exists research_submissions_industry_idx
  on public.research_submissions (industry);

alter table public.research_submissions enable row level security;
