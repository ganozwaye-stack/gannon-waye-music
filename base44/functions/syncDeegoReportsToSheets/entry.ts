import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { secrets } from 'base44:runtime';
import { upsertRow } from '../../shared/sheetsBackup.ts';

// DEEGO REPORT → MASTER SPREADSHEET. Keeps every Deego owner report, its
// stock and pricing offers, and its market comparison rows in sync with the
// master Google Spreadsheet. Triggered automatically when a DeegoOwnerReport
// record is created or updated, and callable by the owner. It only mirrors
// private admin data out to the owner's own spreadsheet; it reads nothing
// back and takes no other external action.

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function exact(value) {
  return String(value ?? '').trim();
}

const REPORT_HEADERS = [
  'Report ID', 'Version', 'Title', 'Generated At',
  'Summary', 'Recommendation', 'Decision Requested', 'Telegram Status', 'Email Status',
];
const OFFER_HEADERS = [
  'Key', 'Report ID', 'Offer', 'Price', 'Stock', 'Status',
  'Cost', 'Market', 'Margin', 'Recommendation', 'Action',
];
const COMPARISON_HEADERS = ['Key', 'Report ID', 'Category', 'Seller', 'Price', 'Qualification', 'URL'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // When a signed-in user calls this endpoint it must be the owner.
    // Workflow-triggered runs have no user session and proceed as the
    // service-role automation of the owner's own report records.
    const user = await base44.auth.me().catch(() => null);
    if (user && (user.role !== 'admin' || !OWNER_EMAILS.has(exact(user.email).toLowerCase()))) {
      return Response.json({ error: 'Only Gannon can trigger a Deego report sync' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const reportId = exact(body.report_id || body.id);
    if (!reportId) return Response.json({ error: 'report_id is required' }, { status: 400 });

    const sr = base44.asServiceRole;
    const report = await sr.entities.DeegoOwnerReport.get(reportId).catch(() => null);
    if (!report?.id) return Response.json({ error: 'Deego owner report not found' }, { status: 404 });

    const sheetId = exact(secrets.get('GOOGLE_SHEET_ID'));
    if (!sheetId) {
      return Response.json({ error: 'GOOGLE_SHEET_ID is not configured. Add it in app secrets.' }, { status: 500 });
    }

    const { accessToken } = await sr.connectors.getConnection('googlesheets');

    // Each report version gets its own row: a new version is new evidence
    // and must never silently overwrite a delivered one.
    const reportKey = `${exact(report.report_id) || report.id} · ${exact(report.version)}`;
    await upsertRow(accessToken, sheetId, 'Deego Reports', REPORT_HEADERS, 'I', reportKey, [
      exact(report.report_id) || report.id,
      exact(report.version),
      exact(report.title),
      exact(report.generated_at),
      exact(report.summary),
      exact(report.recommendation),
      exact(report.decision_requested),
      exact(report.telegram_status),
      exact(report.email_status),
    ]);

    let offersSynced = 0;
    for (const offer of Array.isArray(report.offers) ? report.offers : []) {
      const name = exact(offer.name);
      if (!name) continue;
      const key = `${report.id} · ${name}`;
      await upsertRow(accessToken, sheetId, 'Deego Offers', OFFER_HEADERS, 'K', key, [
        key,
        exact(report.report_id) || report.id,
        name,
        exact(offer.price),
        exact(offer.stock),
        exact(offer.status),
        exact(offer.cost),
        exact(offer.market),
        exact(offer.margin),
        exact(offer.recommendation),
        exact(offer.action),
      ]);
      offersSynced += 1;
    }

    let comparisonsSynced = 0;
    for (const row of Array.isArray(report.comparison) ? report.comparison : []) {
      const seller = exact(row.seller);
      if (!seller) continue;
      const key = `${report.id} · ${exact(row.category)} · ${seller}`;
      await upsertRow(accessToken, sheetId, 'Deego Market Comparison', COMPARISON_HEADERS, 'G', key, [
        key,
        exact(report.report_id) || report.id,
        exact(row.category),
        seller,
        exact(row.price),
        exact(row.qualification),
        exact(row.url),
      ]);
      comparisonsSynced += 1;
    }

    return Response.json({
      ok: true,
      synced: { reports: 1, offers: offersSynced, comparisons: comparisonsSynced },
      sheet_id: sheetId,
      report_key: reportKey,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'The Deego report sync failed.' }, { status: 500 });
  }
}