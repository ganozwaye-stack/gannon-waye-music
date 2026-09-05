// Shared Too Lost OAuth helpers. No token is ever stored as a platform secret —
// the owner connects once through the Too Lost authorize screen and the tokens
// live in the TooLostConnection entity behind admin-only access, where they are
// refreshed automatically with the stored refresh token.

export function tooLostConfigFromSecrets(secrets) {
  return {
    clientId: secrets.get('TOO_LOST_CLIENT_ID') || '',
    clientSecret: secrets.get('TOO_LOST_CLIENT_SECRET') || '',
    tokenUrl: secrets.get('TOO_LOST_TOKEN_URL') || 'https://toolost.com/oauth/token',
    authorizeUrl: secrets.get('TOO_LOST_AUTHORIZE_URL') || 'https://toolost.com/oauth/authorize',
    redirectUri: secrets.get('TOO_LOST_REDIRECT_URI') || '',
  };
}

export async function fetchTooLostConnection(sr) {
  const list = await sr.entities.TooLostConnection.filter({});
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}

export async function saveTooLostConnection(sr, tokens) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (Number(tokens.expires_in) || 1296000) * 1000);
  const patch = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || undefined,
    access_token_expires_at: expiresAt.toISOString(),
    scope: tokens.scope || undefined,
    last_refreshed_at: now.toISOString(),
  };
  const existing = await fetchTooLostConnection(sr);
  if (existing) {
    // Keep the old refresh token if the new response omits one.
    if (!tokens.refresh_token && existing.refresh_token) patch.refresh_token = existing.refresh_token;
    await sr.entities.TooLostConnection.update(existing.id, patch);
    return existing.id;
  }
  const created = await sr.entities.TooLostConnection.create(patch);
  return created.id;
}

export async function exchangeTooLostCode(config, code) {
  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      code,
    }).toString(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Too Lost rejected the authorization code (${res.status}): ${text.slice(0, 300)}`);
  }
  return await res.json();
}

async function refreshTooLostTokens(config, refreshToken) {
  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: refreshToken,
    }).toString(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Too Lost rejected the refresh (${res.status}): ${text.slice(0, 300)}`);
  }
  return await res.json();
}

// Returns { token } on success, or { error: 'not_connected' | 'reauthorise_required', detail }.
export async function getValidTooLostAccessToken(sr, config) {
  const connection = await fetchTooLostConnection(sr);
  if (!connection) {
    return { error: 'not_connected', detail: 'Too Lost is not connected yet — click Connect Too Lost on the Distributors page.' };
  }
  const now = Date.now();
  const expiresAt = connection.access_token_expires_at ? new Date(connection.access_token_expires_at).getTime() : 0;
  if (connection.access_token && expiresAt > now + 60_000) {
    return { token: connection.access_token };
  }
  if (connection.refresh_token) {
    try {
      const tokens = await refreshTooLostTokens(config, connection.refresh_token);
      await saveTooLostConnection(sr, tokens);
      return { token: tokens.access_token };
    } catch (refreshError) {
      return { error: 'reauthorise_required', detail: `Too Lost connection expired and could not be renewed — ${refreshError?.message || 'unknown error'}. Click Connect Too Lost to reconnect.` };
    }
  }
  return { error: 'reauthorise_required', detail: 'Too Lost connection has expired — click Connect Too Lost to reconnect.' };
}