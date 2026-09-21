import HotspotWorkbench from '@/components/admin/hotspot-editor/HotspotWorkbench';

// Hotspot Canvas Studio: the full Storefront Hotspot workbench
// (StorefrontHotspot entity zone editor over the locked boutique artwork) —
// mounted verbatim. Absorbs the standalone StoreHotspotEditor screen.
// Zero function loss.
export default function HotspotsTab() {
  return <HotspotWorkbench />;
}