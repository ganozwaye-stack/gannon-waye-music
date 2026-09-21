import ApprovalQueuePage from '@/pages/admin/ApprovalQueue';
import MarketingCentre from '@/pages/admin/MarketingCentre';

// Approval Queue & System Approvals: the full Approval Queue (ApprovalQueue,
// ContentCalendarPost and PurchaseOrder entities, risk badges, approval
// markdown viewer) plus the Marketing Centre campaign controls — merged
// verbatim. Zero function loss.
export default function ApprovalsTab() {
  return (
    <div className="space-y-10">
      <ApprovalQueuePage />
      <div className="border-t border-border/40 pt-8">
        <MarketingCentre />
      </div>
    </div>
  );
}