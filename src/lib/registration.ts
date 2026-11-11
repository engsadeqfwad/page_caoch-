import { UUID_PATTERN } from '../../supabase/functions/_shared/registration';

const ATTEMPT_STORAGE_KEY = 'coach-registration-attempt';

function submissionUuid() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Mobile browsers may support Web Crypto without the newer randomUUID helper.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Only an opaque ID and a digest are stored; answers and health details stay out of storage.
export async function submissionIdFor(payload: Record<string, unknown>, storage?: Storage) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)));
  const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  let saved: { fingerprint?: string; id?: string } | null = null;
  try { saved = JSON.parse(storage?.getItem(ATTEMPT_STORAGE_KEY) ?? 'null'); } catch { /* Storage is optional. */ }
  if (saved?.fingerprint === fingerprint && typeof saved.id === 'string' && UUID_PATTERN.test(saved.id)) return saved.id;
  const id = submissionUuid();
  try { storage?.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify({ fingerprint, id })); } catch { /* Keep the in-memory attempt. */ }
  return id;
}

export interface RegistrationResponse {
  success?: boolean;
  registrationId?: string;
  code?: string;
}

export async function sendRegistrationRequest(endpoint: string, payload: Record<string, unknown>, timeoutMs = 30_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(endpoint, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    let result: RegistrationResponse | null = null;
    try { result = await response.json(); }
    catch (error) { if (controller.signal.aborted) throw error; }
    return { response, result };
  } catch (error) {
    if (controller.signal.aborted) {
      const timeout = new Error('Registration confirmation timed out.');
      timeout.name = 'TimeoutError';
      throw timeout;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
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
