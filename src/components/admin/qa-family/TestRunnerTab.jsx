import PlaywrightTestCentre from '@/pages/admin/PlaywrightTestCentre';
import AutonomousRepairLoop from '@/pages/admin/AutonomousRepairLoop';

// Playwright Test Runner & Autonomous Repair Loops: the full Playwright Test
// Centre (QA_SUITES config, GitHub Actions runner status) plus the Autonomous
// Repair Loop (AgentMessage, SystemHealthIssue and AdminNotification entities,
// REPAIR_TASKS and WARP_CMDS configs, Warp terminal commands) — merged
// verbatim. Zero function loss.
export default function TestRunnerTab() {
  return (
    <div className="space-y-10">
      <PlaywrightTestCentre />
      <div className="border-t border-border/40 pt-8">
        <AutonomousRepairLoop />
      </div>
    </div>
  );
}