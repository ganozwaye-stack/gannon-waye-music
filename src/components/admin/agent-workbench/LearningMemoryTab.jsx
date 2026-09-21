import AgentLearning from '@/components/admin/agent-workbench/AgentLearning';
import MemoryGraph from '@/components/admin/agent-workbench/MemoryGraph';
import AgentIntelligence from '@/components/admin/agent-workbench/AgentIntelligence';

// Learning Loop & Memory Graph: the learning records (AgentLearningRecord,
// LESSON_TYPES), the memory graph (MemoryGraphNode, NODE_TYPES) and the
// intelligence loop (IdeaOpportunity, KnowledgeVault) — including the
// Do-Not-Spend rule — merged verbatim. Zero function loss.
export default function LearningMemoryTab() {
  return (
    <div className="space-y-10">
      <AgentLearning />
      <div className="border-t border-border/40 pt-8">
        <MemoryGraph />
      </div>
      <div className="border-t border-border/40 pt-8">
        <AgentIntelligence />
      </div>
    </div>
  );
}