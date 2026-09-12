import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { upsertRow } from '../../shared/sheetsBackup.ts';

// Deego owner reports → master Google Spreadsheet (GOOGLE_SHEET_ID).
// Three tabs, one organised place for stock and market comparisons:
//   "Deego Reports"           one row per report version
//   "Deego Offers"            one row per offer (price, stock, cost, margin)
//   "Deego Market Comparison" one row per market comparison entry
// Rows are keyed so a re-sync updates in place instead of duplicating.
// New evidence produces a new version, so each version keeps its own row.

const REPORT_HEADERS = ['Key', 'Report ID', 'Version', 'Title', 'Generated At', 'Snapshot Label', 'Summary', 'Recommendation', 'Decision Requested', 'Telegram Status', 'Email Status'];
const OFFER_HEADERS = ['Key', 'Report ID', 'Offer', 'Price', 'Stock', 'Status', 'Cost', 'Market', 'Margin', 'Recommendation', 'Action'];
const COMPARISON_HEADERS = ['Key', 'Report ID', 'Category', 'Seller', 'Price', 'Qualification', 'URL'];

const clean = (value) => (value === null || value === undefined ? '' : String(value));

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const reportId = String(body.report_id || body.reportId || '').trim();

    let reports = [];
    if (reportId) {
      const report = await sr.entities.DeegoOwnerReport.get(reportId).catch(() => null);
      reports = report ? [report] : [];
    } else {
      reports = await sr.entities.DeegoOwnerReport.list('-created_date', 100);
    }

    if (!reports.length) {
      return Response.json({ success: true, reports_synced: 0, reason: 'no reports found' });
    }

    const { accessToken } = await sr.connectors.getConnection('googlesheets');
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID');

    let reportsSynced = 0;
    let offersSynced = 0;
    let comparisonSynced = 0;

    for (const report of reports) {
      const idKey = `${clean(report.report_id)} v${clean(report.version)}`;
      await upsertRow(accessToken, sheetId, 'Deego Reports', REPORT_HEADERS, 'K', idKey, [
        idKey,
        clean(report.report_id),
        clean(report.version),
        clean(report.title),
        clean(report.generated_at),
        clean(report.snapshot_label),
        clean(report.summary),
        clean(report.recommendation),
        clean(report.decision_requested),
        clean(report.telegram_status),
        clean(report.email_status),
      ]);
      reportsSynced += 1;

      for (const offer of (Array.isArray(report.offers) ? report.offers : [])) {
        const offerKey = `${clean(report.report_id)} - ${clean(offer.name)}`;
        await upsertRow(accessToken, sheetId, 'Deego Offers', OFFER_HEADERS, 'K', offerKey, [
          offerKey,
          clean(report.report_id),
          clean(offer.name),
          clean(offer.price),
          clean(offer.stock),
          clean(offer.status),
          clean(offer.cost),
          clean(offer.market),
          clean(offer.margin),
          clean(offer.recommendation),
          clean(offer.action),
        ]);
        offersSynced += 1;
      }

      for (const entry of (Array.isArray(report.comparison) ? report.comparison : [])) {
        const entryKey = `${clean(report.report_id)} - ${clean(entry.category)} - ${clean(entry.seller)}`;
        await upsertRow(accessToken, sheetId, 'Deego Market Comparison', COMPARISON_HEADERS, 'G', entryKey, [
          entryKey,
          clean(report.report_id),
          clean(entry.category),
          clean(entry.seller),
          clean(entry.price),
          clean(entry.qualification),
          clean(entry.url),
        ]);
        comparisonSynced += 1;
      }
    }

    return Response.json({
      success: true,
      reports_synced: reportsSynced,
      offers_synced: offersSynced,
      comparison_synced: comparisonSynced,
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}