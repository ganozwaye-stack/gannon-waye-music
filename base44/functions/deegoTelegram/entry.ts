// Safety hold: the legacy Telegram doorway is disabled.
//
// It intentionally reads no secrets, receives no messages, creates no records,
// and sends no network traffic. Messaging may only be reconsidered through a
// separately approved, receipt-logged inbound workflow.
const LEGACY_HOLD_CODE = 'legacy_deego_telegram_held';

export default async function(req: Request) {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  return Response.json({
    error: 'Legacy messaging doorway is held. A separately approved receipt-logged workflow is required.',
    code: LEGACY_HOLD_CODE,
    skipped: true,
    external_actions: 0,
    network_requests: 0,
    internal_records_created: 0,
  }, { status: 503 });
}
