import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Newsletter signup ledger in Google Sheets ("Subscribers" tab).
// Upsert by email: updates the existing row if the subscriber re-signs,
// appends a new row on first signup.
const HEADERS = [
  'Date', 'Name', 'Email', 'Phone', 'Date of Birth', 'How Found', 'Subscriber ID',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const data = body.data || body;
    const subscriberId = data.id || body?.event?.entity_id;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

    // Ensure header row exists
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Subscribers!A1:G1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();
    const hasHeaders = checkData.values && checkData.values[0] && checkData.values[0].length >= HEADERS.length;
    if (!hasHeaders) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Subscribers!A1:G1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );
    }

    const row = [
      data.created_date
        ? new Date(data.created_date).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
        : new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.date_of_birth || '',
      data.how_found || '',
      subscriberId || '',
    ];

    // Upsert by email (column C)
    let existingRow = 0;
    if (data.email) {
      const emailRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Subscribers!C:C`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const emailData = await emailRes.json();
      const emails = emailData.values || [];
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] && emails[i][0] === data.email) { existingRow = i + 1; break; }
      }
    }

    if (existingRow > 1) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Subscribers!A${existingRow}:G${existingRow}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [row] }),
        }
      );
      return Response.json({ success: true, updated: true, row: existingRow, subscriber_id: subscriberId });
    }

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Subscribers!A:G:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    );
    return Response.json({ success: true, appended: true, subscriber_id: subscriberId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});