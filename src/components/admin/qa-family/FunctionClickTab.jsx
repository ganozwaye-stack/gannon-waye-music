import SiteFunctionAudit from '@/pages/admin/SiteFunctionAudit';
import ClickAudit from '@/pages/admin/ClickAudit';

// Site Function & Click Audit: the full Site Function Audit and Click Audit
// (AUDIT_DATA and ROUTE_AUDIT configs, the 247 mapped route counters —
// working vs broken — and the filterable page inspection tables) — merged
// verbatim. Zero function loss.
export default function FunctionClickTab() {
  return (
    <div className="space-y-10">
      <SiteFunctionAudit />
      <div className="border-t border-border/40 pt-8">
        <ClickAudit />
      </div>
    </div>
  );
}