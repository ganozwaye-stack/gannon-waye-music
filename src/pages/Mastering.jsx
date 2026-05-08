import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Upload, Music, Zap, Download, CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle, Info, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

const ACCEPTED_TYPES = ['audio/wav', 'audio/x-wav', 'audio/aiff', 'audio/x-aiff', 'audio/flac', 'audio/x-flac', 'audio/mpeg', 'audio/mp3'];
const ACCEPTED_EXTS = ['.wav', '.aiff', '.aif', '.flac', '.mp3'];
const MAX_SIZE_MB = 200;

const PROFILES = [
  { value: 'streaming_master',   label: 'Streaming Master',   desc: 'Optimised for Spotify, Apple Music, YouTube' },
  { value: 'loud_club',          label: 'Loud Club',           desc: 'High energy, punchy, dance-floor ready' },
  { value: 'warm_analog',        label: 'Warm Analog',         desc: 'Vintage tape warmth and saturation' },
  { value: 'vocal_forward',      label: 'Vocal Forward',       desc: 'Clarity and presence on lead vocals' },
  { value: 'cinematic',          label: 'Cinematic',           desc: 'Wide, dynamic, film-score feeling' },
  { value: 'acoustic',           label: 'Acoustic',            desc: 'Natural, open, transparent' },
  { value: 'aggressive_modern',  label: 'Aggressive Modern',   desc: 'Heavy, saturated, metal/rock' },
];

const DEFAULT_CONTROLS = {
  loudness: 50,
  stereo_width: 50,
  warmth: 50,
  brightness: 50,
  punch: 50,
  vocal_presence: 50,
  limiter_intensity: 60,
};

// Browser-side audio analysis — results are estimates only
async function analyseAudio(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = await ctx.decodeAudioData(e.target.result);
        const channelData = buffer.getChannelData(0);

        let peak = 0;
        let sumSq = 0;
        let clipping = false;

        for (let i = 0; i < channelData.length; i++) {
          const abs = Math.abs(channelData[i]);
          if (abs > peak) peak = abs;
          if (abs >= 0.999) clipping = true;
          sumSq += channelData[i] * channelData[i];
        }

        const rms = Math.sqrt(sumSq / channelData.length);
        const lufs_estimate = rms > 0 ? Math.round(20 * Math.log10(rms) - 3) : -60;
        const peak_db = Math.round(20 * Math.log10(peak) * 10) / 10;
        const duration = Math.round(buffer.duration);

        // Stereo width: compare channels if stereo
        let stereo_width = 50;
        let mono_compatible = true;
        if (buffer.numberOfChannels >= 2) {
          const ch1 = buffer.getChannelData(0);
          const ch2 = buffer.getChannelData(1);
          let diffSum = 0;
          const samples = Math.min(ch1.length, 10000);
          for (let i = 0; i < samples; i++) {
            diffSum += Math.abs(ch1[i] - ch2[i]);
          }
          stereo_width = Math.min(100, Math.round((diffSum / samples) * 200));
          mono_compatible = stereo_width < 80;
        }

        ctx.close();
        resolve({
          lufs: lufs_estimate,
          peak_db,
          dynamic_range: Math.max(2, Math.min(20, Math.round(-lufs_estimate - (-peak_db) + 4))),
          stereo_width,
          clipping_detected: clipping,
          mono_compatible,
          duration_seconds: duration,
          browser_estimate: true,
        });
      } catch {
        // Fallback if decoding fails (e.g. unsupported codec in browser)
        resolve({
          lufs: null,
          peak_db: null,
          dynamic_range: null,
          stereo_width: null,
          clipping_detected: null,
          mono_compatible: null,
          duration_seconds: null,
          browser_estimate: true,
          decode_failed: true,
        });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function masteryScore(analysis) {
  if (!analysis || analysis.decode_failed) return { mastering_score: null, streaming_score: null };
  let score = 70;
  if (analysis.clipping_detected) score -= 20;
  if (analysis.lufs !== null && analysis.lufs > -8) score -= 10;
  if (analysis.lufs !== null && analysis.lufs < -20) score -= 5;
  if (!analysis.mono_compatible) score -= 5;
  const streaming = Math.min(100, Math.max(0, score + (analysis.dynamic_range > 6 ? 10 : 0)));
  return { mastering_score: Math.min(100, Math.max(0, score)), streaming_score: streaming };
}

export default function Mastering() {
  const { toast } = useToast();
  const [step, setStep] = useState('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [project, setProject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('streaming_master');
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [form, setForm] = useState({ title: '', artist_name: '', artist_email: '' });
  const [file, setFile] = useState(null);
  const dropRef = useRef(null);

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      toast({ title: 'Unsupported file type', description: 'Please upload WAV, AIFF, FLAC, or MP3', variant: 'destructive' });
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ title: `File too large`, description: `Maximum file size is ${MAX_SIZE_MB}MB`, variant: 'destructive' });
      return false;
    }
    return true;
  };

  const selectFile = (f) => {
    if (!f || !validateFile(f)) return;
    setFile(f);
    if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, '') }));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  }, [form.title]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast({ title: 'Please select an audio file', variant: 'destructive' }); return; }
    if (!form.artist_email) { toast({ title: 'Email is required', variant: 'destructive' }); return; }

    setUploading(true);
    let file_url;
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      file_url = result.file_url;
    } catch {
      toast({ title: 'Upload failed. Please try again.', variant: 'destructive' });
      setUploading(false);
      return;
    }
    setUploading(false);

    setAnalysing(true);
    const analysisResult = await analyseAudio(file);
    setAnalysis(analysisResult);
    setAnalysing(false);

    const { mastering_score, streaming_score } = masteryScore(analysisResult);

    const created = await base44.entities.MasteringProject.create({
      title: form.title || file.name,
      artist_name: form.artist_name,
      artist_email: form.artist_email,
      file_url,
      file_name: file.name,
      file_format: file.name.split('.').pop().toLowerCase(),
      file_size_mb: parseFloat((file.size / 1024 / 1024).toFixed(2)),
      duration_seconds: analysisResult.duration_seconds,
      status: 'ready_to_master',
      analysis: analysisResult,
      mastering_score,
      streaming_score,
    });
    setProject(created);
    setStep('profile');
  };

  const handleMaster = async () => {
    setProcessing(true);
    try {
      await base44.entities.MasteringProject.update(project.id, {
        mastering_profile: selectedProfile,
        settings: controls,
        status: 'mastering',
      });
      await new Promise(r => setTimeout(r, 1800));
      await base44.entities.MasteringProject.update(project.id, {
        status: 'mastered',
        mastered_file_url: project.file_url, // original used as placeholder — real DSP not available
      });
      setStep('done');
    } catch {
      toast({ title: 'Mastering failed. Please try again.', variant: 'destructive' });
    }
    setProcessing(false);
  };

  const resetAll = () => {
    setStep('upload'); setFile(null); setProject(null);
    setAnalysis(null); setForm({ title: '', artist_name: '', artist_email: '' });
    setControls(DEFAULT_CONTROLS); setSelectedProfile('streaming_master');
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">AI Mastering</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Master Your Track</h1>
          <p className="font-body text-foreground/60 leading-relaxed max-w-md mx-auto">
            Upload your audio, choose a profile, and get a mastered result. Analysis results are browser-based estimates.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground/60">
            <Info className="w-3 h-3" />
            <span>Supports WAV · AIFF · FLAC · MP3 · Max {MAX_SIZE_MB}MB</span>
          </div>
        </motion.div>

        {/* STEP 1 — UPLOAD */}
        {step === 'upload' && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleUpload} className="space-y-5">
            <div
              ref={dropRef}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? 'border-primary bg-primary/5' : 'border-border/40 bg-card/40'}`}
            >
              <input type="file" id="audio-upload" className="hidden" accept=".wav,.aiff,.aif,.flac,.mp3" onChange={e => selectFile(e.target.files[0])} />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <Upload className={`w-10 h-10 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-body text-sm text-foreground/70">
                  {dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
                </p>
                <p className="font-body text-xs text-muted-foreground">WAV · AIFF · FLAC · MP3 · Max {MAX_SIZE_MB}MB</p>
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-primary">
                  <Music className="w-4 h-4" />
                  <p className="font-body text-sm">{file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)</p>
                </div>
              )}
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

            <Button type="submit" disabled={uploading || analysing || !file} className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-5">
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
               : analysing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analysing audio...</>
               : <>Analyse & Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </motion.form>
        )}

        {/* STEP 2 — PROFILE + ANALYSIS + CONTROLS */}
        {step === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Analysis results */}
            {analysis && (
              <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Browser Analysis Estimate</p>
                  <span className="font-body text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">Not studio-grade</span>
                </div>
                {analysis.decode_failed ? (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <p className="font-body text-sm">Audio decoded in upload only — browser could not analyse codec. Project saved.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-sm font-body">
                    <div><p className="text-muted-foreground text-xs">Est. Loudness</p><p className="text-foreground">{analysis.lufs != null ? `${analysis.lufs} LUFS` : '—'}</p></div>
                    <div><p className="text-muted-foreground text-xs">Peak Level</p><p className={analysis.peak_db >= 0 ? 'text-red-400' : 'text-foreground'}>{analysis.peak_db != null ? `${analysis.peak_db} dBTP` : '—'}</p></div>
                    <div><p className="text-muted-foreground text-xs">Dynamic Range</p><p className="text-foreground">{analysis.dynamic_range != null ? `~${analysis.dynamic_range} dB` : '—'}</p></div>
                    <div><p className="text-muted-foreground text-xs">Stereo Width</p><p className="text-foreground">{analysis.stereo_width != null ? `${analysis.stereo_width}%` : '—'}</p></div>
                    {analysis.clipping_detected && (
                      <div className="col-span-2 flex items-center gap-2 text-red-400">
                        <AlertCircle className="w-4 h-4" /> <span>Clipping detected — consider reducing gain before mastering</span>
                      </div>
                    )}
                    {!analysis.mono_compatible && (
                      <div className="col-span-2 flex items-center gap-2 text-yellow-400">
                        <AlertCircle className="w-4 h-4" /> <span>Mono compatibility issue detected</span>
                      </div>
                    )}
                    {project?.mastering_score != null && (
                      <div><p className="text-muted-foreground text-xs">Readiness Score</p><p className="text-primary font-display">{project.mastering_score}/100</p></div>
                    )}
                    {project?.streaming_score != null && (
                      <div><p className="text-muted-foreground text-xs">Streaming Score</p><p className="text-primary font-display">{project.streaming_score}/100</p></div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile selection */}
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Choose a mastering profile</p>
              <div className="space-y-2">
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
              </div>
            </div>

            {/* Fine controls */}
            <div className="bg-card border border-border/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Fine Controls</p>
              </div>
              {Object.entries(controls).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <Label className="font-body text-xs capitalize text-muted-foreground">{key.replace(/_/g, ' ')}</Label>
                    <span className="font-body text-xs text-foreground">{val}</span>
                  </div>
                  <Slider
                    value={[val]}
                    min={0} max={100} step={1}
                    onValueChange={([v]) => setControls(c => ({ ...c, [key]: v }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
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
            <h2 className="font-display text-4xl text-foreground">Mastering Complete</h2>
            <p className="font-body text-foreground/60">Your project has been saved. Download the processed file below.</p>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-left">
              <p className="font-body text-xs text-yellow-400">
                Note: This is a browser-based mastering simulation. The export is the original file with your profile settings saved. Full DSP processing requires a dedicated audio engine.
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Profile</span>
                <span className="text-foreground">{PROFILES.find(p => p.value === selectedProfile)?.label}</span>
              </div>
              {analysis && !analysis.decode_failed && (
                <>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Est. Loudness</span>
                    <span className="text-foreground">{analysis.lufs} LUFS (browser estimate)</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Peak</span>
                    <span className="text-foreground">{analysis.peak_db} dBTP</span>
                  </div>
                </>
              )}
              {project?.streaming_score != null && (
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Streaming Score</span>
                  <span className="text-primary font-display">{project.streaming_score} / 100</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.open(project?.mastered_file_url, '_blank')} className="gradient-gold-button rounded-full border-0 gap-2">
                <Download className="w-4 h-4" /> Download Export
              </Button>
              <Button variant="outline" onClick={resetAll} className="rounded-full">
                Master Another
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}