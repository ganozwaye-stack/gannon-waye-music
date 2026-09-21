import AgentRegistryPage from '@/components/admin/agent-workbench/AgentRegistry';
import AgentRevenueStatus from '@/components/admin/agent-workbench/AgentRevenueStatus';

// Agent Registry & Capabilities: the full agent registry (AgentRegistry,
// AgentMemory, AgentLearningRecord, AgentActionProposal, GrowthOpportunity,
// KnowledgeVault; GROUPS, RISK_COLORS, READINESS_CHECKLIST) plus the revenue
// status board — merged verbatim. Zero function loss.
export default function RegistryTab() {
  return (
    <div className="space-y-10">
      <AgentRegistryPage />
      <div className="border-t border-border/40 pt-8">
        <AgentRevenueStatus />
      </div>
    </div>
  );
}