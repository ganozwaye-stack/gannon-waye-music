import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Upload } from 'lucide-react';

export default function TemplatePicker({ templates, selectedId, onSelect }) {
  const qc = useQueryClient();
  const upload = useMutation({
    mutationFn: async (file) => {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      return base44.entities.MerchMockupTemplate.create({
        title: file.name.replace(/\.[^.]+$/, ''), product_type: 'other', blank_image_url: file_url,
      });
    },
    onSuccess: (t) => { qc.invalidateQueries({ queryKey: ['MerchMockupTemplate'] }); onSelect(t); },
  });

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">1. Pick a blank template</p>
      <div className="grid grid-cols-3 gap-2">
        {templates.map((t) => (
          <button key={t.id} type="button" onClick={() => onSelect(t)}
            className={`rounded-lg border p-1.5 text-left transition-all ${selectedId === t.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
            <img src={t.blank_image_url} alt={t.title} className="aspect-square w-full object-cover rounded" />
            <p className="text-[10px] text-muted-foreground truncate mt-1">{t.title}</p>
          </button>
        ))}
        <label className="rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-1 aspect-square cursor-pointer hover:border-primary/40 text-muted-foreground">
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files[0] && upload.mutate(e.target.files[0])} />
          <Upload className="w-4 h-4" />
          <span className="text-[10px]">{upload.isPending ? 'Uploading' : 'Add blank'}</span>
        </label>
      </div>
    </div>
  );
}