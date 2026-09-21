import ReleaseControlDesk from '@/pages/admin/ReleaseControlDesk';
import Releases from '@/pages/admin/Releases';

// Owner Control Desk & Register Archive: the full owner-only Release
// Control Desk (safety holds, evidence fields, fingerprint confirmations)
// plus the Releases register archive (read-only release history) — merged
// verbatim. Zero function loss; the standalone /admin/release-control route
// stays live and unchanged — this tab renders the same component.
export default function OwnerControlTab() {
  return (
    <div className="space-y-10">
      <ReleaseControlDesk />
      <div className="border-t border-border/40 pt-8">
        <Releases />
      </div>
    </div>
  );
}