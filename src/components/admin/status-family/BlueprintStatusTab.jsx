import FinalSystemStatus from '@/components/admin/status-family/FinalSystemStatus';
import FinalSystemReport from '@/components/admin/status-family/FinalSystemReport';

// System Blueprint & Audit Reports: the full Final System Status and Final
// System Report screens (STATUS_CONFIG, SECTIONS, NEXT_ACTIONS, TABLE and
// HUMAN_ACTIONS_REQUIRED configs, pass/fail test tables, generated report
// history) — merged verbatim. Zero function loss.
export default function BlueprintStatusTab() {
  return (
    <div className="space-y-10">
      <FinalSystemStatus />
      <div className="border-t border-border/40 pt-8">
        <FinalSystemReport />
      </div>
    </div>
  );
}