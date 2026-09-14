import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import {
  tooLostConfigFromSecrets,
  missingTooLostConfig,
  fetchTooLostConnection,
  rememberTooLostOAuthState,
  verifyTooLostOAuthState,
  clearTooLostOAuthState,
  exchangeTooLostCode,
  saveTooLostConnection,
} from '../../shared/tooLostAuth.ts';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
]);

function exact(value) {
  return String(value || '').trim();
}

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function safeConnectionStatus(connection, extra = {}) {
  return {
    ok: true,
    status: 'connected',
    connected_name: connection?.connected_name || null,
    connected_email: connection?.connected_email || null,
    scope: connection?.scope || null,
    access_token_expires_at: connection?.access_token_expires_at || null,
    last_refreshed_at: connection?.last_refreshed_at || null,
    checked_at: new Date().toISOString(),
    ...extra,
  };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = exact(body.action);
    const config = tooLostConfigFromSecrets(secrets);
    const missing = missingTooLostConfig(config);
    const sr = base44.asServiceRole;

    // Too Lost returns to the public callback origin, which may not share the
    // Base44 editor session. A short-lived, single-use server state authorises
    // only this one-time exchange. Every other action remains admin-only.
    if (action === 'exchange') {
      if (missing.length) {
        return json({ error: `Too Lost OAuth is not configured. Missing: ${missing.join(', ')}` }, 400);
      }
      const code = exact(body.code);
      const state = exact(body.state);
      if (!code) return json({ error: 'Authorization code missing' }, 400);
      if (!state) return json({ error: 'Authorization state missing' }, 400);

      const stateCheck = await verifyTooLostOAuthState(sr, state);
      if (!stateCheck.ok) return json({ error: stateCheck.error }, 400);
      if (!OWNER_EMAILS.has(stateCheck.requestedBy)) {
        await clearTooLostOAuthState(sr, stateCheck.connectionId);
        return json({ error: 'Only the owner who deliberately started this connection can finish it.' }, 403);
      }
      await clearTooLostOAuthState(sr, stateCheck.connectionId);

      const tokens = await exchangeTooLostCode(config, code);
      const connectionId = await saveTooLostConnection(sr, config, tokens);

      // This callback completes the one user-started OAuth exchange only.
      // It never performs an optional profile lookup or background token renewal.

      const current = await fetchTooLostConnection(sr);
      return json(safeConnectionStatus(current));
    }

    const user = await base44.auth.me().catch(() => null);
    const actorEmail = String(user?.email || '').trim().toLowerCase();
    if (!user || user.role !== 'admin' || !OWNER_EMAILS.has(actorEmail)) {
      return json({ error: 'Only Gannon can manage the Too Lost connection' }, 403);
    }

    if (action === 'status') {
      if (missing.length) {
        return json({
          ok: true,
          status: 'not_configured',
          detail: `Complete the Too Lost developer setup. Missing: ${missing.join(', ')}`,
          missing,
          checked_at: new Date().toISOString(),
        });
      }

      const existing = await fetchTooLostConnection(sr);
      if (!existing?.token_envelope) {
        return json({
          ok: true,
          status: 'not_connected',
          detail: 'Click Connect Too Lost to sign in securely.',
          checked_at: new Date().toISOString(),
        });
      }

      const expiresAt = existing.access_token_expires_at
        ? new Date(existing.access_token_expires_at).getTime()
        : 0;
      if (!expiresAt || expiresAt <= Date.now() + 120_000) {
        return json({
          ok: true,
          status: 'reauthorise_required',
          detail: 'The saved Too Lost login needs a deliberate reconnect before it can be used.',
          checked_at: new Date().toISOString(),
        });
      }

      return json(safeConnectionStatus(existing, { read_only: true }));
    }

    if (action === 'authorize_url') {
      if (missing.length) {
        return json({ error: `Too Lost OAuth is not configured. Missing: ${missing.join(', ')}` }, 400);
      }

      const state = crypto.randomUUID().replace(/-/g, '');
      await rememberTooLostOAuthState(sr, state, actorEmail);
      const url = `${config.authorizeUrl}?${new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.oauthScopes,
        state,
      }).toString()}`;
      return json({ ok: true, url });
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    return json({ error: error?.message || 'Unknown error' }, 500);
  }
}

