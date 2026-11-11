import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';

export interface QueuedEmail {
  id: string;
  email_payload: Record<string, unknown>;
  email_attempts: number;
  email_lock_token: string;
}

export async function deliverEmail(supabase: SupabaseClient, row: QueuedEmail, apiKey: string) {
  let emailId: string | undefined;
  let errorMessage = '';
  let retryAfterSeconds = 0;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(10_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `registration/${row.id}`,
      },
      body: JSON.stringify(row.email_payload),
    });
    const result: unknown = await res.json().catch(() => null);
    if (res.ok && result && typeof result === 'object' && 'id' in result && typeof result.id === 'string' && result.id) {
      emailId = result.id;
    } else {
      // Store provider status/code, not a response body which may contain personal data.
      errorMessage = `Resend HTTP ${res.status}`;
      if (result && typeof result === 'object' && 'name' in result && typeof result.name === 'string') {
        errorMessage += ` (${result.name.slice(0, 100)})`;
      }
      const delay = Number(res.headers.get('retry-after'));
      if (Number.isFinite(delay)) retryAfterSeconds = Math.max(0, Math.min(delay, 3600));
    }
  } catch (error) {
    errorMessage = error instanceof Error && error.name === 'TimeoutError'
      ? 'Resend request timed out; retry with the same idempotency key.'
      : 'Resend connection failed; retry with the same idempotency key.';
  }

  const exhausted = row.email_attempts >= 6;
  const retryDelay = Math.max(retryAfterSeconds, Math.min(60 * (2 ** (row.email_attempts - 1)), 3600));
  const update = emailId ? {
    email_id: emailId, email_status: 'accepted', email_error: null,
    email_next_retry_at: null, email_locked_until: null, email_lock_token: null,
  } : {
    email_status: exhausted ? 'needs_review' : 'failed', email_error: errorMessage,
    email_next_retry_at: exhausted ? null : new Date(Date.now() + retryDelay * 1000).toISOString(),
    email_locked_until: null, email_lock_token: null,
  };

  try {
    const { error } = await supabase.from('registrations').update(update)
      .eq('id', row.id).eq('email_lock_token', row.email_lock_token);
    if (error) {
      console.error('Could not persist notification result:', row.id, error.code);
      return 'pending'; // The expired lease allows the worker to safely recover this attempt.
    }
  } catch {
    console.error('Notification result update interrupted:', row.id);
    return 'pending';
  }
  return emailId ? 'accepted' : 'pending';
}

export async function processEmailQueue(supabase: SupabaseClient, apiKey: string, registrationId?: string) {
  if (!apiKey) return 'pending';
  const { data, error } = await supabase.rpc('claim_registration_emails', { p_registration_id: registrationId ?? null });
  if (error) throw new Error(`Email queue unavailable: ${error.code ?? 'unknown'}`);
  const rows = (data ?? []) as QueuedEmail[];
  // A small, sequential batch bounds the worker's runtime; HTTP 429 is retried later.
  let status = 'pending';
  for (const row of rows) status = await deliverEmail(supabase, row, apiKey);
  return status;
}
