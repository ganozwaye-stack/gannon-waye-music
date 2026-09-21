import ClientInstalls from '@/pages/admin/ClientInstalls';
import AtoZIndex from '@/pages/admin/AtoZIndex';

// Client Installs & Site A-Z Index: the full Client Installs
// (ClientBlueprintInstall entity) plus the A-to-Z Index with its ALL_PAGES
// fast-search index — merged verbatim. Zero function loss.
export default function InstallsIndexTab() {
  return (
    <div className="space-y-10">
      <ClientInstalls />
      <div className="border-t border-border/40 pt-8">
        <AtoZIndex />
      </div>
    </div>
  );
}