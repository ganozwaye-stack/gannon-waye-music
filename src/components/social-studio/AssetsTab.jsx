import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Loader2 } from 'lucide-react';

const TYPES = ['image', 'video', 'audio', 'thumbnail', 'other'];

export default function AssetsTab() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [assetType, setAssetType] = useState('image');
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.SocialAsset.list('-created_date', 100)
      .then((page) => setAssets(page.items || []))
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const upload = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const res = await base44.integrations.Core.UploadPublicFile({ file });
      await base44.entities.SocialAsset.create({
        name: file.name,
        asset_type: assetType,
        file_url: res.file_url,
        status: 'ready',
      });
      setMessage({ type: 'ok', text: 'Uploaded.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const remove = async (a) => {
    await base44.entities.SocialAsset.delete(a.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-display text-lg text-foreground">Asset library</h2>
        <div className="flex items-center gap-2">
          <select
            value={assetType}
            onChange={(e) => setAssetType(e.target.value)}
            className="bg-card border border-border rounded-md px-2 py-1.5 text-xs text-foreground"
          >
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <label className="gradient-gold-button inline-flex items-center gap-2 rounded-md px-4 h-9 text-sm font-medium cursor-pointer">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
            <input type="file" accept="image/*,video/*" className="hidden" onChange={upload} disabled={uploading} />
          </label>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Files are stored publicly (anyone with the link can open them). Instagram can only fetch media from a public URL, so this is what makes publishing possible.
      </p>

      {message && (
        <div className={`text-sm rounded-md px-3 py-2 border ${message.type === 'ok' ? 'border-primary/40 text-primary bg-primary/10' : 'border-destructive/40 text-destructive bg-destructive/10'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading</div>
      ) : assets.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No assets yet. Upload images or videos to use in posts.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {assets.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-card overflow-hidden group">
              <div className="h-32 bg-secondary/40">
                {a.asset_type === 'video' ? (
                  <video src={a.file_url} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={a.thumbnail_url || a.file_url} alt={a.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs text-foreground truncate" title={a.name}>{a.name}</div>
                  <div className="text-[11px] text-muted-foreground">{a.asset_type}</div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(a)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}