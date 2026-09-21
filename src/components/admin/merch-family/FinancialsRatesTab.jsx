import MerchFinancials from '@/components/admin/merch-family/MerchFinancials';
import ShippingRates from '@/components/admin/merch-family/ShippingRates';
import BundleProposalStudio from '@/components/admin/merch-family/BundleProposalStudio';

// Financials, Rates & Bundle Proposals: the full Merch Financials (margin
// calculators), Shipping Rates (ShippingRate entity) and Bundle Proposal
// Studio (BundleProposal entity, tier proposals) screens — merged verbatim.
// Zero function loss.
export default function FinancialsRatesTab() {
  return (
    <div className="space-y-10">
      <MerchFinancials />
      <div className="border-t border-border/40 pt-8">
        <ShippingRates />
      </div>
      <div className="border-t border-border/40 pt-8">
        <BundleProposalStudio />
      </div>
    </div>
  );
}