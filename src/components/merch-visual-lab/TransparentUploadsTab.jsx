import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TransparentUploadsTab() {
  const qc = useQueryClient();
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [pngFile, setPngFile] = useState(null);
  const [pngPreview, setPngPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const { data: assets = [] } = useQuery({
    queryKey: ['MerchVisualAsset'],
    queryFn: () => base44.entities.MerchVisualAsset.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MerchVisualAsset.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }); setDone(true); },
  });

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPngFile(f);
    setPngPreview(URL.createObjectURL(f));
    setDone(false);
  };

  const handleUpload = async () => {
    if (!pngFile || !selectedAssetId) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: pngFile });
    await updateMutation.mutateAsync({
      id: selectedAssetId,
      data: { transparent_png_url: file_url, background_removed_status: 'background_removed', edge_cleanup_status: 'not_started' }
    });
    setUploading(false);
  };

  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Upload Transparent PNG</h2>
        <p className="text-sm text-muted-foreground">After removing the background externally, upload the transparent PNG here to link it to a product asset.</p>
      </div>

      <div className="border border-border rounded-xl p-5 bg-card space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Link to Product Asset</label>
          <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
            <SelectTrigger><SelectValue placeholder="Select a product asset..." /></SelectTrigger>
            <SelectContent>
              {assets.map(a => (
                <SelectItem key={a.id} value={a.id}>{a.title} ({a.product_type})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAsset && (
          <div className="flex gap-4 p-3 rounded-lg bg-secondary/40">
            {selectedAsset.original_image_url && (
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Original</p>
                <img src={selectedAsset.original_image_url} className="h-24 object-contain rounded" alt="original" />
              </div>
            )}
            {selectedAsset.transparent_png_url && (
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Current Transparent</p>
                <img src={selectedAsset.transparent_png_url} className="h-24 object-contain rounded"
                  style={{ background: 'repeating-conic-gradient(#444 0% 25%, #333 0% 50%) 0 0 / 16px 16px' }}
                  alt="transparent" />
              </div>
            )}
          </div>
        )}

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Transparent PNG File</label>
          <input type="file" accept="image/png" onChange={handleFileSelect} className="text-sm text-muted-foreground" />
          {pngPreview && (
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-1">Preview (checkerboard = transparent)</p>
              <img src={pngPreview} className="h-40 object-contain rounded border border-border"
                style={{ background: 'repeating-conic-gradient(#444 0% 25%, #333 0% 50%) 0 0 / 16px 16px' }}
                alt="png preview" />
            </div>
          )}
        </div>

        <Button onClick={handleUpload} disabled={!pngFile || !selectedAssetId || uploading}>
          {uploading ? 'Uploading...' : 'Upload Transparent PNG'}
        </Button>

        {done && <p className="text-sm text-green-400">✓ Transparent PNG uploaded and linked. Status set to background_removed.</p>}
      </div>

      <div className="rounded-xl border border-border p-4 bg-card">
        <h3 className="text-sm font-medium text-foreground mb-2">Assets awaiting PNG</h3>
        <div className="space-y-2">
          {assets.filter(a => !a.transparent_png_url).map(a => (
            <div key={a.id} className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{a.title}</span>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">{a.background_removed_status}</span>
            </div>
          ))}
          {assets.filter(a => !a.transparent_png_url).length === 0 && (
            <p className="text-xs text-muted-foreground/50">All assets have transparent PNGs ✓</p>
          )}
        </div>
      </div>
    </div>
  );
}