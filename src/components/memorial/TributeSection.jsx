import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, ImagePlus, CheckCircle2, Loader2, Flame } from 'lucide-react';

// The interactive tribute wall: visitors share their own photos and stories
// of the people they carry in their hearts. Every submission is held for
// Gannon's personal review before it appears, so the wall stays respectful
// and safe. House style: no em dashes.
export default function TributeSection() {
  const [tributes, setTributes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [story, setStory] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const loadTributes = () => {
    base44.entities.FanPost.filter({ type: 'tribute', status: 'approved' }, '-created_date', 60)
      .then(setTributes)
      .catch(() => {})
      .finally(() => setLoaded(true));
  };

  useEffect(() => {
    loadTributes();
  }, []);

  const handleFile = (f) => {
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = e => setFilePreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !story) return;
    setLoading(true);
    try {
      let image_url;
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        image_url = file_url;
      }
      await base44.entities.FanPost.create({
        author_name: name,
        content: `${relationship ? `(${relationship}) ` : ''}${story}`,
        type: 'tribute',
        status: 'pending',
        ...(image_url ? { image_url } : {}),
      });
      setDone(true);
    } catch (err) {
      // surfaced by the platform error handling
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,210,160,0.06)', border: '1px solid rgba(255,210,160,0.2)' }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: 'rgba(255,210,160,0.8)' }} />
          </div>
          <p className="font-body text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(255,210,160,0.4)' }}>Thank You</p>
          <h3 className="font-display text-3xl mb-4" style={{ color: 'rgba(255,210,160,0.9)' }}>Your tribute has been received</h3>
          <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Thank you for sharing a piece of your heart.<br />
            Every tribute is personally reviewed before it joins the wall, so please allow a little time.
          </p>
          <Button
            onClick={() => { setDone(false); setName(''); setRelationship(''); setStory(''); setFile(null); setFilePreview(null); }}
            variant="outline"
            className="rounded-full font-body text-xs tracking-wider uppercase"
            style={{ borderColor: 'rgba(255,210,160,0.2)', color: 'rgba(255,210,160,0.7)' }}
          >
            Share Another Tribute
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto px-6 pb-20">
      {/* The tribute wall */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-4 h-4" style={{ color: 'rgba(255,210,160,0.5)' }} />
          <h2 className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,210,160,0.5)' }}>
            Tributes From The Heart
          </h2>
        </div>
        <p className="font-body text-xs max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Words and photos from the people walking this road too. If someone you love is in your heart today, this wall is for them as much as for Sonia.
        </p>
      </div>

      {loaded && tributes.length === 0 ? (
        <p className="font-body text-xs text-center mb-12" style={{ color: 'rgba(255,255,255,0.25)' }}>
          The first tributes are still being gathered. Yours could be the first light on the wall.
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 gap-4 mb-14 [column-fill:_balance]">
          {tributes.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.06, 0.4) }}
              className="break-inside-avoid mb-4 rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,210,160,0.03)', border: '1px solid rgba(255,210,160,0.12)' }}
            >
              {t.image_url && (
                <img
                  src={t.image_url}
                  alt={`A photo shared by ${t.author_name || 'a friend'}`}
                  loading="lazy"
                  className="w-full max-h-64 object-cover"
                  style={{ filter: 'sepia(0.18) brightness(0.96)' }}
                />
              )}
              <div className="p-5">
                <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.72)' }}>{t.content}</p>
                <div className="flex items-center gap-2">
                  <Flame className="w-3 h-3 shrink-0" style={{ color: 'rgba(255,210,160,0.45)' }} />
                  <p className="font-body text-xs" style={{ color: 'rgba(255,210,160,0.5)' }}>{t.author_name || 'A friend'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Share your own tribute */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl p-8"
        style={{ background: 'rgba(255,210,160,0.02)', border: '1px solid rgba(255,210,160,0.1)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4" style={{ color: 'rgba(255,210,160,0.6)' }} />
          <h2 className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,210,160,0.5)' }}>
            Share Your Tribute
          </h2>
        </div>
        <p className="font-body text-xs mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Leave a story, a memory, or a photo for someone you love. It can be for Sonia, or for anyone whose light you are carrying.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 space-y-4">
            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required
                className="bg-transparent font-body text-sm" style={{ borderColor: 'rgba(255,210,160,0.15)', color: 'rgba(255,255,255,0.9)' }}
                placeholder="e.g. Maria, Aunty Jo, Uncle David..." />
            </div>
            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Who Is It For?</Label>
              <Input value={relationship} onChange={e => setRelationship(e.target.value)}
                className="bg-transparent font-body text-sm" style={{ borderColor: 'rgba(255,210,160,0.15)', color: 'rgba(255,255,255,0.9)' }}
                placeholder="e.g. For Sonia, for my Dad, for a friend..." />
            </div>
          </div>

          <div>
            <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Words *</Label>
            <Textarea value={story} onChange={e => setStory(e.target.value)} required rows={5}
              className="bg-transparent font-body text-sm resize-none" style={{ borderColor: 'rgba(255,210,160,0.15)', color: 'rgba(255,255,255,0.9)' }}
              placeholder="Share a moment, a story, something they said, a lesson they taught you, or simply what they meant to you..." />
          </div>

          <div>
            <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Add a Photo (optional)</Label>
            {filePreview ? (
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,210,160,0.15)' }}>
                <img src={filePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                <button type="button" onClick={() => handleFile(null)}
                  className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-body"
                  style={{ background: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.8)' }}>
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl cursor-pointer transition-all"
                style={{ border: '2px dashed rgba(255,210,160,0.15)', background: 'rgba(255,210,160,0.02)' }}>
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
                <ImagePlus className="w-6 h-6" style={{ color: 'rgba(255,210,160,0.3)' }} />
                <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Click to add a photo to your tribute</p>
              </label>
            )}
          </div>

          <Button type="submit" disabled={loading || !name || !story}
            className="w-full rounded-full py-6 font-body text-sm tracking-wider uppercase border-0"
            style={{ background: 'linear-gradient(90deg, #c9a84c 0%, #f5d06e 50%, #c9a84c 100%)', color: '#1a1208' }}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sharing...</> : <><Heart className="w-4 h-4 mr-2" />Share Tribute</>}
          </Button>

          <p className="font-body text-[10px] text-center leading-relaxed pt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Every tribute is reviewed with care before it appears publicly. Thank you for sharing with love.
          </p>
        </form>
      </motion.div>
    </div>
  );
}