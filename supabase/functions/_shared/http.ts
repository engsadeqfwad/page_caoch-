export class RequestError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}

export function json(body: Record<string, unknown>, status = 200, origin?: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(origin === undefined ? {} : {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        Vary: 'Origin',
      }),
    },
  });
}

export async function readBody(request: Request, maxBytes = 50_000) {
  if (Number(request.headers.get('content-length') ?? 0) > maxBytes) {
    throw new RequestError(413, 'REQUEST_TOO_LARGE');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, 'INVALID_BODY');
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        throw new RequestError(413, 'REQUEST_TOO_LARGE');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export async function sha256(value: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
