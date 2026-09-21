import OwnerBusinessHub from '@/pages/admin/OwnerBusinessHub';
import HumanActionRequired from '@/pages/admin/HumanActionRequired';

// Flightdeck Overview & Action Inbox: the full Owner Business Hub
// (SystemsManagerLead entity, PINNED_TASKS_DEFAULT and ACTIONS configs,
// private owner panel widgets) plus the critical Human Action Required
// action inbox — merged verbatim. Zero function loss.
export default function FlightdeckTab() {
  return (
    <div className="space-y-10">
      <OwnerBusinessHub />
      <div className="border-t border-border/40 pt-8">
        <HumanActionRequired />
      </div>
    </div>
  );
}