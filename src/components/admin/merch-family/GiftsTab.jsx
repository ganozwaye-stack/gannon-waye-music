import GiftClaims from '@/pages/admin/GiftClaims';
import GiftVerification from '@/pages/admin/GiftVerification';
import GiftProgressAdmin from '@/pages/admin/GiftProgressAdmin';

// Gifts, Verification & Progress: the full Gift Claims, Gift Verification and
// Gift Progress screens (GiftClaim and GiftRequirementTracker entities,
// STATUS_CONFIG configs, subscriber gift milestone bars) — merged verbatim.
// Zero function loss.
export default function GiftsTab() {
  return (
    <div className="space-y-10">
      <GiftClaims />
      <div className="border-t border-border/40 pt-8">
        <GiftVerification />
      </div>
      <div className="border-t border-border/40 pt-8">
        <GiftProgressAdmin />
      </div>
    </div>
  );
}