import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Image, Upload, CheckCircle2, AlertTriangle, RefreshCw, Lock, X } from 'lucide-react';

const ASSET_STATUS_META = {
  raw: { label: 'Raw', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ready: { label: 'Ready', color: 'text-green-400', bg: 'bg-green-500/10' },
  used: { label: 'Used', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  archived: { label: 'Archived', color: 'text-muted-foreground', bg: 'bg-secondary' },
};

function NormalizeModal({ asset, onClose }) {
  const { toast } = useToast();
  const [url, setUrl] = useState(asset?.file_url || '');
  const [mediaType, setMediaType] = useState(asset?.asset_type === 'video' ? 'video' : 'image');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const qc = useQueryClient();

  const run = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('metricoolNormalizeMedia', {
        asset_id: asset?.id,
        public_url: url,
        media_type: mediaType,
      });
      setResult(res.data);
      qc.invalidateQueries({ queryKey: ['mc-assets'] });
      toast({ title: res.data?.success ? `Normalized — mediaId: ${res.data.media_id}` : res.data?.error });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ success: false, error: msg });
      toast({ title: `Failed: ${msg}`, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-md w-full my-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <p className="font-body text-xs text-muted-foreground">Media Pipeline</p>
            <h3 className="font-display text-lg text-foreground">{asset?.name || 'Normalize Media'}</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Public Media URL</Label>
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="bg-secondary/50 border-border/40 text-sm" />
            <p className="font-body text-[10px] text-muted-foreground mt-1">Must be a publicly accessible URL. Metricool will fetch and normalize it.</p>
          </div>
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Media Type</Label>
            <div className="flex gap-2">
              {['image', 'video'].map(t => (
                <button key={t} onClick={() => setMediaType(t)}
                  className={`font-body text-xs px-3 py-1.5 rounded-lg border transition-all ${mediaType === t ? 'bg-primary/10 border-primary text-primary' : 'border-border/50 text-muted-foreground'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className={`rounded-lg border p-3 ${result.success ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
              {result.success ? (
                <>
                  <p className="font-body text-sm text-green-400 font-semibold">✓ Normalized</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">Metricool mediaId: <code className="text-primary font-mono">{result.media_id}</code></p>
                </>
              ) : (
                <p className="font-body text-sm text-red-400">{result.error}</p>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={run} disabled={loading || !url} className="flex-1 gradient-gold-button border-0 gap-2">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Normalizing...</> : <><Upload className="w-4 h-4" /> Normalize & Upload</>}
            </Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MetricoolMediaPipeline() {
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['mc-assets'],
    queryFn: () => base44.entities.SocialAsset.filter({ campaign: 'thank_you_june5_sprint' }, '-created_date', 100),
    refetchInterval: 30000,
  });

  const filtered = filterStatus === 'all' ? assets : assets.filter(a => a.status === filterStatus);

  const counts = {
    all: assets.length,
    raw: assets.filter(a => a.status === 'raw').length,
    ready: assets.filter(a => a.status === 'ready').length,
    used: assets.filter(a => a.status === 'used').length,
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Metricool Integration</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Media Pipeline</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Normalize approved assets → Metricool mediaId · Sensitive assets blocked by default</p>
      </div>

      {/* Safety notice */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-body text-sm text-amber-400 font-semibold">Sensitive assets blocked by default</p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            Only assets marked <strong>ready</strong> can be normalized. Raw/unverified assets are blocked. 
            Go to <strong>Social Asset Library</strong> to verify and approve assets first.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(counts).map(([key, val]) => (
          <Card key={key} className={`cursor-pointer transition-all ${filterStatus === key ? 'border-primary/60' : ''}`} onClick={() => setFilterStatus(key)}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold font-display text-foreground">{val}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{key === 'all' ? 'All Assets' : key}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Source chain */}
      <div className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground flex-wrap">
        {['SocialAsset', '→', 'ContentCalendarPost', '→', 'QualityReview', '→', 'ApprovalQueue', '→', 'MetricoolSchedulerQueue', '→', 'Metricool', '→', 'ContentPerformance'].map((s, i) => (
          <span key={i} className={s === '→' ? 'text-border' : 'text-muted-foreground/70'}>{s}</span>
        ))}
      </div>

      {/* Asset list */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body text-sm">Loading assets...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <Image className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No assets found. Upload in Social Asset Library first.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(asset => {
            const sm = ASSET_STATUS_META[asset.status] || ASSET_STATUS_META.raw;
            const hasMediaId = asset.notes?.includes('metricool_media_id:');
            const mediaId = hasMediaId ? asset.notes.match(/metricool_media_id:([^\s]+)/)?.[1] : null;

            return (
              <button
                key={asset.id}
                onClick={() => asset.status !== 'raw' ? setSelected(asset) : null}
                className={`w-full text-left flex items-start gap-3 p-4 border rounded-xl transition-all ${asset.status === 'raw' ? 'border-border/30 opacity-60 cursor-not-allowed' : 'border-border/50 hover:border-primary/40 hover:bg-secondary/20 cursor-pointer'}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-body text-sm font-semibold text-foreground">{asset.name}</span>
                    <Badge className={`${sm.bg} ${sm.color} border-0 text-[9px] uppercase tracking-wider`}>{sm.label}</Badge>
                    {asset.status === 'raw' && (
                      <Badge className="bg-red-500/10 text-red-400 border-0 text-[9px] uppercase tracking-wider">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Blocked
                      </Badge>
                    )}
                    {mediaId && (
                      <Badge className="bg-primary/10 text-primary border-0 text-[9px]">mediaId: {mediaId.slice(0, 8)}…</Badge>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{asset.asset_type} · {asset.platform_tags?.join(', ') || 'all platforms'}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {asset.status !== 'raw' && !mediaId && (
                    <span className="font-body text-[10px] text-primary">Normalize →</span>
                  )}
                  {mediaId && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {asset.status === 'raw' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && <NormalizeModal asset={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}