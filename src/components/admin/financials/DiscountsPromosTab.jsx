import PromoCodes from '@/components/admin/financials/PromoCodes';
import PromoCodeAudit from '@/components/admin/financials/PromoCodeAudit';
import DiscountGuardAdmin from '@/components/admin/financials/DiscountGuardAdmin';

// Promo Codes & Discount Guard: the full PromoCode manager (CRUD, send
// flows), the audit rules for active codes (F20UN26DVIP, F30MOM26A) with
// ALWAYS_EXCLUDED, ELIGIBLE_DEFAULTS and TEST_CASES configs, and the
// checkout Discount Guard admin — merged verbatim. Zero function loss.
export default function DiscountsPromosTab() {
  return (
    <div className="space-y-10">
      <PromoCodes />
      <div className="border-t border-border/40 pt-8">
        <PromoCodeAudit />
      </div>
      <div className="border-t border-border/40 pt-8">
        <DiscountGuardAdmin />
      </div>
    </div>
  );
}