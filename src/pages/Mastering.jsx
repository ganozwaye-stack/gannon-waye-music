import React, { useState, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Upload, Music, Zap, Download, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, AlertCircle, Info, SlidersHorizontal, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { masterTrack } from '@/lib/audioDSP';

const ACCEPTED_EXTS = ['.wav', '.aiff', '.aif', '.flac', '.mp3'];
const MAX_SIZE_MB = 200;

const PROFILES = [
  { value: 'streaming_master',  label: 'Streaming Master',  desc: 'Optimised for Spotify, Apple Music, YouTube · -14 LUFS target' },
  { value: 'loud_club',         label: 'Loud Club',          desc: 'High energy, punchy, dance-floor · -8 LUFS target' },
  { value: 'warm_analog',       label: 'Warm Analog',        desc: 'Tape warmth and harmonic saturation · -16 LUFS target' },
  { value: 'vocal_forward',     label: 'Vocal Forward',      desc: 'Presence boost, tighter stereo, lead vocal clarity' },
  { value: 'cinematic',         label: 'Cinematic',          desc: 'Wide stereo field, dynamic, film-score · -18 LUFS target' },
  { value: 'acoustic',          label: 'Acoustic',           desc: 'Natural, open, transparent — no saturation' },
  { value: 'aggressive_modern', label: 'Aggressive Modern',  desc: 'Heavy saturation, hard limit · -7 LUFS target' },
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

const CONTROL_LABELS = {
  loudness: 'Loudness',
  stereo_width: 'Stereo Width',
  warmth: 'Warmth',
  brightness: 'Brightness / Air',
  punch: 'Punch / Saturation',
  vocal_presence: 'Vocal Presence',
  limiter_intensity: 'Limiter Intensity',
};

// Browser-side pre-analysis (estimates only)
async function analyseAudio(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = await ctx.decodeAudioData(e.target.result);
        const ch0 = buffer.getChannelData(0);
        let peak = 0, sumSq = 0, clipping = false;
        for (let i = 0; i < ch0.length; i++) {
          const abs = Math.abs(ch0[i]);
          if (abs > peak) peak = abs;
          if (abs >= 0.999) clipping = true;
          sumSq += ch0[i] * ch0[i];
        }
        const rms = Math.sqrt(sumSq / ch0.length);
        const lufs = rms > 0 ? Math.round(20 * Math.log10(rms) - 3) : -60;
        const peak_db = Math.round(20 * Math.log10(peak) * 10) / 10;
        let stereo_width = 0, mono_compatible = true;
        if (buffer.numberOfChannels >= 2) {
          const ch1 = buffer.getChannelData(1);
          let diff = 0;
          const s = Math.min(ch0.length, 10000);
          for (let i = 0; i < s; i++) diff += Math.abs(ch0[i] - ch1[i]);
          stereo_width = Math.min(100, Math.round((diff / s) * 200));
          mono_compatible = stereo_width < 80;
        }
        ctx.close();
        resolve({
          lufs, peak_db,
          dynamic_range: Math.max(2, Math.min(20, Math.round(-lufs - (-peak_db) + 4))),
          stereo_width, clipping_detected: clipping, mono_compatible,
          duration_seconds: Math.round(buffer.duration),
        });
      } catch {
        resolve({ decode_failed: true });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function readinessScore(analysis) {
  if (!analysis || analysis.decode_failed) return { mastering_score: null, streaming_score: null };
  let score = 70;
  if (analysis.clipping_detected) score -= 20;
  if (analysis.lufs > -8) score -= 10;
  if (analysis.lufs < -20) score -= 5;
  if (!analysis.mono_compatible) score -= 5;
  const streaming = Math.min(100, score + (analysis.dynamic_range > 6 ? 10 : 0));
  return { mastering_score: Math.min(100, Math.max(0, score)), streaming_score: Math.max(0, streaming) };
}

export default function Mastering() {
  const { toast } = useToast();
  const [step, setStep] = useState('upload');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [project, setProject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [masteredStats, setMasteredStats] = useState(null);
  const [masteredBlob, setMasteredBlob] = useState(null);
  const [masteredFilename, setMasteredFilename] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState('streaming_master');
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [form, setForm] = useState({ title: '', artist_name: '', artist_email: '' });
  const [file, setFile] = useState(null);

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      toast({ title: 'Unsupported file type', description: 'WAV, AIFF, FLAC, or MP3 only', variant: 'destructive' });
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      toast({ title: 'File too large', description: `Max ${MAX_SIZE_MB}MB`, variant: 'destructive' });
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
  }, []);

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

    const { mastering_score, streaming_score } = readinessScore(analysisResult);
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
    setProgress(0);

    await base44.entities.MasteringProject.update(project.id, {
      mastering_profile: selectedProfile,
      settings: controls,
      status: 'mastering',
    });

    try {
      const result = await masterTrack(file, selectedProfile, controls, setProgress);
      setMasteredBlob(result.blob);
      setMasteredFilename(result.filename);
      setMasteredStats(result.stats);

      // Upload mastered file to get a permanent URL
      let mastered_file_url = null;
      try {
        const up = await base44.integrations.Core.UploadFile({ file: new File([result.blob], result.filename, { type: 'audio/wav' }) });
        mastered_file_url = up.file_url;
      } catch {
        // Non-fatal — user can still download from blob
      }

      await base44.entities.MasteringProject.update(project.id, {
        status: 'mastered',
        mastered_file_url,
      });

      setStep('done');
    } catch (err) {
      toast({ title: 'Mastering failed. Please try again.', description: err?.message, variant: 'destructive' });
      await base44.entities.MasteringProject.update(project.id, { status: 'failed' });
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    if (!masteredBlob || !masteredFilename) return;
    const url = URL.createObjectURL(masteredBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = masteredFilename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const resetAll = () => {
    setStep('upload'); setFile(null); setProject(null); setAnalysis(null);
    setMasteredBlob(null); setMasteredFilename(null); setMasteredStats(null);
    setForm({ title: '', artist_name: '', artist_email: '' });
    setControls(DEFAULT_CONTROLS); setSelectedProfile('streaming_master');
    setProgress(0);
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Engineer Suite</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">Master Your Track</h1>
          <p className="font-body text-foreground/60 leading-relaxed max-w-md mx-auto">
            Real browser-side DSP mastering. EQ, stereo width, limiter, and loudness normalisation applied to your actual audio. Exports a processed WAV file.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground/60">
            <Info className="w-3 h-3" />
            <span>WAV · AIFF · FLAC · MP3 · Max {MAX_SIZE_MB}MB</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
            <Activity className="w-3 h-3 text-yellow-400" />
            <span className="font-body text-[10px] text-yellow-400">Browser DSP · Not studio-grade hardware processing</span>
          </div>
        </motion.div>

        {/* STEP 1 — UPLOAD */}
        {step === 'upload' && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleUpload} className="space-y-5">
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${dragging ? 'border-primary bg-primary/5' : 'border-border/40 bg-card/40'}`}
            >
              <input type="file" id="audio-upload" className="hidden" accept=".wav,.aiff,.aif,.flac,.mp3" onChange={e => selectFile(e.target.files[0])} />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <Upload className={`w-10 h-10 ${dragging ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-body text-sm text-foreground/70">{dragging ? 'Drop to upload' : 'Drag & drop or click to upload'}</p>
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

        {/* STEP 2 — PROFILE + CONTROLS */}
        {step === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Pre-analysis */}
            {analysis && !analysis.decode_failed && (
              <div className="bg-card border border-border/40 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Input Analysis</p>
                  <span className="font-body text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">Pre-master estimate</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm font-body">
                  <div><p className="text-muted-foreground text-xs">Loudness (est.)</p><p className="text-foreground">{analysis.lufs} LUFS</p></div>
                  <div><p className="text-muted-foreground text-xs">Peak</p><p className={analysis.peak_db >= 0 ? 'text-red-400' : 'text-foreground'}>{analysis.peak_db} dBTP</p></div>
                  <div><p className="text-muted-foreground text-xs">Dynamic Range</p><p className="text-foreground">~{analysis.dynamic_range} dB</p></div>
                  <div><p className="text-muted-foreground text-xs">Stereo Width</p><p className="text-foreground">{analysis.stereo_width}%</p></div>
                  {analysis.clipping_detected && (
                    <div className="col-span-2 flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4" /> <span className="text-xs">Clipping detected — reduce gain before mastering</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile selection */}
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Mastering Profile</p>
              <div className="space-y-2">
                {PROFILES.map(p => (
                  <button key={p.value} onClick={() => setSelectedProfile(p.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedProfile === p.value ? 'border-primary bg-primary/10' : 'border-border/40 bg-card hover:border-primary/30'}`}>
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
              <div className="flex items-center gap-2 mb-1">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Fine Controls</p>
              </div>
              {Object.entries(controls).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <Label className="font-body text-xs text-muted-foreground">{CONTROL_LABELS[key]}</Label>
                    <span className="font-body text-xs text-foreground">{val}</span>
                  </div>
                  <Slider value={[val]} min={0} max={100} step={1}
                    onValueChange={([v]) => setControls(c => ({ ...c, [key]: v }))} className="w-full" />
                </div>
              ))}
            </div>

            {/* Processing progress */}
            {processing && (
              <div className="bg-card border border-border/40 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <p className="font-body text-sm text-foreground">Applying DSP mastering chain...</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="font-body text-[10px] text-muted-foreground mt-1.5">
                  EQ → Saturation → Stereo Width → Normalisation → Limiter → WAV encode
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('upload')} className="rounded-full gap-2" disabled={processing}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleMaster} disabled={processing} className="flex-1 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">
                {processing
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mastering {progress}%...</>
                  : <><Zap className="w-4 h-4 mr-2" /> Master This Track</>}
              </Button>
            </div>
          </motion.div>
        )}

        {/* DONE */}
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h2 className="font-display text-4xl text-foreground">Mastered</h2>
            <p className="font-body text-foreground/60">DSP chain applied. Your processed WAV is ready to download.</p>

            <div className="bg-card border border-border/40 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Profile</span>
                <span className="text-foreground">{PROFILES.find(p => p.value === selectedProfile)?.label}</span>
              </div>
              {masteredStats && (
                <>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Output Loudness</span>
                    <span className="text-foreground">{masteredStats.output_lufs} LUFS</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Output Peak</span>
                    <span className="text-foreground">{masteredStats.output_peak_db} dBTP</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Sample Rate</span>
                    <span className="text-foreground">{masteredStats.sample_rate / 1000} kHz · {masteredStats.channels}ch</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Format</span>
                    <span className="text-foreground">WAV · 16-bit PCM</span>
                  </div>
                </>
              )}
              {analysis && !analysis.decode_failed && (
                <div className="pt-2 border-t border-border/40">
                  <p className="font-body text-xs text-muted-foreground mb-2">Before → After</p>
                  <div className="flex justify-between text-xs font-body text-muted-foreground">
                    <span>Loudness: {analysis.lufs} → {masteredStats?.output_lufs} LUFS</span>
                    <span>Peak: {analysis.peak_db} → {masteredStats?.output_peak_db} dBTP</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-left">
              <p className="font-body text-xs text-yellow-400">
                Browser DSP — biquad EQ, mid/side stereo, soft-knee limiter, and gain normalisation applied to actual audio samples. Not hardware DSP or AI mastering. For professional release, use a studio engineer.
              </p>
            </div>

            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={handleDownload} className="gradient-gold-button rounded-full border-0 gap-2 px-8">
                <Download className="w-4 h-4" /> Download Mastered WAV
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