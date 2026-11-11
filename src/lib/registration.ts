import { UUID_PATTERN } from '../../supabase/functions/_shared/registration';

const ATTEMPT_STORAGE_KEY = 'coach-registration-attempt';

// Only an opaque ID and a digest are stored; answers and health details stay out of storage.
export async function submissionIdFor(payload: Record<string, unknown>, storage?: Storage) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  let saved: { fingerprint?: string; id?: string } | null = null;
  try { saved = JSON.parse(storage?.getItem(ATTEMPT_STORAGE_KEY) ?? 'null'); } catch { /* Storage is optional. */ }
  if (saved?.fingerprint === fingerprint && typeof saved.id === 'string' && UUID_PATTERN.test(saved.id)) return saved.id;
  const id = crypto.randomUUID();
  try { storage?.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify({ fingerprint, id })); } catch { /* Keep the in-memory attempt. */ }
  return id;
}

export function clearSubmissionAttempt(storage?: Storage) {
  try { storage?.removeItem(ATTEMPT_STORAGE_KEY); } catch { /* Storage may be disabled. */ }
}

export function registrationStorage() {
  try { return window.sessionStorage; } catch { return undefined; }
}

export function normalizePhoneInput(value: string) {
  return value.replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[^0-9+\s()-]/g, '');
}
