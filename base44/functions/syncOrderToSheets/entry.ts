import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Appends every new MerchOrder to the Google Sheets "Orders" ledger.
// Triggered by an entity automation on MerchOrder create.
const HEADERS = [
  'Order Date', 'Customer Name', 'Email', 'Phone', 'Shipping Address', 'Items',
  'Total (AUD)', 'Status', 'Order ID', 'Notes', 'Tracking Number', 'Fulfillment Status',
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const data = body.data || body;

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

    const items = (data.items || []).map(i => `${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity || 1} @ $${i.price}`).join('; ');
    const row = [
      data.created_date ? new Date(data.created_date).toLocaleDateString('en-AU') : new Date().toLocaleDateString('en-AU'),
      data.customer_name || '',
      data.customer_email || '',
      data.customer_phone || '',
      data.shipping_address || '',
      items,
      `$${(data.total_amount || 0).toFixed(2)}`,
      data.status || 'pending',
      data.id || '',
      data.notes || '',
      data.tracking_number || '',
      data.fulfillment_status || '',
    ];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Orders!A:L:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] }),
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});