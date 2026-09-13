import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { makeElement } from '@/lib/heroElements';

// The owner's image library for the hero. Any file uploaded from the
// computer is stored permanently and saved to the database, so nothing is
// ever limited to one background and one heart.
export default function UploadsPanel({ onAdd, onSetBackground }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const { data: assets = [] } = useQuery({
    queryKey: ['heroDesignAssets'],
    queryFn: () => base44.entities.HeroDesignAsset.list('-created_date', 100),
    initialData: [],
  });

  const upload = async (file) => {
    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadPublicFile({ file });
      const dims = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ w: img.naturalWidth || 1, h: img.naturalHeight || 1 });
        img.onerror = () => resolve({ w: 1, h: 1 });
        img.src = res.file_url;
      });
      await base44.entities.HeroDesignAsset.create({
        title: file.name,
        file_url: res.file_url,
        kind: 'other',
        natural_width: dims.w,
        natural_height: dims.h,
      });
      qc.invalidateQueries({ queryKey: ['heroDesignAssets'] });
      toast({ title: 'Uploaded and saved to your image library.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = '';
        }}
      />
      <Button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full gradient-gold-button border-0 rounded-full"
      >
        {uploading ? 'Uploading...' : 'Upload image from computer'}
      </Button>
      {assets.length === 0 && (
        <p className="font-body text-xs text-muted-foreground">
          No images yet. Upload anything: backgrounds, hearts, textures, as many as you want.
        </p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {assets.map((a) => (
          <div key={a.id} className="rounded-lg border border-border overflow-hidden bg-card">
            <img src={a.file_url} alt={a.title} className="w-full h-20 object-cover" />
            <div className="p-1.5 space-y-1">
              <p className="font-body text-[10px] text-muted-foreground truncate">{a.title}</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onAdd(makeElement('image', {
                    image_url: a.file_url,
                    aspect: (a.natural_width || 1) / (a.natural_height || 1),
                    width_pct: 30,
                  }))}
                  className="flex-1 font-body text-[10px] py-1 rounded bg-primary/15 text-primary hover:bg-primary/25"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => onSetBackground(a.file_url)}
                  className="flex-1 font-body text-[10px] py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/70"
                >
                  Backdrop
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}