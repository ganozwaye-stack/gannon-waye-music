import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import {
  tooLostConfigFromSecrets,
  exchangeTooLostCode,
  saveTooLostConnection,
} from '../../shared/tooLostAuth.ts';

// Too Lost OAuth connect flow — no API token is stored as a secret.
// action 'authorize_url' → returns the Too Lost authorize screen URL + state.
// action 'exchange'       → exchanges the returned code for tokens, stored in TooLostConnection.

function exact(value) {
  return String(value || '').trim();
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Only Gannon can connect Too Lost' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const action = exact(body.action);
    const config = tooLostConfigFromSecrets(secrets);

    if (action === 'authorize_url') {
      if (!config.clientId || !config.redirectUri) {
        return Response.json({ error: 'Too Lost OAuth is not configured — the TOO_LOST_CLIENT_ID or TOO_LOST_REDIRECT_URI secret is missing.' }, { status: 400 });
      }
      const state = crypto.randomUUID().replace(/-/g, '');
      const url = `${config.authorizeUrl}?${new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: 'read:profile read:catalog write:releases',
        state,
      }).toString()}`;
      return Response.json({ ok: true, url, state });
    }

    if (action === 'exchange') {
      const code = exact(body.code);
      if (!code) return Response.json({ error: 'Authorization code missing' }, { status: 400 });

      const tokens = await exchangeTooLostCode(config, code);
      const sr = base44.asServiceRole;
      await saveTooLostConnection(sr, tokens);

      // Record which Too Lost account the tokens belong to.
      let account = null;
      try {
        const meRes = await fetch(`${secrets.get('TOO_LOST_API_BASE_URL') || 'https://api.toolost.com/v1'}/me`, {
          headers: { Authorization: `Bearer ${tokens.access_token}`, Accept: 'application/json' },
        });
        if (meRes.ok) {
          const meData = await meRes.json().catch(() => ({}));
          account = meData?.data || null;
        }
      } catch {
        // Profile lookup is nice-to-have; the connection itself already succeeded.
      }
      if (account) {
        const connection = await sr.entities.TooLostConnection.filter({});
        if (connection?.length) {
          await sr.entities.TooLostConnection.update(connection[0].id, {
            connected_name: [account.first_name, account.last_name].filter(Boolean).join(' ') || account.username || undefined,
            connected_email: account.email || undefined,
          });
        }
      }

      return Response.json({ ok: true, connected_email: account?.email || null });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}