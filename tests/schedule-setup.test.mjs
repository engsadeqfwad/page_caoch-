import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { buildScheduleSetupSql } from '../scripts/prepare-registration-schedule.mjs';

test('schedule preparation creates or updates only its two named secrets and one job', async () => {
  const db = new PGlite();
  try {
    // Vault encryption and cron execution are platform services; exercise the SQL against compatible local interfaces.
    await db.exec(`
      create schema vault; create schema cron;
      create table vault.secrets (id uuid primary key default gen_random_uuid(), name text unique, secret text);
      create view vault.decrypted_secrets as select id, name, secret as decrypted_secret from vault.secrets;
      create function vault.create_secret(value text, label text) returns uuid language sql as $$
        insert into vault.secrets(name, secret) values(label, value) returning id;
      $$;
      create function vault.update_secret(target uuid, value text) returns void language sql as $$
        update vault.secrets set secret = value where id = target;
      $$;
      create table cron.jobs(name text primary key, schedule text, command text);
      create function cron.schedule(label text, timing text, body text) returns bigint language sql as $$
        insert into cron.jobs values(label, timing, body)
        on conflict(name) do update set schedule = excluded.schedule, command = excluded.command returning 1::bigint;
      $$;
      insert into vault.secrets(name, secret) values('unrelated', 'unchanged');
    `);
    await db.exec(buildScheduleSetupSql('a'.repeat(64)));
    await db.exec(buildScheduleSetupSql('b'.repeat(64)));
    const secrets = (await db.query('select name, secret from vault.secrets order by name')).rows;
    assert.equal(secrets.length, 3);
    assert.equal(secrets.find((row) => row.name === 'registration_retry_secret').secret, 'b'.repeat(64));
    assert.equal(secrets.find((row) => row.name === 'unrelated').secret, 'unchanged');
    const jobs = (await db.query('select * from cron.jobs')).rows;
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0].schedule, '* * * * *');
    assert.ok(jobs[0].command.includes('/functions/v1/retry-registration-emails'));
  } finally { await db.close(); }
});

test('schedule preparation refuses a lost or malformed retry key', () => {
  for (const value of [undefined, '', 'short', "'; drop table example;"]) {
    assert.throws(() => buildScheduleSetupSql(value));
  }
});
