import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Download, Send } from 'lucide-react';

export default function ExportCentreTab() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(null);
  const [done, setDone] = useState(null);

  const { data: compositions = [] } = useQuery({
    queryKey: ['MerchVisualComposition'],
    queryFn: () => base44.entities.MerchVisualComposition.list('-created_date', 100),
  });

  const approved = compositions.filter(c => c.approval_status === 'approved' || c.approval_status === 'published');

  const createContentPost = async (comp) => {
    setCreating(comp.id);
    try {
      await base44.entities.ContentPost.create({
        platform: 'instagram',
        status: 'awaiting_approval',
        caption: comp.text_overlay || 'Respect is earned. Not a game you make me play.',
        cta: comp.cta || 'Shop gannonwaye.com/store',
        hashtags: '#GannonWaye #RespectIsEarned #ThankYouMerch #MusicMerch #SurvivorStrong #1800RESPECT',
        visual_url: comp.export_url || '',
        campaign: comp.linked_campaign || 'thank_you_merch_release',
        generated_by_agent: 'MerchVisualLab',
        source_chain: `MerchVisualComposition → ContentPost | comp_id:${comp.id}`,
      });
      setDone(comp.id);
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Export Centre</h2>
        <p className="text-sm text-muted-foreground">Export approved compositions and create ContentPost drafts for social platforms.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Platform Export Formats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'Instagram Feed', size: '1080×1080', format: 'PNG/JPG' },
            { label: 'Instagram Reels', size: '1080×1920', format: 'MP4/PNG' },
            { label: 'TikTok', size: '1080×1920', format: 'MP4/PNG' },
            { label: 'Facebook', size: '1200×628', format: 'PNG/JPG' },
            { label: 'Store Banner', size: '1920×1080', format: 'PNG/JPG' },
            { label: 'Email Header', size: '1200×628', format: 'PNG/JPG' },
            { label: 'Metricool Post', size: '1080×1080', format: 'PNG/JPG' },
            { label: 'Print Ready', size: '3000×3000', format: 'PNG 300dpi' },
          ].map(f => (
            <div key={f.label} className="border border-border rounded-lg p-3 text-center">
              <p className="text-xs font-medium text-foreground">{f.label}</p>
              <p className="text-[10px] text-muted-foreground">{f.size}</p>
              <p className="text-[10px] text-primary/60">{f.format}</p>
            </div>
          ))}
        </div>
      </div>

      {approved.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground/50">
          <p className="text-sm">No approved compositions yet.</p>
          <p className="text-xs mt-1">Approve compositions in the Approval Queue tab first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Approved — Ready to Export</h3>
          {approved.map(c => (
            <div key={c.id} className="border border-border rounded-xl p-4 bg-card flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-sm text-foreground">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.layout_type} · {c.canvas_size}</p>
                {done === c.id && <p className="text-xs text-green-400 mt-1">✓ ContentPost draft created — awaiting approval</p>}
              </div>
              <div className="flex gap-2">
                {c.export_url ? (
                  <a href={c.export_url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground/50">No export URL yet</span>
                )}
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => createContentPost(c)}
                  disabled={creating === c.id}>
                  <Send className="w-3 h-3 mr-1" />
                  {creating === c.id ? 'Creating...' : 'Create ContentPost Draft'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-2">Metricool Auto-Post Status</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <p className="text-xs text-muted-foreground">Auto-post is <strong className="text-red-400">BLOCKED</strong> — all Metricool scheduling requires Gannon manual approval.</p>
        </div>
      </div>
    </div>
  );
}