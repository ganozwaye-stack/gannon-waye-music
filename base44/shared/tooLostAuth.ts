// Shared Too Lost OAuth helpers. Tokens are stored behind service-role-only
// entity rules and are never returned to browser code.

export function tooLostConfigFromSecrets(secrets) {
  return {
    clientId: secrets.get('TOO_LOST_CLIENT_ID') || '',
    clientSecret: secrets.get('TOO_LOST_CLIENT_SECRET') || '',
    tokenUrl: secrets.get('TOO_LOST_TOKEN_URL') || 'https://toolost.com/oauth/token',
    authorizeUrl: secrets.get('TOO_LOST_AUTHORIZE_URL') || 'https://toolost.com/oauth/authorize',
    redirectUri: secrets.get('TOO_LOST_REDIRECT_URI') || '',
    oauthScopes: secrets.get('TOO_LOST_OAUTH_SCOPES') || 'read:profile read:releases write:releases',
    tokenEncryptionKey: secrets.get('TOO_LOST_TOKEN_ENCRYPTION_KEY') || '',
  };
}

export function missingTooLostConfig(config) {
  return [
    ['TOO_LOST_CLIENT_ID', config.clientId],
    ['TOO_LOST_CLIENT_SECRET', config.clientSecret],
    ['TOO_LOST_REDIRECT_URI', config.redirectUri],
  ].filter(([, value]) => !value).map(([name]) => name);
}

export async function fetchTooLostConnection(sr) {
  const list = await sr.entities.TooLostConnection.filter({});
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}

async function sha256(value) {
  const encoded = new TextEncoder().encode(String(value || ''));
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(left, right) {
  const a = String(left || '');
  const b = String(right || '');
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

export async function rememberTooLostOAuthState(sr, state) {
  const patch = {
    pending_oauth_state_hash: await sha256(state),
    pending_oauth_state_expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
  const existing = await fetchTooLostConnection(sr);
  if (existing) {
    await sr.entities.TooLostConnection.update(existing.id, patch);
    return existing.id;
  }
  const created = await sr.entities.TooLostConnection.create(patch);
  return created.id;
}

export async function verifyTooLostOAuthState(sr, state) {
  const connection = await fetchTooLostConnection(sr);
  if (!connection?.pending_oauth_state_hash || !connection?.pending_oauth_state_expires_at) {
    return { ok: false, error: 'The login request is missing or has already been used. Start again from Distributor Hub.' };
  }
  if (new Date(connection.pending_oauth_state_expires_at).getTime() <= Date.now()) {
    return { ok: false, error: 'The login request expired. Start again from Distributor Hub.' };
  }
  const candidateHash = await sha256(state);
  if (!timingSafeEqual(candidateHash, connection.pending_oauth_state_hash)) {
    return { ok: false, error: 'The login security check did not match. Start again from Distributor Hub.' };
  }
  return { ok: true, connectionId: connection.id };
}

export async function clearTooLostOAuthState(sr, connectionId) {
  await sr.entities.TooLostConnection.update(connectionId, {
    pending_oauth_state_hash: `used:${Date.now()}`,
    pending_oauth_state_expires_at: new Date(0).toISOString(),
  });
}

function bytesToBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function tokenCipherKey(config) {
  const material = config.tokenEncryptionKey || config.clientSecret;
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`gannon-waye-too-lost-token-v1:${material}`),
  );
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function encryptTokenBundle(config, bundle) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    await tokenCipherKey(config),
    new TextEncoder().encode(JSON.stringify(bundle)),
  );
  return `v1.${bytesToBase64(iv)}.${bytesToBase64(new Uint8Array(encrypted))}`;
}

async function decryptTokenBundle(config, envelope) {
  const [version, ivValue, cipherValue] = String(envelope || '').split('.');
  if (version !== 'v1' || !ivValue || !cipherValue) throw new Error('Invalid token envelope');
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(ivValue) },
    await tokenCipherKey(config),
    base64ToBytes(cipherValue),
  );
  return JSON.parse(new TextDecoder().decode(decrypted));
}

export async function saveTooLostConnection(sr, config, tokens) {
  if (!tokens?.access_token) throw new Error('Too Lost did not return an access token.');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (Number(tokens.expires_in) || 1296000) * 1000);
  const existing = await fetchTooLostConnection(sr);
  let existingBundle = {};
  if (existing?.token_envelope) {
    try {
      existingBundle = await decryptTokenBundle(config, existing.token_envelope);
    } catch {
      existingBundle = {};
    }
  }
  const bundle = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || existingBundle.refresh_token || null,
  };
  const patch = {
    token_envelope: await encryptTokenBundle(config, bundle),
    access_token_expires_at: expiresAt.toISOString(),
    scope: tokens.scope || undefined,
    last_refreshed_at: now.toISOString(),
  };
  if (existing) {
    await sr.entities.TooLostConnection.update(existing.id, patch);
    return existing.id;
  }
  const created = await sr.entities.TooLostConnection.create(patch);
  return created.id;
}

async function tokenRequest(config, values, operation) {
  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams(values).toString(),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    throw new Error(`Too Lost rejected the ${operation} with status ${res.status}`);
  }
  const tokens = await res.json();
  if (!tokens?.access_token) throw new Error(`Too Lost ${operation} response did not contain an access token.`);
  return tokens;
}

export async function exchangeTooLostCode(config, code) {
  return tokenRequest(config, {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code,
  }, 'authorization code');
}

async function refreshTooLostTokens(config, refreshToken) {
  return tokenRequest(config, {
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
  }, 'token refresh');
}

// Returns { token } on success, or a safe status without exposing credentials.
export async function getValidTooLostAccessToken(sr, config) {
  const missing = missingTooLostConfig(config);
  if (missing.length) {
    return { error: 'not_configured', detail: `Missing Base44 secrets: ${missing.join(', ')}` };
  }

  const connection = await fetchTooLostConnection(sr);
  if (!connection?.token_envelope) {
    return { error: 'not_connected', detail: 'Too Lost is not connected yet. Click Connect Too Lost on Distributor Hub.' };
  }

  let bundle;
  try {
    bundle = await decryptTokenBundle(config, connection.token_envelope);
  } catch {
    return { error: 'reauthorise_required', detail: 'The saved Too Lost login could not be opened securely. Click Reconnect Too Lost.' };
  }

  const expiresAt = connection.access_token_expires_at
    ? new Date(connection.access_token_expires_at).getTime()
    : 0;
  if (bundle.access_token && expiresAt > Date.now() + 120_000) {
    return { token: bundle.access_token };
  }

  if (bundle.refresh_token) {
    try {
      const tokens = await refreshTooLostTokens(config, bundle.refresh_token);
      await saveTooLostConnection(sr, config, tokens);
      return { token: tokens.access_token, refreshed: true };
    } catch (refreshError) {
      return {
        error: 'reauthorise_required',
        detail: `Too Lost could not renew the login: ${refreshError?.message || 'unknown error'}. Click Reconnect Too Lost.`,
      };
    }
  }

  return { error: 'reauthorise_required', detail: 'The Too Lost login expired. Click Reconnect Too Lost.' };
}

