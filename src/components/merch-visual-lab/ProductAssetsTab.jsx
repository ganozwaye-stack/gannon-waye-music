import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle, AlertCircle, Clock, Eye } from 'lucide-react';

const STATUS_COLORS = {
  uploaded: 'bg-blue-500/20 text-blue-300',
  background_pending: 'bg-yellow-500/20 text-yellow-300',
  background_removed: 'bg-cyan-500/20 text-cyan-300',
  needs_cleanup: 'bg-orange-500/20 text-orange-300',
  approved: 'bg-green-500/20 text-green-300',
  rejected: 'bg-red-500/20 text-red-300',
};

export default function ProductAssetsTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', product_type: 'hoodie', source: '', notes: '' });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['MerchVisualAsset'],
    queryFn: () => base44.entities.MerchVisualAsset.list('-created_date', 50),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => base44.entities.MerchVisualAsset.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }); setShowForm(false); setForm({ title: '', product_type: 'hoodie', source: '', notes: '' }); setImageFile(null); setPreview(null); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MerchVisualAsset.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }),
  });

  const handleImageSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    setUploading(true);
    let original_image_url = '';
    if (imageFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
      original_image_url = file_url;
    }
    await createMutation.mutateAsync({ ...form, original_image_url, background_removed_status: 'uploaded' });
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Product Assets</h2>
          <p className="text-sm text-muted-foreground">{assets.length} assets — {assets.filter(a => a.approved_for_public_use).length} approved</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Upload className="w-4 h-4 mr-1" /> Upload Product Image
        </Button>
      </div>

      {showForm && (
        <div className="border border-border rounded-xl p-5 space-y-4 bg-card">
          <h3 className="font-medium text-foreground">New Product Asset</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Title e.g. Respect Hoodie Dark Grey" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Select value={form.product_type} onValueChange={v => setForm({ ...form, product_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['hoodie','shirt','mug','poster','print','bundle','album_cover','logo','signature','other'].map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Source (e.g. Printify, Photoshoot)" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
            <Input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Original Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageSelect} className="text-sm text-muted-foreground" />
            {preview && <img src={preview} className="mt-2 h-32 object-contain rounded border border-border" alt="preview" />}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={!form.title || uploading}>{uploading ? 'Uploading...' : 'Save Asset'}</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading...</p>
      ) : assets.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No assets yet. Upload your first product image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map(asset => (
            <div key={asset.id} className="border border-border rounded-xl overflow-hidden bg-card group">
              <div className="relative h-40 bg-secondary flex items-center justify-center">
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
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs font-medium text-foreground truncate">{asset.title}</p>
                <Badge className={`text-[10px] ${STATUS_COLORS[asset.background_removed_status] || ''}`}>
                  {asset.background_removed_status}
                </Badge>
                <div className="flex gap-1 flex-wrap">
                  {asset.background_removed_status === 'background_removed' && (
                    <Button size="sm" variant="outline" className="text-[10px] h-6 px-2"
                      onClick={() => updateMutation.mutate({ id: asset.id, data: { background_removed_status: 'approved', approved_for_public_use: true } })}>
                      ✓ Approve
                    </Button>
                  )}
                  {asset.background_removed_status === 'uploaded' && (
                    <Button size="sm" variant="outline" className="text-[10px] h-6 px-2"
                      onClick={() => updateMutation.mutate({ id: asset.id, data: { background_removed_status: 'background_pending' } })}>
                      Mark Pending
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-[10px] h-6 px-2"
                    onClick={() => updateMutation.mutate({ id: asset.id, data: { background_removed_status: 'needs_cleanup' } })}>
                    Needs Cleanup
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