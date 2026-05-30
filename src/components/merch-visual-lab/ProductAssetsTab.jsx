import React, { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle, Eye, Trash2, X } from 'lucide-react';

const STATUS_COLORS = {
  uploaded: 'bg-blue-500/20 text-blue-300',
  background_pending: 'bg-yellow-500/20 text-yellow-300',
  background_removed: 'bg-cyan-500/20 text-cyan-300',
  needs_cleanup: 'bg-orange-500/20 text-orange-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
};

const PRODUCT_TYPES = ['hoodie','shirt','mug','poster','print','bundle','album_cover','logo','signature','packaging','tote','notebook','pen','bottle','other'];

function BulkQueueItem({ item, onRemove, onUpdate }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
      <img src={item.preview} className="h-14 w-14 object-contain rounded flex-shrink-0 border border-border" alt={item.title} />
      <div className="flex-1 grid grid-cols-2 gap-2 min-w-0">
        <Input
          placeholder="Title" value={item.title}
          onChange={e => onUpdate(item.id, 'title', e.target.value)}
          className="h-7 text-xs"
        />
        <Select value={item.product_type} onValueChange={v => onUpdate(item.id, 'product_type', v)}>
          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{PRODUCT_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {item.status === 'done' && <CheckCircle className="w-4 h-4 text-green-400" />}
        {item.status === 'uploading' && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
        {item.status === 'pending' && (
          <button onClick={() => onRemove(item.id)} className="text-muted-foreground hover:text-destructive">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductAssetsTab() {
  const qc = useQueryClient();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['MerchVisualAsset'],
    queryFn: () => base44.entities.MerchVisualAsset.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MerchVisualAsset.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MerchVisualAsset.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MerchVisualAsset.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }),
  });

  const addFilesToQueue = (files) => {
    const newItems = Array.from(files).map((file, i) => {
      // Auto-detect product type from filename
      const fn = file.name.toLowerCase();
      let product_type = 'other';
      if (fn.includes('hoodie')) product_type = 'hoodie';
      else if (fn.includes('shirt') || fn.includes('tee')) product_type = 'shirt';
      else if (fn.includes('mug')) product_type = 'mug';
      else if (fn.includes('poster')) product_type = 'poster';
      else if (fn.includes('tote') || fn.includes('bag')) product_type = 'tote';
      else if (fn.includes('bundle')) product_type = 'bundle';
      else if (fn.includes('album') || fn.includes('cover')) product_type = 'album_cover';
      else if (fn.includes('logo') || fn.includes('signature')) product_type = 'logo';
      else if (fn.includes('notebook')) product_type = 'notebook';
      else if (fn.includes('pen')) product_type = 'pen';
      else if (fn.includes('bottle')) product_type = 'bottle';
      else if (fn.includes('packag') || fn.includes('box') || fn.includes('card')) product_type = 'packaging';

      const title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      return {
        id: `${Date.now()}-${i}`,
        file,
        preview: URL.createObjectURL(file),
        title,
        product_type,
        status: 'pending',
      };
    });
    setQueue(prev => [...prev, ...newItems]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) addFilesToQueue(files);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const removeFromQueue = (id) => setQueue(prev => prev.filter(i => i.id !== id));
  const updateQueueItem = (id, field, value) => setQueue(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const uploadAll = async () => {
    const pending = queue.filter(i => i.status === 'pending' && i.title);
    if (!pending.length) return;
    setBulkUploading(true);
    for (const item of pending) {
      setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i));
      const { file_url } = await base44.integrations.Core.UploadFile({ file: item.file });
      await createMutation.mutateAsync({
        title: item.title,
        product_type: item.product_type,
        original_image_url: file_url,
        background_removed_status: 'uploaded',
      });
      setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done' } : i));
    }
    setBulkUploading(false);
    setTimeout(() => setQueue(prev => prev.filter(i => i.status !== 'done')), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Product Assets</h2>
          <p className="text-sm text-muted-foreground">{assets.length} assets — {assets.filter(a => a.approved_for_public_use).length} approved for public use</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} size="sm">
          <Upload className="w-4 h-4 mr-1" /> Upload Images
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) addFilesToQueue(e.target.files); e.target.value = ''; }} />
      </div>

      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40 hover:bg-secondary/20'
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground/40'}`} />
        <p className="text-sm text-muted-foreground">Drag & drop product images here, or click to select</p>
        <p className="text-xs text-muted-foreground/50 mt-1">Supports multiple files — hoodie, mug, shirt, tote, bundle, packaging, etc.</p>
      </div>

      {/* Upload Queue */}
      {queue.length > 0 && (
        <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Upload Queue ({queue.length} files)</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={uploadAll} disabled={bulkUploading || queue.every(i => i.status !== 'pending')}>
                {bulkUploading ? 'Uploading...' : `Upload All (${queue.filter(i => i.status === 'pending').length})`}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setQueue([])}>Clear Queue</Button>
            </div>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {queue.map(item => (
              <BulkQueueItem key={item.id} item={item} onRemove={removeFromQueue} onUpdate={updateQueueItem} />
            ))}
          </div>
        </div>
      )}

      {/* Asset Grid */}
      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No assets yet. Drag & drop product images above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {assets.map(asset => (
            <div key={asset.id} className="border border-border rounded-xl overflow-hidden bg-card group">
              <div className="relative h-36 bg-secondary flex items-center justify-center">
                {(asset.transparent_png_url || asset.original_image_url) ? (
                  <img
                    src={asset.transparent_png_url || asset.original_image_url}
                    className="h-full w-full object-contain p-2"
                    alt={asset.title}
                    style={{ background: asset.transparent_png_url ? 'repeating-conic-gradient(#444 0% 25%, #333 0% 50%) 0 0 / 16px 16px' : undefined }}
                  />
                ) : (
                  <Eye className="w-8 h-8 text-muted-foreground/30" />
                )}
                {asset.transparent_png_url && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                )}
                <button
                  onClick={() => { if (window.confirm('Delete this asset?')) deleteMutation.mutate(asset.id); }}
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-black/60 rounded text-red-400 hover:text-red-300">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="p-2 space-y-1.5">
                <p className="text-xs font-medium text-foreground truncate">{asset.title}</p>
                <p className="text-[10px] text-muted-foreground">{asset.product_type}</p>
                <Badge className={`text-[10px] ${STATUS_COLORS[asset.background_removed_status] || ''}`}>
                  {asset.background_removed_status}
                </Badge>
                <div className="flex gap-1 flex-wrap pt-0.5">
                  {asset.background_removed_status === 'background_removed' && (
                    <Button size="sm" variant="outline" className="text-[10px] h-5 px-1.5"
                      onClick={() => updateMutation.mutate({ id: asset.id, data: { background_removed_status: 'approved', approved_for_public_use: true } })}>
                      ✓ Approve
                    </Button>
                  )}
                  {(asset.background_removed_status === 'uploaded' || asset.background_removed_status === 'background_pending') && (
                    <Button size="sm" variant="outline" className="text-[10px] h-5 px-1.5"
                      onClick={() => updateMutation.mutate({ id: asset.id, data: { background_removed_status: 'background_pending' } })}>
                      BG Pending
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-[10px] h-5 px-1.5"
                    onClick={() => updateMutation.mutate({ id: asset.id, data: { background_removed_status: 'needs_cleanup' } })}>
                    Cleanup
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}