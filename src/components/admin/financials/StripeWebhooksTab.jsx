import StripeCommandCentre from '@/pages/admin/StripeCommandCentreNew';
import WebhookHealth from '@/pages/admin/WebhookHealthNew';

// Stripe Intelligence & Webhook Health: the full Stripe Command Centre
// (MerchOrder and PaymentDiagnostic records, Stripe dashboard links) plus
// the live webhook diagnostics board (StripeEventLog) — merged verbatim.
// Zero function loss.
export default function StripeWebhooksTab() {
  return (
    <div className="space-y-10">
      <StripeCommandCentre />
      <div className="border-t border-border/40 pt-8">
        <WebhookHealth />
      </div>
    </div>
  );
}