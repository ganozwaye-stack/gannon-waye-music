import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload, Film, Image, Music, FileText, Trash2,
  RefreshCw, Folder, Star, Download, ShieldAlert, ShieldCheck
} from 'lucide-react';

const ASSET_TYPES = [
  { value: 'video', label: 'Video', icon: Film, color: 'text-red-400' },
  { value: 'image', label: 'Image', icon: Image, color: 'text-blue-400' },
  { value: 'audio', label: 'Audio', icon: Music, color: 'text-green-400' },
  { value: 'thumbnail', label: 'Thumbnail', icon: Image, color: 'text-purple-400' },
  { value: 'b_roll', label: 'B-Roll', icon: Film, color: 'text-amber-400' },
  { value: 'story_template', label: 'Story Template', icon: FileText, color: 'text-cyan-400' },
  { value: 'other', label: 'Other', icon: Folder, color: 'text-muted-foreground' },
];

const PLATFORMS = ['tiktok', 'instagram_reels', 'instagram_stories', 'instagram_feed', 'twitter_x', 'facebook', 'youtube_shorts'];
const STATUS_COLORS = {
  raw: 'bg-secondary text-muted-foreground',
  ready: 'bg-green-500/10 text-green-400',
  used: 'bg-blue-500/10 text-blue-400',
  archived: 'bg-secondary/50 text-muted-foreground/50',
};

function isBrowserPreviewUrl(value = '') {
  return /^(https?:|data:|blob:)/i.test(String(value));
}

function assetBasename(value = '') {
  const clean = String(value || '').replace(/\\/g, '/');
  return clean.split('/').filter(Boolean).pop() || 'No file linked';
}

function AssetPreview({ asset, typeConf }) {
  const [failed, setFailed] = useState(false);
  const Icon = typeConf.icon;
  const previewSrc = asset.thumbnail_url || asset.preview_url || asset.file_url || '';
  const canPreview = isBrowserPreviewUrl(previewSrc) && !failed;
  const isVideo = ['video', 'b_roll'].includes(asset.asset_type);
  const isImage = ['image', 'thumbnail', 'story_template'].includes(asset.asset_type);
  const label = assetBasename(asset.file_url || asset.name);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/50 bg-black/40">
      {canPreview && isVideo ? (
        <video
          src={previewSrc}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          controls
          onError={() => setFailed(true)}
        />
      ) : canPreview && isImage ? (
        <img
          src={previewSrc}
          alt={asset.name || label}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/80">
            <Icon className={`h-6 w-6 ${typeConf.color}`} />
          </div>
          <p className="max-w-full truncate font-body text-xs font-semibold text-foreground">{label}</p>
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">
            {asset.file_url && !isBrowserPreviewUrl(asset.file_url) ? 'Local file' : 'Preview needed'}
          </p>
        </div>
      )}
      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 backdrop-blur-sm">
        <Icon className={`h-3 w-3 ${typeConf.color}`} />
        <span className="font-body text-[10px] uppercase tracking-wider text-foreground">{typeConf.label}</span>
      </div>
    </div>
  );
}

// CSV import parser — accepts: file_path, filename, folder, extension, size, asset_type, suggested_use, sensitive
function parseCsvManifest(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ''; });
    return {
      name: row.filename || row.file_path?.split('/').pop() || row.name || 'Unnamed',
      asset_type: row.asset_type || 'other',
      notes: [row.suggested_use, row.folder, row.extension ? `ext: ${row.extension}` : '', row.size ? `size: ${row.size}` : ''].filter(Boolean).join(' · '),
      is_sensitive: row.sensitive === 'true' || row.sensitive === '1' || row.sensitivity_flag === 'true',
      status: (row.sensitive === 'true' || row.sensitivity_flag === 'true') ? 'raw' : 'raw',
    };
  }).filter(r => r.name && r.name !== 'Unnamed');
}

function AssetCard({ asset, onUpdate, onDelete }) {
  const typeConf = ASSET_TYPES.find(t => t.value === asset.asset_type) || ASSET_TYPES[0];
  const Icon = typeConf.icon;
  const isSensitive = asset.quality_notes?.includes('SENSITIVE') || asset.notes?.toLowerCase().includes('sensitive');

  return (
    <div className={`border rounded-xl p-4 hover:border-primary/40 transition-all bg-card/60 space-y-3 ${isSensitive ? 'border-red-500/40 bg-red-500/5' : 'border-border/50'}`}>
      <AssetPreview asset={asset} typeConf={typeConf} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-secondary/60 flex items-center justify-center shrink-0">
            <Icon className={`w-4 h-4 ${typeConf.color}`} />
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-foreground truncate">{asset.name}</p>
            <p className="font-body text-[10px] text-muted-foreground">{typeConf.label}{asset.duration_seconds ? ` · ${asset.duration_seconds}s` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isSensitive && <ShieldAlert className="w-3.5 h-3.5 text-red-400" title="Sensitive — blocked by default" />}
          <Badge className={`${STATUS_COLORS[asset.status] || ''} text-[9px] tracking-wider uppercase border-0`}>{asset.status}</Badge>
        </div>
      </div>
      {isSensitive && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <p className="font-body text-[10px] text-red-300">Sensitive file — blocked from agent use until explicitly approved. Mark as "Ready" to approve.</p>
        </div>
      )}

      {asset.platform_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {asset.platform_tags.map(p => (
            <span key={p} className="font-body text-[9px] tracking-wider uppercase bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded-md">{p}</span>
          ))}
        </div>
      )}

      {asset.quality_score && (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-primary" />
          <span className="font-body text-xs text-primary">{asset.quality_score}/10</span>
          {asset.quality_notes && <span className="font-body text-xs text-muted-foreground truncate">· {asset.quality_notes}</span>}
        </div>
      )}

      {asset.notes && (
        <p className="font-body text-xs text-muted-foreground/70 line-clamp-2">{asset.notes}</p>
      )}

      <div className="flex items-center gap-2 pt-1">
        {asset.file_url && (
          <a href={asset.file_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">View File</Button>
          </a>
        )}
        <Select value={asset.status} onValueChange={v => onUpdate({ id: asset.id, data: { status: v } })}>
          <SelectTrigger className="h-7 text-xs w-28 border-border/40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="raw">Raw</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <button onClick={() => onDelete(asset.id)} className="ml-auto text-muted-foreground/40 hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function UploadForm({ onCreated }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', asset_type: 'video', notes: '', platform_tags: [], sprint_day: '' });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const fileRef = useRef();

  const togglePlatform = (p) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const handleUpload = async () => {
    if (!form.name) { toast({ title: 'Enter an asset name', variant: 'destructive' }); return; }
    const file = fileRef.current?.files?.[0];
    setUploading(true);
    try {
      let file_url = '';
      if (file) {
        const uploaded = await base44.integrations.Core.UploadFile({ file });
        file_url = uploaded.file_url;
      }
      await base44.entities.SocialAsset.create({
        ...form,
        sprint_day: form.sprint_day ? Number(form.sprint_day) : undefined,
        platform_tags: selectedPlatforms,
        file_url,
        campaign: 'thank_you_june5_sprint',
        status: 'raw',
      });
      toast({ title: 'Asset added ✓' });
      onCreated();
      setForm({ name: '', asset_type: 'video', notes: '', platform_tags: [], sprint_day: '' });
      setSelectedPlatforms([]);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e) {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><Upload className="w-4 h-4 text-primary" /> Upload / Register Asset</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Asset Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Hook_Day1_TikTok_v2" className="bg-secondary/50 border-border/40 text-sm" />
          </div>
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Type</Label>
            <Select value={form.asset_type} onValueChange={v => setForm(f => ({ ...f, asset_type: v }))}>
              <SelectTrigger className="bg-secondary/50 border-border/40"><SelectValue /></SelectTrigger>
              <SelectContent>{ASSET_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Sprint Day (optional)</Label>
            <Input type="number" min="1" max="10" value={form.sprint_day} onChange={e => setForm(f => ({ ...f, sprint_day: e.target.value }))} placeholder="1–10" className="bg-secondary/50 border-border/40 text-sm" />
          </div>
          <div>
            <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">File (optional)</Label>
            <input ref={fileRef} type="file" className="w-full font-body text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-secondary file:text-foreground cursor-pointer" />
          </div>
        </div>
        <div>
          <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Platforms</Label>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map(p => (
              <button key={p} type="button" onClick={() => togglePlatform(p)}
                className={`font-body text-[10px] tracking-wider uppercase px-2 py-1 rounded-md border transition-all ${selectedPlatforms.includes(p) ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/40'}`}>
                {p.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Notes</Label>
          <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Production notes, intended use..." className="bg-secondary/50 border-border/40 text-sm" />
        </div>
        <Button onClick={handleUpload} disabled={uploading} className="w-full gradient-gold-button border-0 gap-2">
          {uploading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Add to Library</>}
        </Button>
      </CardContent>
    </Card>
  );
}

function CsvImportPanel({ onImported }) {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCsvManifest(ev.target.result);
      setPreview(rows);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!preview?.length) return;
    setImporting(true);
    let created = 0;
    for (const row of preview) {
      await base44.entities.SocialAsset.create({
        ...row,
        campaign: 'thank_you_june5_sprint',
        platform_tags: [],
        quality_notes: row.is_sensitive ? 'SENSITIVE — blocked from agent use until approved' : '',
        status: row.is_sensitive ? 'raw' : 'raw',
      });
      created++;
    }
    toast({ title: `${created} assets imported from CSV ✓` });
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
    onImported();
    setImporting(false);
  };

  return (
    <Card className="border-secondary">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2"><Download className="w-4 h-4 text-primary" /> Import from Local Manifest CSV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-body text-xs text-muted-foreground">Accepted columns: <code className="bg-secondary/60 px-1 rounded">filename, file_path, folder, extension, size, asset_type, suggested_use, sensitive</code></p>
        <p className="font-body text-xs text-amber-400 flex items-center gap-1.5"><ShieldAlert className="w-3 h-3" /> Files with <code className="bg-secondary/60 px-1 rounded">sensitive=true</code> are blocked from agent use until manually approved.</p>
        <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange}
          className="w-full font-body text-xs text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-secondary file:text-foreground cursor-pointer" />
        {preview && (
          <div>
            <p className="font-body text-xs text-muted-foreground mb-2">{preview.length} assets parsed — {preview.filter(r => r.is_sensitive).length} sensitive</p>
            <div className="max-h-40 overflow-y-auto space-y-1 border border-border/30 rounded-lg p-2">
              {preview.slice(0, 20).map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-body">
                  {r.is_sensitive ? <ShieldAlert className="w-3 h-3 text-red-400 shrink-0" /> : <ShieldCheck className="w-3 h-3 text-green-400 shrink-0" />}
                  <span className="text-foreground truncate">{r.name}</span>
                  <span className="text-muted-foreground shrink-0">{r.asset_type}</span>
                </div>
              ))}
              {preview.length > 20 && <p className="text-xs text-muted-foreground">... and {preview.length - 20} more</p>}
            </div>
            <Button onClick={handleImport} disabled={importing} className="w-full mt-3 gradient-gold-button border-0 gap-2">
              {importing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Importing...</> : <><Upload className="w-4 h-4" /> Import {preview.length} Assets</>}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SocialAssetLibrary() {
  const qc = useQueryClient();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCsvImport, setShowCsvImport] = useState(false);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['social-assets'],
    queryFn: () => base44.entities.SocialAsset.list('-created_date', 300),
    refetchInterval: 30000,
  });

  const updateAsset = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SocialAsset.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-assets'] }),
  });

  const deleteAsset = useMutation({
    mutationFn: (id) => base44.entities.SocialAsset.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['social-assets'] }),
  });

  const filtered = assets.filter(a =>
    (filterType === 'all' || a.asset_type === filterType) &&
    (filterStatus === 'all' || a.status === filterStatus)
  );

  const ready = assets.filter(a => a.status === 'ready').length;
  const raw = assets.filter(a => a.status === 'raw').length;
  const used = assets.filter(a => a.status === 'used').length;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Social Asset Library</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Upload, tag, preview, and manage footage, thumbnails, templates, and campaign assets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Assets', value: assets.length, color: 'text-blue-400' },
          { label: 'Ready to Use', value: ready, color: 'text-green-400' },
          { label: 'Raw / Untagged', value: raw, color: 'text-amber-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4">
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <UploadForm onCreated={() => qc.invalidateQueries({ queryKey: ['social-assets'] })} />

      <div className="flex items-center gap-2">
        <button onClick={() => setShowCsvImport(v => !v)} className="font-body text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
          <Download className="w-3.5 h-3.5" /> {showCsvImport ? 'Hide' : 'Show'} CSV Import (local manifest)
        </button>
      </div>
      {showCsvImport && <CsvImportPanel onImported={() => { qc.invalidateQueries({ queryKey: ['social-assets'] }); setShowCsvImport(false); }} />}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-36 bg-secondary/50 border-border/40 text-xs"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {ASSET_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-secondary/50 border-border/40 text-xs"><SelectValue placeholder="All status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="raw">Raw</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <p className="font-body text-xs text-muted-foreground self-center">{filtered.length} assets</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
          <Folder className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No assets yet. Upload footage, thumbnails, or B-roll above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onUpdate={({ id, data }) => updateAsset.mutate({ id, data })}
              onDelete={(id) => deleteAsset.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}