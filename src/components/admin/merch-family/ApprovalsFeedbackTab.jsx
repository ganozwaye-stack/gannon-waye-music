import MerchFeedbackAdmin from '@/components/admin/merch-family/MerchFeedbackAdmin';
import MerchApprovalGate from '@/components/admin/merch-family/MerchApprovalGate';

// Product Approvals & Fan Feedback: the full Merch Feedback Admin
// (MerchFeedback entity) and Merch Approval Gate (product approval gates)
// screens — merged verbatim. Zero function loss.
export default function ApprovalsFeedbackTab() {
  return (
    <div className="space-y-10">
      <MerchFeedbackAdmin />
      <div className="border-t border-border/40 pt-8">
        <MerchApprovalGate />
      </div>
    </div>
  );
}