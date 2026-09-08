import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureTabWithHeaders, findRowByValue } from '../../shared/sheetsBackup.ts';

// Inventory stock tracker in Google Sheets ("Inventory" tab).
// Fires on every sale (MerchOrder created or updated). One row per product,
// keyed by Product ID, always refreshed from the live MerchProduct record so
// the tracker mirrors real stock at the moment of the sale.

const HEADERS = ['Product', 'Product ID', 'Stock Remaining', 'Variant Stock', 'Category', 'Last Order', 'Last Updated'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const data = body.data || body;
    const orderId = String(body.order_id || data.id || body?.entity_id || '').trim();

    let productIds = [...new Set((Array.isArray(data.items) ? data.items : [])
      .map(item => item && item.product_id).filter(Boolean))];

    if (!productIds.length && orderId) {
      const order = await sr.entities.MerchOrder.get(orderId).catch(() => null);
      productIds = [...new Set((Array.isArray(order?.items) ? order.items : [])
        .map(item => item && item.product_id).filter(Boolean))];
    }

    if (!productIds.length) {
      return Response.json({ success: true, skipped: true, reason: 'no products to track on this order' });
    }

    const { accessToken } = await sr.connectors.getConnection('googlesheets');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');
    await ensureTabWithHeaders(accessToken, sheetId, 'Inventory', HEADERS, 'G');

    let synced = 0;
    for (const productId of productIds) {
      const product = await sr.entities.MerchProduct.get(productId).catch(() => null);
      if (!product) continue;

      const variantStock = product.stock_by_variant && Object.keys(product.stock_by_variant).length
        ? Object.entries(product.stock_by_variant).map(([variant, qty]) => `${variant}: ${qty}`).join(', ')
        : '';

      const row = [
        String(product.name || ''),
        productId,
        Number(product.stock_quantity ?? 0),
        variantStock,
        String(product.category || ''),
        orderId || '',
        new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }),
      ];

      const existingRow = await findRowByValue(accessToken, sheetId, 'Inventory', 'B', productId);
      if (existingRow > 1) {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Inventory!A${existingRow}:G${existingRow}?valueInputOption=RAW`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [row] }),
        });
      } else {
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Inventory!A:G:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [row] }),
        });
      }
      synced += 1;
    }

    return Response.json({ success: true, products_synced: synced, order_id: orderId || null });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}