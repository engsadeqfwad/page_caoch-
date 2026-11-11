import { before, after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { Webhook } from 'svix';
import { loadTypescript } from './helpers/load-typescript.mjs';

const base = new URL('../', import.meta.url);
const file = (name) => new URL(name, base).pathname.replace(/^\/([A-Za-z]:)/, '$1');
let db;
let failUpdate = false;
let mailRequests = [];
let mailBehavior = 'accepted';

const client = {
  async rpc(name, args) {
    try {
      assert.match(name, /^[a-z_]+$/);
      const keys = Object.keys(args);
      keys.forEach((key) => assert.match(key, /^[a-z_]+$/));
      const argumentsSql = keys.map((key, i) => `${key} => $${i + 1}`).join(', ');
      const values = Object.values(args).map((value) => value && typeof value === 'object' ? JSON.stringify(value) : value);
      if (name === 'claim_registration_emails') {
        return { data: (await db.query(`select * from public.${name}(${argumentsSql})`, values)).rows, error: null };
      }
      const rows = (await db.query(`select public.${name}(${argumentsSql}) as result`, values)).rows;
      return { data: rows[0].result, error: null };
    } catch (error) { return { data: null, error: { code: error.code, message: error.message } }; }
  },
  from(table) {
    assert.equal(table, 'registrations');
    return { update(values) {
      const filters = [];
      const query = {
        eq(key, value) { filters.push([key, value]); return query; },
        async then(resolve, reject) {
          try {
            if (failUpdate) return resolve({ error: { code: 'SIMULATED_UPDATE_FAILURE' } });
            const entries = Object.entries(values);
            [...entries, ...filters].forEach(([key]) => assert.match(key, /^[a-z_]+$/));
            const set = entries.map(([key], i) => `${key} = $${i + 1}`).join(', ');
            const where = filters.map(([key], i) => `${key} = $${entries.length + i + 1}`).join(' and ');
            await db.query(`update public.registrations set ${set} where ${where}`, [...entries, ...filters].map(([, value]) => value));
            resolve({ error: null });
          } catch (error) { reject(error); }
        },
      };
      return query;
    } };
  },
};

const globals = { fetch: async (url, options) => {
  assert.equal(url, 'https://api.resend.com/emails');
  mailRequests.push(options);
  if (mailBehavior === 'network') throw new TypeError('simulated connection failure');
  if (mailBehavior === 'timeout') throw new DOMException('timeout', 'TimeoutError');
  if (mailBehavior === 'rejected') return new Response('{"name":"validation_error"}', { status: 403 });
  if (mailBehavior === 'throttled') return new Response('{}', { status: 429, headers: { 'Retry-After': '300' } });
  return new Response(JSON.stringify({ id: 'mail-' + JSON.parse(options.body).tags[0].value }));
} };
const { createRegistrationHandler } = loadTypescript(file('supabase/functions/_shared/registration-handler.ts'), { globals });
const { processEmailQueue } = loadTypescript(file('supabase/functions/_shared/mail.ts'), { globals });
const { validateRegistration, REGISTRATION_LIMITS } = loadTypescript(file('supabase/functions/_shared/registration.ts'));
const environment = {
  ALLOWED_ORIGINS: 'https://coach.example.test', SUPABASE_URL: 'https://database.example.test',
  SUPABASE_SERVICE_ROLE_KEY: 'test-only', IP_HASH_SALT: 'test-only', RESEND_API_KEY: 'test-only',
  RESEND_FROM_EMAIL: 'Hanan Coaching <registrations@example.test>',
};
const handler = (extra = {}, notify) => createRegistrationHandler({
  env: (name) => ({ ...environment, ...extra })[name], database: () => client, ...(notify ? { notify } : {}),
});
const payload = (extra = {}) => ({
  submissionId: randomUUID(), age: 24, height: 165, weight: 62, country: 'السعودية',
  phoneCountryCode: 'SA', phoneCountryName: 'المملكة العربية السعودية', phone: '+966512345678',
  instagram: 'test_example', pathId: 'feminine-shape', pathName: 'القوام الأنثوي',
  trainingLocation: 'home', experienceLevel: 'beginner', trainingDays: 3, lifestyle: 'office',
  healthIssues: 'لا يوجد', medications: 'لا يوجد', selectedPlan: { id: 'plus' }, language: 'ar', website: '', ...extra,
});
async function submit(body = payload(), { handle = handler(), origin = 'https://coach.example.test', raw, headers = {} } = {}) {
  const res = await handle(new Request('https://function.example.test', {
    method: 'POST', headers: { origin, 'Content-Type': 'application/json', 'x-forwarded-for': '192.0.2.10', ...headers },
    body: raw ?? JSON.stringify(body),
  }));
  return { status: res.status, body: await res.json(), headers: res.headers };
}
const rows = async () => (await db.query('select * from public.registrations order by created_at, id')).rows;

before(async () => {
  db = new PGlite();
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(await fs.readFile(new URL('supabase/migrations/20261021000100_secure_registrations.sql', base), 'utf8'));
  const historicalId = randomUUID();
  await db.query("insert into public.registrations (id, form_data, email_status) values ($1, '{\"legacy\":true}', 'sent')", [historicalId]);
  const migration = await fs.readFile(new URL('supabase/migrations/20261111000100_reliable_registration_notifications.sql', base), 'utf8');
  await db.exec(migration);
  await db.exec(migration); // Safe to apply again; no destructive backfill.
  const historical = (await db.query('select form_data, email_status, email_payload from public.registrations where id = $1', [historicalId])).rows[0];
  assert.equal(historical.form_data.legacy, true);
  assert.equal(historical.email_status, 'sent');
  assert.equal(historical.email_payload, null);
});
beforeEach(async () => { await db.exec('truncate public.registrations'); failUpdate = false; mailRequests = []; mailBehavior = 'accepted'; });
after(async () => { await db?.close(); });

test('saves and sends to the requested recipient with canonical plan and escaped HTML', async () => {
  const result = await submit(payload({ healthIssues: '<script>example</script>' }));
  assert.equal(result.status, 200);
  const [row] = await rows();
  assert.equal(row.id, result.body.registrationId);
  assert.equal(row.email_recipient, 'sadeq202077@gmail.com');
  assert.equal(row.email_status, 'accepted');
  assert.ok(row.email_id);
  const email = JSON.parse(mailRequests[0].body);
  assert.deepEqual(email.to, ['sadeq202077@gmail.com']);
  assert.ok(email.html.includes('&lt;script&gt;example&lt;/script&gt;'));
  assert.equal(row.form_data.selectedPlan.priceSAR, 100);
  assert.equal(mailRequests[0].headers['Idempotency-Key'], 'registration/' + row.id);
});

test('environment recipient overrides the default explicitly', async () => {
  await submit(payload(), { handle: handler({ NOTIFICATION_EMAIL: 'configured@example.test' }) });
  assert.equal((await rows())[0].email_recipient, 'configured@example.test');
});

test('browser cannot change plan price, duration or path label', async () => {
  await submit(payload({ selectedPlan: { id: 'plus', priceSAR: 1, name: 'invented', duration: '100 years' }, pathName: 'invented' }));
  const [row] = await rows();
  assert.equal(row.form_data.selectedPlan.priceSAR, 100);
  assert.equal(row.form_data.selectedPlan.duration, 'شهران (2 Months)');
  assert.equal(row.form_data.pathName, 'القوام الأنثوي');
});

test('unknown plans and paths are rejected without saving', async () => {
  for (const extra of [{ selectedPlan: { id: 'invented' } }, { pathId: 'invented' }]) {
    assert.equal((await submit(payload(extra))).status, 400);
  }
  assert.equal((await rows()).length, 0);
});

test('same attempt creates exactly one row and one email, even after the rate limit', async () => {
  const body = payload();
  const first = await submit(body);
  await submit(); await submit();
  const duplicate = await submit(body);
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.body.registrationId, first.body.registrationId);
  assert.equal(duplicate.body.duplicate, true);
  assert.equal((await rows()).length, 3);
  assert.equal(mailRequests.length, 3);
});

test('same ID with different answers conflicts without overwriting the original', async () => {
  const body = payload();
  await submit(body);
  assert.equal((await submit({ ...body, weight: 70 })).status, 409);
  assert.equal((await rows())[0].form_data.weightKg, 62);
});

test('fourth new registration from the same IP is limited atomically', async () => {
  const results = await Promise.all([submit(), submit(), submit(), submit()]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 200, 200, 429]);
  assert.equal((await rows()).length, 3);
});

test('failed Resend response preserves the saved request and can be retried once', async () => {
  mailBehavior = 'rejected';
  const result = await submit();
  assert.equal(result.status, 200);
  assert.equal(result.body.notificationStatus, 'pending');
  let [row] = await rows();
  assert.equal(row.email_status, 'failed');
  assert.ok(row.email_next_retry_at);
  await db.exec("update public.registrations set email_next_retry_at = now() - interval '1 second'");
  mailBehavior = 'accepted';
  await processEmailQueue(client, 'test-only');
  [row] = await rows();
  assert.equal(row.email_status, 'accepted');
  assert.equal(row.email_attempts, 2);
  assert.equal(mailRequests[0].body, mailRequests[1].body);
  assert.equal(mailRequests[0].headers['Idempotency-Key'], mailRequests[1].headers['Idempotency-Key']);
});

for (const failure of ['network', 'timeout']) {
  test(failure + ' failure is contained and queued after saving', async () => {
    mailBehavior = failure;
    assert.equal((await submit()).status, 200);
    assert.equal((await rows())[0].email_status, 'failed');
  });
}

test('provider throttling honors Retry-After', async () => {
  mailBehavior = 'throttled';
  await submit();
  const [row] = await rows();
  assert.ok(Date.parse(row.email_next_retry_at) - Date.now() > 290_000);
});

test('a lost status update recovers using the exact same provider idempotency key', async () => {
  failUpdate = true;
  assert.equal((await submit()).status, 200);
  assert.equal((await rows())[0].email_status, 'pending');
  failUpdate = false;
  await db.exec("update public.registrations set email_locked_until = now() - interval '1 second'");
  await processEmailQueue(client, 'test-only');
  assert.equal((await rows())[0].email_status, 'accepted');
  assert.equal(mailRequests[0].body, mailRequests[1].body);
  assert.equal(mailRequests[0].headers['Idempotency-Key'], mailRequests[1].headers['Idempotency-Key']);
});

test('missing mail key does not discard registrations', async () => {
  const result = await submit(payload(), { handle: handler({ RESEND_API_KEY: undefined }) });
  assert.equal(result.status, 200);
  assert.equal((await rows())[0].email_status, 'pending');
  assert.equal(mailRequests.length, 0);
});

test('queue claim failure cannot turn a saved request into an apparent registration failure', async () => {
  const result = await submit(payload(), { handle: handler({}, async () => { throw new Error('queue unavailable'); }) });
  assert.equal(result.status, 200);
  assert.equal((await rows()).length, 1);
});

test('invalid JSON values and malformed bodies are handled without throwing', async () => {
  for (const raw of ['null', '[]', 'true', '{broken']) {
    assert.equal((await submit(undefined, { raw })).status, 400);
  }
  assert.equal((await rows()).length, 0);
});

test('actual byte length is capped even without Content-Length', async () => {
  assert.equal((await submit(undefined, { raw: JSON.stringify({ text: 'س'.repeat(26_000) }) })).status, 413);
});

test('server and browser share numeric boundaries and reject fractional age/days', () => {
  for (const [key, limits] of Object.entries(REGISTRATION_LIMITS)) {
    if (typeof limits !== 'object') continue;
    assert.equal(validateRegistration(payload({ [key]: limits.min })).ok, true);
    assert.equal(validateRegistration(payload({ [key]: limits.max })).ok, true);
    assert.equal(validateRegistration(payload({ [key]: limits.min - 1 })).ok, false);
  }
  assert.equal(validateRegistration(payload({ age: 15 })).ok, false);
  assert.equal(validateRegistration(payload({ weight: 34 })).ok, false);
  assert.equal(validateRegistration(payload({ age: 24.5 })).ok, false);
  assert.equal(validateRegistration(payload({ trainingDays: 3.5 })).ok, false);
});

test('origin checks require explicit local development opt-in', async () => {
  assert.equal((await submit(payload(), { origin: 'https://unlisted.example.test' })).status, 403);
  assert.equal((await submit(payload(), { origin: 'http://localhost:5173' })).status, 403);
  assert.equal((await submit(payload(), { origin: 'http://localhost:5173', handle: handler({ ALLOW_LOCAL_ORIGINS: 'true' }) })).status, 200);
});

test('filled honeypot is rejected without false confirmation', async () => {
  assert.equal((await submit(payload({ website: 'bot.example' }))).status, 400);
  assert.equal((await rows()).length, 0);
});

test('old clients without an attempt ID continue to work during rollout', async () => {
  const body = payload(); delete body.submissionId;
  assert.equal((await submit(body)).status, 200);
});

test('existing historical records are never selected for automatic retry', async () => {
  await db.query("insert into public.registrations (form_data, email_status) values ('{}', 'failed')");
  await processEmailQueue(client, 'test-only');
  assert.equal(mailRequests.length, 0);
});

test('expired idempotency windows go to manual review instead of risking duplicate emails', async () => {
  await submit(payload(), { handle: handler({ RESEND_API_KEY: undefined }) });
  await db.exec("update public.registrations set created_at = now() - interval '24 hours'");
  await processEmailQueue(client, 'test-only');
  assert.equal((await rows())[0].email_status, 'needs_review');
  assert.equal(mailRequests.length, 0);
});

test('leases prevent concurrent queue workers from claiming the same notification', async () => {
  await submit(payload(), { handle: handler({ RESEND_API_KEY: undefined }) });
  const first = await client.rpc('claim_registration_emails', { p_registration_id: null });
  const second = await client.rpc('claim_registration_emails', { p_registration_id: null });
  assert.equal(first.data.length, 1);
  assert.equal(second.data.length, 0);
});

test('signed delivery events update delivery status and stale events cannot overwrite it', async () => {
  await submit();
  const [row] = await rows();
  const secret = 'whsec_' + Buffer.from('01234567890123456789012345678901').toString('base64');
  let webhookHandler;
  loadTypescript(file('supabase/functions/resend-webhook/index.ts'), {
    globals: { Deno: { env: { get: (name) => name === 'RESEND_WEBHOOK_SECRET' ? secret : environment[name] }, serve: (fn) => { webhookHandler = fn; } } },
    overrides: { 'https://esm.sh/svix@2.10.0': { Webhook }, 'https://esm.sh/@supabase/supabase-js@2.119.0': { createClient: () => client } },
  });
  const event = JSON.stringify({ type: 'email.delivered', created_at: new Date().toISOString(), data: { email_id: row.email_id } });
  const timestamp = new Date();
  const signature = new Webhook(secret).sign('msg-test', timestamp, event);
  const res = await webhookHandler(new Request('https://webhook.example.test', { method: 'POST', body: event, headers: {
    'svix-id': 'msg-test', 'svix-timestamp': String(Math.floor(timestamp.getTime() / 1000)), 'svix-signature': signature,
  } }));
  assert.equal(res.status, 200);
  assert.equal((await rows())[0].email_status, 'delivered');
  await client.rpc('record_registration_email_event', { p_email_id: row.email_id, p_status: 'bounced', p_event_at: '2000-01-01T00:00:00Z', p_error: 'stale' });
  assert.equal((await rows())[0].email_status, 'delivered');
  const forged = await webhookHandler(new Request('https://webhook.example.test', { method: 'POST', body: event }));
  assert.equal(forged.status, 400);
});

test('public roles cannot read registrations or invoke the privileged save RPC', async () => {
  const result = await db.query("select has_table_privilege('anon','public.registrations','select') as can_read, has_function_privilege('anon','public.save_registration(uuid,uuid,text,jsonb,text,text,jsonb)','execute') as can_save");
  assert.equal(result.rows[0].can_read, false);
  assert.equal(result.rows[0].can_save, false);
});

test('delivery arriving before the send result is saved binds by the signed registration tag', async () => {
  await submit(payload(), { handle: handler({ RESEND_API_KEY: undefined }) });
  const [row] = await rows();
  const result = await client.rpc('record_registration_email_event', {
    p_email_id: 'early-mail-id', p_status: 'delivered', p_event_at: new Date().toISOString(),
    p_registration_id: row.id,
  });
  assert.equal(result.error, null);
  assert.equal((await rows())[0].email_id, 'early-mail-id');
  assert.equal((await rows())[0].email_status, 'delivered');
  await processEmailQueue(client, 'test-only');
  assert.equal(mailRequests.length, 0);
});

test('unrelated Resend account events are acknowledged without changing registrations', async () => {
  const result = await client.rpc('record_registration_email_event', {
    p_email_id: 'unrelated-id', p_status: 'delivered', p_event_at: new Date().toISOString(),
  });
  assert.equal(result.data, true);
  assert.equal((await rows()).length, 0);
});

test('scheduled retry requires its own secret and sends only after authorization', async () => {
  await submit(payload(), { handle: handler({ RESEND_API_KEY: undefined }) });
  const secret = 'a-random-test-secret-at-least-32-characters-long';
  let worker;
  loadTypescript(file('supabase/functions/retry-registration-emails/index.ts'), {
    globals: { ...globals, Deno: {
      env: { get: (name) => name === 'EMAIL_RETRY_SECRET' ? secret : environment[name] },
      serve: (fn) => { worker = fn; },
    } },
    overrides: { 'https://esm.sh/@supabase/supabase-js@2.119.0': { createClient: () => client } },
  });
  const unauthorized = await worker(new Request('https://worker.example.test', { method: 'POST' }));
  assert.equal(unauthorized.status, 401);
  assert.equal(mailRequests.length, 0);
  const authorized = await worker(new Request('https://worker.example.test', {
    method: 'POST', headers: { Authorization: 'Bearer ' + secret },
  }));
  assert.equal(authorized.status, 200);
  assert.equal((await rows())[0].email_status, 'accepted');
  assert.equal(mailRequests.length, 1);
});
