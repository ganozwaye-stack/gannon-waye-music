import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, CheckCircle2, Upload } from 'lucide-react';

export default function FanMediaUpload() {
  const [name, setName] = useState('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name) return;
    setLoading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const fileType = file.type.startsWith('video') ? 'video' : 'photo';
    await base44.entities.FanMedia.create({ name, caption, file_url, file_type: fileType, consent_feature: true });
    setDone(true);
    setLoading(false);
  };

  return (
    <section className="py-12 md:py-10 md:py-12 px-4 md:px-6">
      <div className="max-w-xl mx-auto text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Camera className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Fan Wall</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">Share Your Moment</h2>
          <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
            Upload a photo or video to be featured on the fan media wall.
          </p>

          {done ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <p className="font-body text-sm text-foreground">Thanks for sharing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              <Input
                placeholder="Your name *"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="bg-secondary/50 border-border/40 font-body"
              />
              <Input
                placeholder="Caption (optional)"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="bg-secondary/50 border-border/40 font-body"
              />
              <div className="border border-dashed border-border/50 rounded-xl p-4 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                  id="fan-media-upload"
                />
                <label htmlFor="fan-media-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <p className="font-body text-sm text-muted-foreground">
                    {file ? file.name : 'Click to choose photo or video'}
                  </p>
                </label>
              </div>
              <Button
                type="submit"
                disabled={loading || !file || !name}
                className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
              >
                {loading ? 'Uploading...' : 'Upload to Fan Wall'}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
