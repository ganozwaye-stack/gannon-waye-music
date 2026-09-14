import HotspotWorkbench from '@/components/admin/hotspot-editor/HotspotWorkbench';
import { Lock } from 'lucide-react';

// Store Hotspot Editor, rebuilt as a single-screen canvas studio. The boutique
// photo stays permanently locked; this page only places clickable zones on
// top of it, with all editing done beside the picture, no page scrolling.
export default function StoreHotspotEditor() {
  return (
    <div className="pb-6">
      <div className="mb-4">
        <h1 className="font-display text-3xl text-foreground mb-1">Store Hotspot Editor</h1>
        <p className="font-body text-sm text-muted-foreground max-w-2xl">
          Place clickable zones over the boutique photo so a fan can tap something they see in the picture and land
          straight on that product, or register interest in a pre-design item.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-primary/40 text-primary bg-primary/5 font-body">
          <Lock className="w-3.5 h-3.5" /> The photo itself is permanently locked — this page only places zones on top of it.
        </div>
      </div>
      <HotspotWorkbench />
    </div>
  );
}