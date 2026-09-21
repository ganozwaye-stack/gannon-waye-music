import ProductionTracker from '@/components/admin/dashboard-family/ProductionTracker';
import MusicRoadmap from '@/components/admin/dashboard-family/MusicRoadmap';
import ProcurementCommand from '@/components/admin/dashboard-family/ProcurementCommand';

// Production & Supply Chain: the full Production Tracker (ContentProductionJob,
// MusicProductionProject, Release and AdminNotification entities), the Music
// Roadmap, and the Procurement Command (InventoryBatch, LandedCostCalculation
// and PurchaseOrder entities, Alibaba supplier portal links) — merged
// verbatim. Zero function loss.
export default function ProductionSupplyTab() {
  return (
    <div className="space-y-10">
      <ProductionTracker />
      <div className="border-t border-border/40 pt-8">
        <MusicRoadmap />
      </div>
      <div className="border-t border-border/40 pt-8">
        <ProcurementCommand />
      </div>
    </div>
  );
}