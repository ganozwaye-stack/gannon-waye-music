function exact(value: unknown): string {
  return String(value ?? '').trim();
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSha1Base64(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message),
  );
  const bytes = new Uint8Array(signature);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function validateTwilioFormRequest(
  req: Request,
  params: URLSearchParams,
  authToken: string,
): Promise<boolean> {
  const provided = exact(req.headers.get('x-twilio-signature'));
  if (!provided || !authToken) return false;

  const keys = Array.from(new Set(Array.from(params.keys()))).sort();
  let payload = req.url;
  for (const key of keys) {
    const values = params.getAll(key).sort();
    for (const value of values) payload += key + value;
  }

  const expected = await hmacSha1Base64(authToken, payload);
  return constantTimeEqual(expected, provided);
}

export function twimlEmptyResponse(status = 200): Response {
  return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
    status,
    headers: { 'content-type': 'text/xml; charset=utf-8' },
  });
}
