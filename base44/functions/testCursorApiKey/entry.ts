import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const apiKey = Deno.env.get('CURSOR_API_KEY');
    if (!apiKey) {
      return Response.json({ status: 'missing', message: 'CURSOR_API_KEY secret not set' });
    }

    // Test with GET /v1/me — never return the key itself
    const resp = await fetch('https://api.cursor.sh/v1/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (resp.ok) {
      const data = await resp.json().catch(() => ({}));
      return Response.json({
        status: 'valid',
        message: 'Cursor API key is valid',
        account: data.email || data.username || 'authenticated',
      });
    } else if (resp.status === 401) {
      return Response.json({ status: 'invalid', message: 'Cursor API key is invalid or expired' });
    } else {
      return Response.json({ status: 'invalid', message: `Unexpected status: ${resp.status}` });
    }
  } catch (error) {
    return Response.json({ status: 'invalid', message: error.message }, { status: 500 });
  }
});