import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
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
