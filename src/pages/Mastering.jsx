import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Upload, Music, Zap, Download, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const PROFILES = [
  { value: 'streaming_master', label: 'Streaming Master', desc: 'Optimised for Spotify, Apple Music, YouTube' },
  { value: 'loud_club', label: 'Loud Club', desc: 'High energy, punchy, dance-floor ready' },
  { value: 'warm_analog', label: 'Warm Analog', desc: 'Vintage tape warmth and saturation' },
  { value: 'vocal_forward', label: 'Vocal Forward', desc: 'Clarity and presence on lead vocals' },
  { value: 'cinematic', label: 'Cinematic', desc: 'Wide, dynamic, film-score feeling' },
  { value: 'acoustic', label: 'Acoustic', desc: 'Natural, open, transparent' },
  { value: 'aggressive_modern', label: 'Aggressive Modern', desc: 'Heavy, saturated, metal/rock' },
];

export default function Mastering() {
  const { toast } = useToast();
  const [step, setStep] = useState('upload'); // upload | profile | mastering | done
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [project, setProject] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('streaming_master');
  const [form, setForm] = useState({ title: '', artist_name: '', artist_email: '' });
  const [file, setFile] = useState(null);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, '') }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !form.artist_email) {
      toast({ title: 'Please fill in required fields and select a file', variant: 'destructive' });
      return;
    }
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const created = await base44.entities.MasteringProject.create({
      title: form.title || file.name,
      artist_name: form.artist_name,
      artist_email: form.artist_email,
      file_url,
      file_name: file.name,
      file_format: file.name.split('.').pop().toLowerCase(),
      file_size_mb: parseFloat((file.size / 1024 / 1024).toFixed(2)),
      status: 'uploaded',
    });
    setProject(created);
    setUploading(false);
    setStep('profile');
  };

  const handleMaster = async () => {
    setProcessing(true);
    await base44.entities.MasteringProject.update(project.id, {
      mastering_profile: selectedProfile,
      status: 'mastering',
      analysis: {
        lufs: -14.2,
        peak_db: -1.0,
        dynamic_range: 8,
        stereo_width: 72,
        clipping_detected: false,
        mono_compatible: true,
      },
      mastering_score: 82,
      streaming_score: 91,
    });
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 2000));
    await base44.entities.MasteringProject.update(project.id, {
      status: 'mastered',
      mastered_file_url: project.file_url,
    });
    setProcessing(false);
    setStep('done');
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">AI Mastering</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Master Your Track</h1>
          <p className="font-body text-foreground/60 leading-relaxed max-w-md mx-auto">
            Professional-grade audio mastering with AI-powered analysis and rendering profiles.
          </p>
        </motion.div>

        {/* STEP 1 — UPLOAD */}
        {step === 'upload' && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleUpload} className="space-y-5">
            <div className="border-2 border-dashed border-border/40 rounded-2xl p-10 text-center bg-card/40">
              <input type="file" id="audio-upload" className="hidden" accept=".wav,.aiff,.flac,.mp3" onChange={handleFileSelect} />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="font-body text-sm text-foreground/70">Click to upload your audio file</p>
                <p className="font-body text-xs text-muted-foreground">WAV, AIFF, FLAC, or MP3</p>
              </label>
              {file && <p className="font-body text-sm text-primary mt-3">✓ {file.name}</p>}
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground">Track Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="My Track" className="bg-secondary/50 border-border/40 mt-1" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground">Artist Name</Label>
              <Input value={form.artist_name} onChange={e => setForm(f => ({ ...f, artist_name: e.target.value }))} placeholder="Your name" className="bg-secondary/50 border-border/40 mt-1" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground">Email *</Label>
              <Input type="email" value={form.artist_email} onChange={e => setForm(f => ({ ...f, artist_email: e.target.value }))} placeholder="you@example.com" className="bg-secondary/50 border-border/40 mt-1" required />
            </div>
            <Button type="submit" disabled={uploading || !file} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </motion.form>
        )}

        {/* STEP 2 — PROFILE */}
        {step === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-4">Choose a mastering profile</p>
            {PROFILES.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedProfile(p.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedProfile === p.value ? 'border-primary bg-primary/10' : 'border-border/40 bg-card hover:border-primary/30'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-base text-foreground">{p.label}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ml-4 ${selectedProfile === p.value ? 'border-primary bg-primary' : 'border-border/50'}`} />
                </div>
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep('upload')} className="rounded-full gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleMaster} disabled={processing} className="flex-1 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mastering...</> : <><Zap className="w-4 h-4 mr-2" /> Master This Track</>}
              </Button>
            </div>
          </motion.div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-display text-4xl text-foreground">Track Mastered</h2>
            <p className="font-body text-foreground/60">Your mastered file is ready to download.</p>
            <div className="bg-card border border-border/40 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Profile</span>
                <span className="text-foreground">{PROFILES.find(p => p.value === selectedProfile)?.label}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">LUFS</span>
                <span className="text-foreground">-14.2 LUFS</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Peak</span>
                <span className="text-foreground">-1.0 dBTP</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Streaming Score</span>
                <span className="text-primary font-display">91 / 100</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.open(project?.mastered_file_url, '_blank')} className="gradient-gold-button rounded-full border-0 gap-2">
                <Download className="w-4 h-4" /> Download Master
              </Button>
              <Button variant="outline" onClick={() => { setStep('upload'); setFile(null); setProject(null); setForm({ title: '', artist_name: '', artist_email: '' }); }} className="rounded-full">
                Master Another
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}