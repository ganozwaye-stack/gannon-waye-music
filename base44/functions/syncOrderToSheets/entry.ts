import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Real-time MerchOrder ledger in Google Sheets ("Orders" tab).
// Upsert by Order ID: updates the existing row when an order changes
// (status / tracking / fulfillment), appends a new row on first creation.
const HEADERS = [
  'Order Date', 'Customer Name', 'Email', 'Phone', 'Shipping Address', 'Items',
  'Total (AUD)', 'Status', 'Order ID', 'Notes', 'Tracking Number', 'Fulfillment Status',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const data = body.data || body;
    const orderId = data.id || body?.event?.entity_id;

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

    // Ensure header row exists and matches the current column set
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Orders!A1:L1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();
    const hasFullHeaders = checkData.values && checkData.values[0] && checkData.values[0].length >= HEADERS.length;
    if (!hasFullHeaders) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Orders!A1:L1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [HEADERS] }),
        }
      );
    }

    const buildRow = () => {
      const items = (data.items || []).map(i => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity || 1} @ $${i.price}`).join('; ');
      return [
        data.created_date ? new Date(data.created_date).toLocaleDateString('en-AU') : new Date().toLocaleDateString('en-AU'),
        data.customer_name || '',
        data.customer_email || '',
        data.customer_phone || '',
        data.shipping_address || '',
        items,
        `$${(data.total_amount || 0).toFixed(2)}`,
        data.status || 'pending',
        orderId || '',
        data.notes || '',
        data.tracking_number || '',
        data.fulfillment_status || '',
      ];
    };

    // Find existing row by Order ID (column I)
    let existingRow = 0;
    if (orderId) {
      const idRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Orders!I:I`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const idData = await idRes.json();
      const ids = idData.values || [];
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] && ids[i][0] === orderId) { existingRow = i + 1; break; }
      }
    }

    const row = buildRow();

    if (existingRow > 1) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Orders!A${existingRow}:L${existingRow}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [row] }),
        }
      );
      return Response.json({ success: true, updated: true, row: existingRow, order_id: orderId });
    }

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Orders!A:L:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    );
    return Response.json({ success: true, appended: true, order_id: orderId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});