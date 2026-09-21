import OrchestratorChat from '@/pages/admin/OrchestratorChat';
import OpenAICommandCentre from '@/pages/admin/OpenAICommandCentre';

// Agent Chat & Orchestrator: the orchestrator conversation console (AgentMessage)
// and the OpenAI Command Centre (API key link + emergency kill-switch) merged
// verbatim. Zero function loss — both original screens render in full.
export default function OrchestratorTab() {
  return (
    <div className="space-y-10">
      <OrchestratorChat />
      <div className="border-t border-border/40 pt-8">
        <OpenAICommandCentre />
      </div>
    </div>
  );
}