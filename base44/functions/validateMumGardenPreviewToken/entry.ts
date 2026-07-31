const TOKEN_PREFIX = 'mgp';
const REQUIRED_SCOPE = 'mum-garden-preview';

function json(data: Record<string, unknown>, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function parseCsvSecret(value: string | undefined) {
  return new Set(
    String(value || '')
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
  );
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function decodeJsonPayload(encodedPayload: string) {
  const bytes = base64UrlDecode(encodedPayload);
  return JSON.parse(new TextDecoder().decode(bytes));
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

async function sign(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return new Uint8Array(signature);
}

function routeIsAllowed(payload: Record<string, unknown>, route: string) {
  if (!Array.isArray(payload.routes) || payload.routes.length === 0) return true;
  return payload.routes.some(candidate => String(candidate) === route);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ valid: false, reason: 'method_not_allowed' }, 405);
  }

  try {
    const secret = Deno.env.get('MUM_GARDEN_PREVIEW_TOKEN_SECRET');
    if (!secret) {
      return json({ valid: false, reason: 'preview_token_secret_missing' });
    }

    const { token, route } = await req.json().catch(() => ({}));
    const previewToken = String(token || '').trim();
    if (!previewToken) {
      return json({ valid: false, reason: 'missing_token' });
    }

    const [prefix, encodedPayload, encodedSignature] = previewToken.split('.');
    if (prefix !== TOKEN_PREFIX || !encodedPayload || !encodedSignature) {
      return json({ valid: false, reason: 'invalid_format' });
    }

    const payload = decodeJsonPayload(encodedPayload);
    if (typeof payload !== 'object' || payload === null) {
      return json({ valid: false, reason: 'invalid_payload' });
    }

    const expectedSignature = await sign(`${prefix}.${encodedPayload}`, secret);
    const suppliedSignature = base64UrlDecode(encodedSignature);
    if (!timingSafeEqual(expectedSignature, suppliedSignature)) {
      return json({ valid: false, reason: 'invalid_signature' });
    }

    const tokenId = String(payload.jti || '').trim();
    if (!tokenId) {
      return json({ valid: false, reason: 'missing_token_id' });
    }

    if (payload.scope !== REQUIRED_SCOPE) {
      return json({ valid: false, reason: 'invalid_scope' });
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = Number(payload.exp);
    if (!Number.isFinite(expiresAt) || expiresAt <= now) {
      return json({ valid: false, reason: 'expired_token' });
    }

    const notBefore = Number(payload.nbf || 0);
    if (Number.isFinite(notBefore) && notBefore > now) {
      return json({ valid: false, reason: 'token_not_active' });
    }

    const revokedIds = parseCsvSecret(Deno.env.get('MUM_GARDEN_PREVIEW_REVOKED_IDS'));
    if (revokedIds.has(tokenId)) {
      return json({ valid: false, reason: 'revoked_token' });
    }

    const allowedIds = parseCsvSecret(Deno.env.get('MUM_GARDEN_PREVIEW_ALLOWED_IDS'));
    if (allowedIds.size > 0 && !allowedIds.has(tokenId)) {
      return json({ valid: false, reason: 'unapproved_token' });
    }

    const requestedRoute = String(route || '').trim();
    if (requestedRoute && !routeIsAllowed(payload, requestedRoute)) {
      return json({ valid: false, reason: 'route_not_allowed' });
    }

    return json({
      valid: true,
      token_id: tokenId,
      expires_at: new Date(expiresAt * 1000).toISOString(),
    });
  } catch (_) {
    return json({ valid: false, reason: 'validation_failed' });
  }
});
