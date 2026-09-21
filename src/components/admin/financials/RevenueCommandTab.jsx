import RevenueCommandCentre from '@/components/admin/financials/RevenueCommandCentre';
import RevenueActions from '@/components/admin/financials/RevenueActions';

// Revenue Command & Action Proposals: the full Revenue Command Centre
// (RevenueOpportunity records, REVENUE_TABS filters, OppDetailModal with
// notes and status actions, agent cards) plus the Action Proposals board
// (AgentActionProposal cards with stock notes, ProposalDetailModal) —
// merged verbatim. Zero function loss.
export default function RevenueCommandTab() {
  return (
    <div className="space-y-10">
      <RevenueCommandCentre />
      <div className="border-t border-border/40 pt-8">
        <RevenueActions />
      </div>
    </div>
  );
}