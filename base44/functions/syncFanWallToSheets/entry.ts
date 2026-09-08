import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureTabWithHeaders } from '../../shared/sheetsBackup.ts';

// Live backup of the fan community wall in Google Sheets ("FanWall" tab).
// One row per post or reply the moment it is created. Records are re-fetched
// by id so the backup is complete even when the trigger payload is trimmed.

const HEADERS = ['Timestamp', 'Type', 'Author', 'Content', 'Status', 'Record ID'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const recordType = String(body.record_type || 'post') === 'reply' ? 'reply' : 'post';
    const recordId = String(body.record_id || body?.entity_id || '').trim();

    let data = body.data || {};
    if (recordId) {
      const entity = recordType === 'reply' ? sr.entities.CommunityReply : sr.entities.FanPost;
      const fetched = await entity.get(recordId).catch(() => null);
      if (fetched) data = fetched;
    }

    const content = String(data.content || '').trim();
    if (!content && !recordId) {
      return Response.json({ success: true, skipped: true, reason: 'nothing to back up' });
    }

    const { accessToken } = await sr.connectors.getConnection('googlesheets');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    await ensureTabWithHeaders(accessToken, sheetId, 'FanWall', HEADERS, 'F');

    const row = [
      new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
      recordType,
      String(data.author_name || data.author_email || 'Anonymous').slice(0, 120),
      content.slice(0, 3000),
      String(data.status || ''),
      recordId || String(data.id || ''),
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/FanWall!A:F:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    });

    return Response.json({ success: true, record_type: recordType, record_id: recordId });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}