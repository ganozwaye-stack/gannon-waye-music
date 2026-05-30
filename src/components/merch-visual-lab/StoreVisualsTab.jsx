import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';

export default function StoreVisualsTab() {
  const { data: compositions = [] } = useQuery({
    queryKey: ['MerchVisualComposition'],
    queryFn: () => base44.entities.MerchVisualComposition.list('-created_date', 50),
  });

  const approved = compositions.filter(c => c.approval_status === 'approved' || c.approval_status === 'published');
  const storeReady = approved.filter(c => ['store_banner_wide', 'homepage_merch_block', 'product_carousel'].includes(c.layout_type));
  const socialReady = approved.filter(c => ['reel_9_16', 'instagram_square', 'tiktok_end_card'].includes(c.layout_type));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Store Visuals</h2>
        <p className="text-sm text-muted-foreground">Approved compositions ready for the public store and homepage. Only approved assets appear publicly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{approved.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Approved Compositions</p>
        </div>
        <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">{storeReady.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Store / Homepage Ready</p>
        </div>
        <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{socialReady.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Social Ready</p>
        </div>
      </div>

      <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
        <h3 className="text-sm font-medium text-yellow-300 mb-1">⚠ Safety Rule</h3>
        <p className="text-xs text-muted-foreground">
          Only compositions with <strong className="text-foreground">approval_status = approved or published</strong> are eligible for public display.
          Draft and awaiting_approval compositions never appear on the public store or homepage.
          The checkout, cart, and Stripe systems are not affected by this module.
        </p>
      </div>

      {storeReady.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Store & Homepage Compositions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeReady.map(c => (
              <div key={c.id} className="border border-border rounded-xl p-4 bg-card">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm text-foreground">{c.title}</p>
                  <Badge className="bg-green-500/20 text-green-300 text-[10px]">{c.approval_status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.layout_type} · {c.canvas_size}</p>
                {c.export_url && (
                  <a href={c.export_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary mt-2 block hover:underline">
                    View Export →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground/50">
          <p className="text-sm">No approved store visuals yet.</p>
          <p className="text-xs mt-1">Build compositions in the Composition Builder tab, then send to Approval Queue.</p>
        </div>
      )}
    </div>
  );
}