import NewReleaseStudio from '@/pages/admin/NewReleaseStudio';
import ReleasePrepStudio from '@/pages/admin/ReleasePrepStudio';

// Release Prep & Draft Studio: the full New Release Studio (Release entity
// with GENRES, MOODS, STATUS_COLORS configs, owner-gated approval fields)
// plus the Release Prep Studio (Release and SiteSettings entities) —
// merged verbatim. Zero function loss; no controlled workflow logic touched.
export default function PrepStudioTab() {
  return (
    <div className="space-y-10">
      <NewReleaseStudio />
      <div className="border-t border-border/40 pt-8">
        <ReleasePrepStudio />
      </div>
    </div>
  );
}