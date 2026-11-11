-- Run in the intended project's SQL Editor after deploying retry-registration-emails.
-- First enable pg_cron and pg_net in Database > Extensions.
-- In Supabase Vault, create:
--   registration_project_url = https://jajwrjblsbdfbhbrfyku.supabase.co
--   registration_retry_secret = the SAME value as the EMAIL_RETRY_SECRET function secret.
-- Secrets themselves are intentionally not included in this file.

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'registration_project_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'registration_retry_secret') then
    raise exception 'Create registration_project_url and registration_retry_secret in Vault first';
  end if;
end;
$$;

-- A stable job name makes reapplying this file update the existing schedule.
select cron.schedule(
  'retry-registration-emails', '* * * * *',
  $job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'registration_project_url')
        || '/functions/v1/retry-registration-emails',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'registration_retry_secret')
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000
    );
  $job$
);
