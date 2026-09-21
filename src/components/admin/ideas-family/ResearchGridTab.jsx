import ResearchHub from '@/components/admin/ideas-family/ResearchHub';
import ResearchGrid from '@/components/admin/ideas-family/ResearchGrid';

// Research Hub & Live Scan Grid: the full Research Hub (AgentRegistry,
// ApprovalQueue, CreatorGapInsight, KnowledgeVault and ViralOpportunity
// entities, live web scanner and synthesis engine integration) plus the
// Research Grid — merged verbatim. Zero function loss.
export default function ResearchGridTab() {
  return (
    <div className="space-y-10">
      <ResearchHub />
      <div className="border-t border-border/40 pt-8">
        <ResearchGrid />
      </div>
    </div>
  );
}