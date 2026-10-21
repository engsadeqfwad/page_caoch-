create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  form_data jsonb not null,
  residence_country text,
  phone text,
  instagram text,
  selected_plan text,
  source text not null default 'website',
  client_ip_hash text,
  user_agent text,
  email_status text not null default 'pending',
  email_error text,
  created_at timestamptz not null default now()
);

alter table public.registrations add column if not exists residence_country text;
alter table public.registrations add column if not exists phone text;
alter table public.registrations add column if not exists instagram text;
alter table public.registrations add column if not exists selected_plan text;
alter table public.registrations add column if not exists source text not null default 'website';
alter table public.registrations add column if not exists client_ip_hash text;
alter table public.registrations add column if not exists user_agent text;

alter table public.registrations enable row level security;

revoke all on table public.registrations from anon;
revoke all on table public.registrations from authenticated;

create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

create index if not exists registrations_phone_idx
  on public.registrations (phone);

create index if not exists registrations_ip_created_at_idx
  on public.registrations (client_ip_hash, created_at desc);

