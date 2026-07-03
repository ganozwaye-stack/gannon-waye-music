import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Heart, ImagePlus, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const MUM_PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dc8919b4b_IMG_5624.png';
const COVER_IMG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';

export default function RememberMum() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [memory, setMemory] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [approvedMemories, setApprovedMemories] = useState([]);

  useEffect(() => {
    base44.entities.FanPost.filter({ status: 'approved' }, '-created_date', 20)
      .then(setApprovedMemories)
      .catch(() => {});
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
    if (!name || !memory) return;
    setLoading(true);
    try {
      if (file) {
        // Photo memory → FanMedia (not featured until Gannon approves)
        const { file_url } = await base44.integrations.Core.UploadFile({ file: file });
        await base44.entities.FanMedia.create({
          name,
          caption: relationship,
          description: memory,
          file_url,
          file_type: file.type.startsWith('video') ? 'video' : 'photo',
          consent_feature: true,
          is_featured: false,
        });
      } else {
        // Text-only memory → FanPost (pending until Gannon approves)
        await base44.entities.FanPost.create({
          author_name: name,
          content: `${relationship ? `(${relationship}) ` : ''}${memory}`,
          type: 'message',
          status: 'pending',
        });
      }
      setDone(true);
    } catch (err) {
      // error bubbles up
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#080706' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,210,160,0.06)', border: '1px solid rgba(255,210,160,0.2)' }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: 'rgba(255,210,160,0.8)' }} />
          </div>
          <p className="font-body text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(255,210,160,0.4)' }}>Thank You</p>
          <h1 className="font-display text-3xl mb-4" style={{ color: 'rgba(255,210,160,0.9)' }}>Your memory has been received</h1>
          <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Thank you for sharing a piece of your heart.<br />
            Gannon will personally review each memory before it appears here, so please allow a little time.
          </p>
          <Button onClick={() => { setDone(false); setName(''); setRelationship(''); setMemory(''); setFile(null); setFilePreview(null); }}
            variant="outline" className="rounded-full font-body text-xs tracking-wider uppercase"
            style={{ borderColor: 'rgba(255,210,160,0.2)', color: 'rgba(255,210,160,0.7)' }}>
            Share Another Memory
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#080706' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255,210,140,0.04) 0%, transparent 60%)'
      }} />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={COVER_IMG} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, #080706 100%)' }} />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 pt-24 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2" style={{ borderColor: 'rgba(255,210,160,0.2)' }}>
              <img src={MUM_PORTRAIT} alt="Sonia" className="w-full h-full object-cover" />
            </div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(255,210,160,0.4)' }}>
              In Loving Memory
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-4" style={{ color: 'rgba(255,210,160,0.9)' }}>
              Remembering Sonia
            </h1>
            <p className="font-body text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              This is a space for family and friends to share their memories, stories, and photos of Sonia.
              Every memory matters. Every story is a thread in the tapestry of her life.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Memory Form */}
      <div className="relative max-w-xl mx-auto px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-8" style={{ background: 'rgba(255,210,160,0.02)', border: '1px solid rgba(255,210,160,0.1)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="w-4 h-4" style={{ color: 'rgba(255,210,160,0.6)' }} />
            <h2 className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,210,160,0.5)' }}>
              Share Your Memory
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Name *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required
                className="bg-transparent font-body text-sm" style={{ borderColor: 'rgba(255,210,160,0.15)', color: 'rgba(255,255,255,0.9)' }}
                placeholder="e.g. Maria, Aunty Jo, Uncle David..." />
            </div>

            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Relationship to Sonia</Label>
              <Input value={relationship} onChange={e => setRelationship(e.target.value)}
                className="bg-transparent font-body text-sm" style={{ borderColor: 'rgba(255,210,160,0.15)', color: 'rgba(255,255,255,0.9)' }}
                placeholder="e.g. Friend, Neighbour, Cousin, Colleague..." />
            </div>

            <div>
              <Label className="font-body text-xs mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Your Memory or Story *</Label>
              <Textarea value={memory} onChange={e => setMemory(e.target.value)} required rows={5}
                className="bg-transparent font-body text-sm resize-none" style={{ borderColor: 'rgba(255,210,160,0.15)', color: 'rgba(255,255,255,0.9)' }}
                placeholder="Share a moment, a story, something she said, a lesson she taught you, or simply what she meant to you..." />
            </div>

            {/* Photo upload */}
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
                  <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Click to upload a photo of you with Sonia</p>
                </label>
              )}
            </div>

            <Button type="submit" disabled={loading || !name || !memory}
              className="w-full rounded-full py-6 font-body text-sm tracking-wider uppercase border-0"
              style={{ background: 'linear-gradient(90deg, #c9a84c 0%, #f5d06e 50%, #c9a84c 100%)', color: '#1a1208' }}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sharing...</> : <><Heart className="w-4 h-4 mr-2" />Share Memory</>}
            </Button>

            <p className="font-body text-[10px] text-center leading-relaxed pt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Your memory will be reviewed by Gannon before it appears publicly. Thank you for sharing with love.
            </p>
          </form>
        </motion.div>

        {/* Approved memories wall */}
        {approvedMemories.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6 justify-center">
              <Heart className="w-4 h-4" style={{ color: 'rgba(255,210,160,0.4)' }} />
              <h2 className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,210,160,0.4)' }}>
                Shared Memories
              </h2>
            </div>
            <div className="space-y-4">
              {approvedMemories.map((m, i) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="rounded-xl p-5" style={{ background: 'rgba(255,210,160,0.02)', border: '1px solid rgba(255,210,160,0.08)' }}>
                  <p className="font-body text-sm leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{m.content}</p>
                  <p className="font-body text-xs" style={{ color: 'rgba(255,210,160,0.4)' }}>— {m.author_name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/" className="inline-flex items-center gap-1.5 font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <ChevronLeft className="w-3 h-3" /> Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}