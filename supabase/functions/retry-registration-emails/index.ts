import { database } from '../_shared/database.ts';
import { json, sha256 } from '../_shared/http.ts';
import { processEmailQueue } from '../_shared/mail.ts';

Deno.serve(async (request) => {
  if (request.method !== 'POST') return json({ success: false }, 405);
  const secret = Deno.env.get('EMAIL_RETRY_SECRET');
  const provided = request.headers.get('authorization')?.replace(/^Bearer /i, '');
  if (!secret || secret.length < 32 || !provided || provided.length > 500 || await sha256(secret) !== await sha256(provided)) {
    return json({ success: false }, 401);
  }
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!url || !key || !apiKey) return json({ success: false }, 503);
  try {
    await processEmailQueue(database(url, key), apiKey);
    return json({ success: true });
  } catch {
    console.error('Scheduled notification retry failed.');
    return json({ success: false }, 503);
  }
});
