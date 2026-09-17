import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Upload } from 'lucide-react';

const CHECKER = 'repeating-conic-gradient(#333 0% 25%, #2a2a2a 0% 50%) 0 0 / 8px 8px';
export const designUrl = (a) => a.transparent_png_url || a.original_image_url;

export default function DesignPicker({ assets, selectedId, onSelect }) {
  const qc = useQueryClient();
  const upload = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      return base44.entities.MerchVisualAsset.create({
        title: file.name.replace(/\.[^.]+$/, ''), product_type: 'other', original_image_url: file_url,
        transparent_png_url: file.type === 'image/png' ? file_url : null,
        background_removed_status: file.type === 'image/png' ? 'background_removed' : 'uploaded',
        source: 'Product Mockups upload',
      });
    },
    onSuccess: (a) => { qc.invalidateQueries({ queryKey: ['MerchVisualAsset'] }); onSelect(a); },
  });

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">2. Pick a design (transparent PNG looks best)</p>
      <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
        {assets.filter(designUrl).map((a) => (
          <button key={a.id} type="button" onClick={() => onSelect(a)} title={a.title}
            className={`rounded-lg border p-1.5 transition-all ${selectedId === a.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
            <img src={designUrl(a)} alt={a.title} className="aspect-square w-full object-contain rounded" style={{ background: CHECKER }} />
            <p className="text-[9px] text-muted-foreground truncate mt-1">{a.title}</p>
          </button>
        ))}
        <label className="rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-1 aspect-square cursor-pointer hover:border-primary/40 text-muted-foreground">
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files[0] && upload.mutate(e.target.files[0])} />
          <Upload className="w-4 h-4" />
          <span className="text-[9px]">{upload.isPending ? 'Uploading' : 'Add PNG'}</span>
        </label>
      </div>
    </div>
  );
}