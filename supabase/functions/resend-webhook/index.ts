import { Webhook } from 'https://esm.sh/svix@2.10.0';
import { database } from '../_shared/database.ts';
import { json, readBody, RequestError } from '../_shared/http.ts';
import { isRecord, UUID_PATTERN } from '../_shared/registration.ts';

const statuses: Record<string, string> = {
  'email.delivered': 'delivered', 'email.bounced': 'bounced', 'email.failed': 'delivery_failed',
  'email.complained': 'complained', 'email.suppressed': 'suppressed',
};

Deno.serve(async (request) => {
  if (request.method !== 'POST') return json({ success: false }, 405);
  const secret = Deno.env.get('RESEND_WEBHOOK_SECRET');
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!secret || !url || !key) return json({ success: false }, 503);
  let event: unknown;
  try {
    const payload = await readBody(request, 100_000);
    new Webhook(secret).verify(payload, {
      'svix-id': request.headers.get('svix-id') ?? '',
      'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
      'svix-signature': request.headers.get('svix-signature') ?? '',
    });
    event = JSON.parse(payload);
  } catch (error) {
    return json({ success: false }, error instanceof RequestError ? error.status : 400);
  }
  if (!isRecord(event) || typeof event.type !== 'string') return json({ success: false }, 400);
  const status = statuses[event.type];
  if (!status) return json({ success: true });
  if (!isRecord(event.data) || typeof event.data.email_id !== 'string' || typeof event.created_at !== 'string'
    || !Number.isFinite(Date.parse(event.created_at))) return json({ success: false }, 400);
  const tag = isRecord(event.data.tags) ? event.data.tags.registration_id : undefined;
  const registrationId = typeof tag === 'string' && UUID_PATTERN.test(tag) ? tag : null;
  try {
    const { data, error } = await database(url, key).rpc('record_registration_email_event', {
      p_email_id: event.data.email_id, p_status: status, p_event_at: event.created_at,
      p_error: status === 'delivered' ? null : event.type,
      p_registration_id: registrationId,
    });
    // The signed registration tag also handles events arriving before the send response is saved.
    if (error || !data) return json({ success: false }, 503);
    return json({ success: true });
  } catch { return json({ success: false }, 503); }
});
