import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SHEET_ID = '1Un_w0_vESILCXp41xYM7BfUeFbjqs5GnIMYbhwfv0z8';
const SHEET_TAB = 'All Orders';
const HEADERS = ['order_id','date','customer_name','email','products','qty','size','total','status','promo_code','address','tracking_number','stripe_payment_intent','profit_estimate','notes'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { order_id } = await req.json();
    if (!order_id) return Response.json({ error: 'order_id required' }, { status: 400 });

    const order = await base44.asServiceRole.entities.MerchOrder.get(order_id);
    if (!order) return Response.json({ error: 'Order not found' }, { status: 404 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');

    // Ensure header row
    const checkRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_TAB)}!A1:O1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const checkData = await checkRes.json();
    if (!checkData.values || checkData.values.length === 0) {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_TAB)}!A1:O1?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [HEADERS] })
        }
      );
    }

    const items = order.items || [];
    const profit = items.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1) * 0.4), 0);

    const row = [
      order.id,
      order.created_date ? new Date(order.created_date).toLocaleDateString('en-AU') : '',
      order.customer_name || '',
      order.customer_email || '',
      items.map(i => i.product_name).join(', '),
      items.map(i => i.quantity).join(', '),
      items.map(i => i.size || '—').join(', '),
      `$${(order.total_amount || 0).toFixed(2)}`,
      order.status || '',
      order.promo_code || '',
      order.shipping_address || '',
      order.tracking_number || '',
      order.stripe_payment_intent || '',
      `$${profit.toFixed(2)}`,
      order.notes || '',
    ];

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(SHEET_TAB)}!A:O:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [row] })
      }
    );
    const appendData = await appendRes.json();
    const rowAppended = !!(appendData.updates?.updatedRows > 0 || appendData.updates);

    return Response.json({ success: true, row_appended: rowAppended, order_id });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});