import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import { loadTypescript } from './helpers/load-typescript.mjs';

const { submissionIdFor, clearSubmissionAttempt, normalizePhoneInput } = loadTypescript(fileURLToPath(new URL('../src/lib/registration.ts', import.meta.url)));

test('retries reuse an opaque ID, edited answers get a different ID, and no answers are persisted', async () => {
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) };
  const body = { phone: '+966512345678', healthIssues: 'private health details', selectedPlan: { id: 'plus' } };
  const first = await submissionIdFor(body, storage);
  assert.equal(await submissionIdFor(body, storage), first);
  assert.notEqual(await submissionIdFor({ ...body, selectedPlan: { id: 'premium' } }, storage), first);
  assert.ok(![...data.values()].join('').includes('private health details'));
  assert.ok(![...data.values()].join('').includes(body.phone));
  clearSubmissionAttempt(storage);
  assert.equal(data.size, 0);
});

test('disabled or corrupt storage does not prevent submission', async () => {
  assert.ok(await submissionIdFor({}, { getItem() { throw new Error('disabled'); }, setItem() { throw new Error('disabled'); } }));
  assert.ok(await submissionIdFor({}, { getItem() { return '{broken'; }, setItem() {} }));
});

test('Arabic and Persian digits and pasted international numbers normalize correctly', () => {
  assert.equal(normalizePhoneInput('+٩٦٦ ٥١٢-٣٤٥-٦٧٨'), '+966 512-345-678');
  assert.equal(normalizePhoneInput('۰۵۱۲۳۴۵۶۷۸'), '0512345678');
});

test('browsers without randomUUID still create secure v4 IDs and reuse retries', async () => {
  const { submissionIdFor: compatibleId } = loadTypescript(fileURLToPath(new URL('../src/lib/registration.ts', import.meta.url)), {
    globals: { crypto: { subtle: webcrypto.subtle, getRandomValues: webcrypto.getRandomValues.bind(webcrypto) } },
  });
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
  const id = await compatibleId({ selectedPlan: { id: 'plus' } }, storage);
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(await compatibleId({ selectedPlan: { id: 'plus' } }, storage), id);
  assert.notEqual(await compatibleId({ selectedPlan: { id: 'premium' } }, storage), id);
});

for (const stage of ['headers', 'body']) {
  test(`request timeout covers waiting for response ${stage}`, async () => {
    const { sendRegistrationRequest } = loadTypescript(fileURLToPath(new URL('../src/lib/registration.ts', import.meta.url)), {
      globals: {
        AbortController,
        fetch: async (_url, options) => {
          const interrupted = () => new Promise((_resolve, reject) => {
            options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
          });
          return stage === 'headers' ? interrupted() : { json: interrupted };
        },
      },
    });
    await assert.rejects(sendRegistrationRequest('https://registration.example/', {}, 10), { name: 'TimeoutError' });
  });
}

test('HTTP errors remain distinguishable from a connection failure', async () => {
  const { sendRegistrationRequest } = loadTypescript(fileURLToPath(new URL('../src/lib/registration.ts', import.meta.url)), {
    globals: {
      AbortController,
      fetch: async () => new Response(JSON.stringify({ success: false, code: 'SAVE_FAILED' }), { status: 503 }),
    },
  });
  const { response, result } = await sendRegistrationRequest('https://registration.example/', {});
  assert.equal(response.status, 503);
  assert.equal(result.code, 'SAVE_FAILED');
});
