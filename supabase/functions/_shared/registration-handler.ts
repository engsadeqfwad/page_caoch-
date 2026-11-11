import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';
import { DEFAULT_NOTIFICATION_EMAIL, EMAIL_PATTERN, validateRegistration } from './registration.ts';
import { buildFormData, buildRegistrationEmail } from './email-template.ts';
import { json, readBody, RequestError, sha256 } from './http.ts';
import { processEmailQueue } from './mail.ts';

interface Dependencies {
  env: (name: string) => string | undefined;
  database: (url: string, key: string) => SupabaseClient;
  notify?: typeof processEmailQueue;
}

export function createRegistrationHandler({ env, database, notify = processEmailQueue }: Dependencies) {
  return async (request: Request) => {
    const origins = (env('ALLOWED_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get('origin') ?? '';
    const local = env('ALLOW_LOCAL_ORIGINS') === 'true' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const allowed = origin !== '' && (origins.includes(origin) || local);
    const responseOrigin = allowed ? origin : 'null';
    if (request.method === 'OPTIONS') return json({}, allowed ? 200 : 403, responseOrigin);
    if (request.method !== 'POST') return json({ success: false, code: 'METHOD_NOT_ALLOWED' }, 405, responseOrigin);
    if (!allowed) return json({ success: false, code: 'ORIGIN_NOT_ALLOWED' }, 403, responseOrigin);

    try {
      if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
        throw new RequestError(415, 'INVALID_CONTENT_TYPE');
      }
      let body: unknown;
      try { body = JSON.parse(await readBody(request)); }
      catch (error) {
        if (error instanceof RequestError) throw error;
        throw new RequestError(400, 'INVALID_BODY');
      }
      const parsed = validateRegistration(body);
      if (!parsed.ok) return json({ success: false, code: 'VALIDATION_ERROR', fields: parsed.fields }, 400, responseOrigin);

      const url = env('SUPABASE_URL')?.trim();
      const key = env('SUPABASE_SERVICE_ROLE_KEY')?.trim();
      const salt = env('IP_HASH_SALT')?.trim();
      const recipient = env('NOTIFICATION_EMAIL')?.trim() || DEFAULT_NOTIFICATION_EMAIL;
      const from = env('RESEND_FROM_EMAIL')?.trim() || 'Hanan Coaching <onboarding@resend.dev>';
      if (!url || !key || !salt || !EMAIL_PATTERN.test(recipient) || /[\r\n]/.test(from)) {
        console.error('Registration server configuration is incomplete.');
        return json({ success: false, code: 'SERVICE_UNAVAILABLE' }, 503, responseOrigin);
      }

      const clientIp = (request.headers.get('x-forwarded-for') ?? request.headers.get('cf-connecting-ip') ?? 'unknown').split(',')[0].trim();
      const ipHash = await sha256(`${salt}:${clientIp}`);
      const requestHash = await sha256(JSON.stringify(parsed.data));
      const registrationId = crypto.randomUUID();
      const form = buildFormData(parsed.data, new Date().toISOString());
      const client = database(url, key);
      const { data: saved, error } = await client.rpc('save_registration', {
        p_id: registrationId, p_submission_id: parsed.submissionId ?? crypto.randomUUID(),
        p_request_hash: requestHash, p_form_data: form, p_client_ip_hash: ipHash,
        p_user_agent: (request.headers.get('user-agent') ?? '').slice(0, 500),
        p_email_payload: buildRegistrationEmail(registrationId, form, from, recipient),
      });
      if (error || !saved || (typeof saved.id !== 'string' && !['conflict', 'rate_limited'].includes(saved.status))) {
        console.error('Registration save failed:', error?.code ?? 'invalid_result');
        return json({ success: false, code: 'SAVE_FAILED' }, 503, responseOrigin);
      }
      if (saved.status === 'conflict') return json({ success: false, code: 'SUBMISSION_CONFLICT' }, 409, responseOrigin);
      if (saved.status === 'rate_limited') {
        const limited = json({ success: false, code: 'RATE_LIMITED', retryAfterSeconds: 600 }, 429, responseOrigin);
        limited.headers.set('Retry-After', '600');
        return limited;
      }

      let notificationStatus = ['accepted', 'delivered', 'sent'].includes(saved.email_status) ? 'accepted' : 'pending';
      if (notificationStatus === 'pending') {
        try { notificationStatus = await notify(client, env('RESEND_API_KEY')?.trim() ?? '', saved.id); }
        catch { console.error('Notification deferred for saved registration:', saved.id); }
      }
      // A saved registration is successful even while its durable notification awaits retry.
      return json({ success: true, registrationId: saved.id, notificationStatus,
        duplicate: saved.status === 'existing' }, 200, responseOrigin);
    } catch (error) {
      if (error instanceof RequestError) return json({ success: false, code: error.code }, error.status, responseOrigin);
      console.error('Registration request interrupted.');
      return json({ success: false, code: 'SERVICE_UNAVAILABLE' }, 503, responseOrigin);
    }
  };
}
