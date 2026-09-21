import WebsiteOps from '@/pages/admin/WebsiteOps';
import AutonomousOps from '@/pages/admin/AutonomousOps';

// Website & Autonomous Ops Controls: the full Website Ops and Autonomous Ops
// screens (ApprovalQueue and AgentTaskLog entities; WEBSITE_TOOLS and
// HELD_LOOPS configs stay under their active safety holds) — merged verbatim.
// Zero function loss.
export default function OpsControlsTab() {
  return (
    <div className="space-y-10">
      <WebsiteOps />
      <div className="border-t border-border/40 pt-8">
        <AutonomousOps />
      </div>
    </div>
  );
}