import LandedCostCalculator from '@/pages/admin/LandedCostCalculator';

// Landed Cost Calculator: the full interactive calculator with the
// (Product + Shipping + Taxes + Fees) / Quantity formula and its
// LandedCostCalculation records — rendered verbatim. Zero function loss.
export default function LandedCostTab() {
  return <LandedCostCalculator />;
}