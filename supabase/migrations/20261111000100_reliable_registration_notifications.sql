-- Additive migration: existing registrations are retained and are never re-emailed.
begin;

alter table public.registrations
  add column if not exists email_status text not null default 'pending',
  add column if not exists email_error text,
  add column if not exists submission_id uuid,
  add column if not exists request_hash text,
  add column if not exists email_recipient text,
  add column if not exists email_payload jsonb,
  add column if not exists email_id text,
  add column if not exists email_attempts integer not null default 0,
  add column if not exists email_next_retry_at timestamptz default now(),
  add column if not exists email_last_attempt_at timestamptz,
  add column if not exists email_locked_until timestamptz,
  add column if not exists email_lock_token uuid,
  add column if not exists email_event_at timestamptz;

create unique index if not exists registrations_submission_id_idx
  on public.registrations (submission_id) where submission_id is not null;
create unique index if not exists registrations_email_id_idx
  on public.registrations (email_id) where email_id is not null;
create index if not exists registrations_email_retry_idx
  on public.registrations (email_next_retry_at)
  where email_payload is not null and email_status in ('pending', 'failed');

-- Serialize duplicate IDs and per-IP submissions inside one transaction.
create or replace function public.save_registration(
  p_id uuid, p_submission_id uuid, p_request_hash text, p_form_data jsonb,
  p_client_ip_hash text, p_user_agent text, p_email_payload jsonb
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  existing public.registrations%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_submission_id::text, 0));
  select * into existing from public.registrations where submission_id = p_submission_id;
  if found then
    if existing.request_hash is distinct from p_request_hash then
      return jsonb_build_object('status', 'conflict');
    end if;
    return jsonb_build_object('status', 'existing', 'id', existing.id, 'email_status', existing.email_status);
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_client_ip_hash, 1));
  if (select count(*) from public.registrations
      where client_ip_hash = p_client_ip_hash and created_at >= now() - interval '10 minutes') >= 3 then
    return jsonb_build_object('status', 'rate_limited');
  end if;

  insert into public.registrations (
    id, submission_id, request_hash, form_data, residence_country, phone, instagram,
    selected_plan, client_ip_hash, user_agent, email_recipient, email_payload, email_status
  ) values (
    p_id, p_submission_id, p_request_hash, p_form_data, p_form_data->>'country',
    p_form_data->>'phone', p_form_data->>'instagram', p_form_data->'selectedPlan'->>'name',
    p_client_ip_hash, p_user_agent, p_email_payload->'to'->>0, p_email_payload, 'pending'
  );
  return jsonb_build_object('status', 'created', 'id', p_id, 'email_status', 'pending');
end;
$$;

-- A lease prevents a submit request and the scheduled worker emailing the same row concurrently.
create or replace function public.claim_registration_emails(p_registration_id uuid default null)
returns setof public.registrations
language plpgsql security definer set search_path = '' as $$
begin
  -- Resend retains idempotency keys for 24 hours. Never blindly retry beyond that window.
  update public.registrations set email_status = 'needs_review', email_next_retry_at = null,
    email_locked_until = null, email_lock_token = null,
    email_error = coalesce(email_error, 'Automatic retry window expired; check Resend before resending.')
  where email_payload is not null and email_status in ('pending', 'failed')
    and (created_at <= now() - interval '23 hours' or email_attempts >= 6)
    and (email_locked_until is null or email_locked_until <= now());

  return query
  with candidates as (
    select r.id from public.registrations r
    where r.email_payload is not null and r.email_status in ('pending', 'failed')
      and r.email_next_retry_at <= now() and r.email_attempts < 6
      and r.created_at > now() - interval '23 hours'
      and (r.email_locked_until is null or r.email_locked_until <= now())
      and (p_registration_id is null or r.id = p_registration_id)
    order by r.email_next_retry_at, r.id
    limit (case when p_registration_id is null then 3 else 1 end)
    for update skip locked
  )
  update public.registrations r set
    email_attempts = r.email_attempts + 1, email_last_attempt_at = now(),
    email_locked_until = now() + interval '90 seconds', email_lock_token = gen_random_uuid()
  from candidates c where r.id = c.id returning r.*;
end;
$$;

-- Signed webhooks update delivery state; older or repeated events cannot overwrite newer state.
create or replace function public.record_registration_email_event(
  p_email_id text, p_status text, p_event_at timestamptz, p_error text default null,
  p_registration_id uuid default null
) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  if p_status not in ('delivered', 'bounced', 'delivery_failed', 'complained', 'suppressed') then
    raise exception 'Unsupported email event';
  end if;
  update public.registrations set
    email_id = coalesce(email_id, p_email_id),
    email_status = p_status, email_event_at = p_event_at, email_error = p_error,
    email_next_retry_at = null, email_locked_until = null, email_lock_token = null
  where (email_id = p_email_id or (id = p_registration_id and email_id is null and email_payload is not null))
    and (email_event_at is null or email_event_at < p_event_at);
  -- Ignore events from other applications sharing this Resend account.
  return true;
end;
$$;

revoke all on function public.save_registration(uuid, uuid, text, jsonb, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.claim_registration_emails(uuid) from public, anon, authenticated;
revoke all on function public.record_registration_email_event(text, text, timestamptz, text, uuid) from public, anon, authenticated;
grant execute on function public.save_registration(uuid, uuid, text, jsonb, text, text, jsonb) to service_role;
grant execute on function public.claim_registration_emails(uuid) to service_role;
grant execute on function public.record_registration_email_event(text, text, timestamptz, text, uuid) to service_role;

alter table public.registrations enable row level security;
revoke all on public.registrations from anon, authenticated;
grant select, update on public.registrations to service_role;
commit;
