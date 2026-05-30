import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CompositionCanvas from './CompositionCanvas';

const LAYOUTS = [
  { value: 'reel_9_16', label: 'Reel 9:16 Hero Stack', w: 1080, h: 1920 },
  { value: 'instagram_square', label: 'Instagram Square 1:1', w: 1080, h: 1080 },
  { value: 'store_banner_wide', label: 'Store Banner Wide', w: 1920, h: 1080 },
  { value: 'homepage_merch_block', label: 'Homepage Merch Block', w: 1200, h: 628 },
  { value: 'product_carousel', label: 'Product Carousel Card', w: 1080, h: 1080 },
  { value: 'email_header', label: 'Email Campaign Header', w: 1200, h: 628 },
  { value: 'metricool_post', label: 'Metricool Post Asset', w: 1080, h: 1080 },
  { value: 'tiktok_end_card', label: 'TikTok/Reels End Card', w: 1080, h: 1920 },
];

const BG_STYLES = [
  { value: 'deep_black', label: 'Deep Black', css: 'linear-gradient(145deg,#0a0a0a,#161616)' },
  { value: 'warm_gold_gradient', label: 'Warm Gold Gradient', css: 'linear-gradient(145deg,#0f0b00,#2a1f00,#1a1200)' },
  { value: 'burgundy_smoke', label: 'Burgundy Smoke', css: 'linear-gradient(145deg,#0a0004,#1e0008,#120004)' },
  { value: 'dark_garden', label: 'Dark Garden', css: 'linear-gradient(145deg,#020a02,#0a1a0a,#050d05)' },
  { value: 'black_gold_fog', label: 'Black + Gold Fog', css: 'radial-gradient(ellipse at 50% 30%,#2a1f00 0%,#0a0a0a 60%)' },
];

export default function CompositionBuilderTab() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    layout_type: 'reel_9_16',
    background_style: 'deep_black',
    text_overlay: 'Respect is earned.',
    cta: 'Shop gannonwaye.com/store',
    linked_campaign: 'thank_you_merch_release',
    notes: '',
  });
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [saved, setSaved] = useState(false);

  const { data: assets = [] } = useQuery({
    queryKey: ['MerchVisualAsset'],
    queryFn: () => base44.entities.MerchVisualAsset.list('-created_date', 100),
  });

  const approvedAssets = assets.filter(a => a.transparent_png_url || a.background_removed_status === 'approved');

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.MerchVisualComposition.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['MerchVisualComposition'] }); setSaved(true); },
  });

  const layout = LAYOUTS.find(l => l.value === form.layout_type);
  const bgStyle = BG_STYLES.find(b => b.value === form.background_style);

  const toggleAsset = (id) => setSelectedAssets(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const handleSave = () => {
    saveMutation.mutate({
      ...form,
      selected_assets: selectedAssets,
      canvas_size: layout ? `${layout.w}x${layout.h}` : '1080x1920',
      approval_status: 'draft',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Composition Builder</h2>
        <p className="text-sm text-muted-foreground">Select approved transparent assets and build a layered product scene.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          <Input placeholder="Composition title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Layout Type</label>
            <Select value={form.layout_type} onValueChange={v => setForm({ ...form, layout_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LAYOUTS.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background Style</label>
            <Select value={form.background_style} onValueChange={v => setForm({ ...form, background_style: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{BG_STYLES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <Input placeholder="Text overlay" value={form.text_overlay} onChange={e => setForm({ ...form, text_overlay: e.target.value })} />
          <Input placeholder="CTA" value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })} />
          <Input placeholder="Campaign" value={form.linked_campaign} onChange={e => setForm({ ...form, linked_campaign: e.target.value })} />

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Select Assets ({selectedAssets.length} selected)</label>
            {approvedAssets.length === 0 ? (
              <p className="text-xs text-muted-foreground/50">No approved transparent assets yet. Upload PNGs first.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {approvedAssets.map(a => (
                  <button key={a.id} onClick={() => toggleAsset(a.id)}
                    className={`border rounded-lg p-2 text-center transition-all ${selectedAssets.includes(a.id) ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}>
                    {(a.transparent_png_url || a.original_image_url) && (
                      <img src={a.transparent_png_url || a.original_image_url} className="h-12 w-full object-contain mb-1"
                        style={a.transparent_png_url ? { background: 'repeating-conic-gradient(#333 0% 25%, #2a2a2a 0% 50%) 0 0 / 8px 8px' } : {}}
                        alt={a.title} />
                    )}
                    <p className="text-[9px] text-muted-foreground truncate">{a.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!form.title}>Save to Draft</Button>
            <Button variant="outline" onClick={() => saveMutation.mutate({ ...form, selected_assets: selectedAssets, canvas_size: layout ? `${layout.w}x${layout.h}` : '1080x1920', approval_status: 'awaiting_approval' })}>
              Send to Approval Queue
            </Button>
          </div>
          {saved && <p className="text-sm text-green-400">✓ Composition saved as draft.</p>}
        </div>

        {/* Canvas Preview */}
        <CompositionCanvas
          layout={layout}
          bgStyle={bgStyle}
          assets={assets.filter(a => selectedAssets.includes(a.id))}
          textOverlay={form.text_overlay}
          cta={form.cta}
        />
      </div>
    </div>
  );
}