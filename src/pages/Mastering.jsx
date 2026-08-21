import { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Upload, Music, Zap, Download, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, AlertCircle, SlidersHorizontal, Activity, Sparkles,
  Layers, Sliders, Trash2, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { masterTrackPro, mixStems } from '@/lib/audioDSPPro';
import StripePaymentForm from '@/components/store/StripePaymentForm';
import { CreditCard, Lock } from 'lucide-react';

const MASTERING_PRICES = {
  master: { amount: 49, label: 'Professional Mastering', desc: 'Full track mastering with pro DSP chain · 24-bit WAV export' },
  mix: { amount: 89, label: 'Stem Mixing & Mastering', desc: 'Multi-stem mixing + mastering · per-stem EQ, gain, pan · 24-bit WAV export' },
};

// ── Design toggle — Option 2 = Cinematic (default), Option 1 = Dark Luxury Glass
const DESIGNS = {
  cinematic: {
    label: 'Cinematic Editorial',
    bg: 'bg-[#09090E]',
    card: 'bg-[#111118] border border-white/5',
    heading: 'font-display text-[#F5F0E8]',
    sub: 'text-[#A09880]',
    rule: 'bg-[#C9A84C]/30',
    badge: 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20',
    btn: 'gradient-gold-button',
    input: 'bg-[#111118] border-white/10 text-[#F5F0E8] placeholder:text-[#6B6455]',
    profileActive: 'border-[#C9A84C] bg-[#C9A84C]/5',
    profileInactive: 'border-white/5 bg-[#111118] hover:border-[#C9A84C]/30',
    accent: '#C9A84C',
    number: 'font-display text-6xl text-[#C9A84C]/20 leading-none',
  },
  luxury: {
    label: 'Dark Luxury Glass',
    bg: 'bg-[#050508]',
    card: 'bg-white/3 backdrop-blur-xl border border-white/8 shadow-2xl',
    heading: 'font-display text-white',
    sub: 'text-white/50',
    rule: 'bg-gradient-to-r from-transparent via-[#FFE08A]/40 to-transparent',
    badge: 'bg-[#FFE08A]/10 text-[#FFE08A] border border-[#FFE08A]/20',
    btn: 'gradient-gold-button',
    input: 'bg-white/5 border-white/10 text-white placeholder:text-white/30 backdrop-blur-sm',
    profileActive: 'border-[#FFE08A]/50 bg-[#FFE08A]/5 shadow-lg shadow-[#FFE08A]/5',
    profileInactive: 'border-white/5 bg-white/3 hover:border-[#FFE08A]/20',
    accent: '#FFE08A',
    number: 'font-display text-6xl text-[#FFE08A]/10 leading-none',
  },
};

const ACCEPTED_EXTS = ['.wav', '.aiff', '.aif', '.flac', '.mp3'];
const MAX_SIZE_MB = 200;

const EXPORT_FORMATS = [
  { value: 'wav24', label: '24-bit WAV', desc: 'Studio standard · PCM integer' },
  { value: 'wav32', label: '32-bit Float WAV', desc: 'Maximum quality · no quantisation' },
];

const SAMPLE_RATES = [
  { value: 44100, label: '44.1 kHz', desc: 'CD quality' },
  { value: 48000, label: '48 kHz', desc: 'Video / pro standard' },
  { value: 96000, label: '96 kHz', desc: 'High resolution' },
];

const PROFILES = [
  { value: 'streaming_master', label: 'Streaming Master', desc: 'Optimised for Spotify, Apple Music, YouTube · -14 LUFS', num: '01' },
  { value: 'loud_club', label: 'Loud Club', desc: 'High energy, punchy, dance-floor · -8 LUFS', num: '02' },
  { value: 'warm_analog', label: 'Warm Analog', desc: 'Tape warmth and harmonic saturation · -16 LUFS', num: '03' },
  { value: 'vocal_forward', label: 'Vocal Forward', desc: 'Presence boost, tighter stereo, lead vocal clarity', num: '04' },
  { value: 'cinematic', label: 'Cinematic', desc: 'Wide stereo field, dynamic, film-score · -18 LUFS', num: '05' },
  { value: 'acoustic', label: 'Acoustic', desc: 'Natural, open, transparent — no saturation', num: '06' },
  { value: 'aggressive_modern', label: 'Aggressive Modern', desc: 'Heavy saturation, hard limit · -7 LUFS', num: '07' },
];

const DEFAULT_CONTROLS = {
  loudness: 50, stereo_width: 50, warmth: 50,
  brightness: 50, punch: 50, vocal_presence: 50, limiter_intensity: 60,
};

const CONTROL_LABELS = {
  loudness: 'Loudness', stereo_width: 'Stereo Width', warmth: 'Warmth',
  brightness: 'Brightness / Air', punch: 'Punch / Saturation',
  vocal_presence: 'Vocal Presence', limiter_intensity: 'Limiter Intensity',
};

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
        resolve({ lufs, peak_db, dynamic_range: Math.max(2, Math.min(20, Math.round(-lufs - (-peak_db) + 4))), stereo_width, clipping_detected: clipping, mono_compatible, duration_seconds: Math.round(buffer.duration) });
      } catch { resolve({ decode_failed: true }); }
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
  const [design, setDesign] = useState('cinematic');
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const d = DESIGNS[design];

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
  const [mode, setMode] = useState('master'); // 'master' | 'mix'
  const [exportFormat, setExportFormat] = useState('wav24');
  const [targetSampleRate, setTargetSampleRate] = useState(44100);
  const [stems, setStems] = useState([]); // [{file, name, gain, pan, eq}]
  const [paid, setPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) { toast({ title: 'Unsupported file type', description: 'WAV, AIFF, FLAC, or MP3 only', variant: 'destructive' }); return false; }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) { toast({ title: 'File too large', description: `Max ${MAX_SIZE_MB}MB`, variant: 'destructive' }); return false; }
    return true;
  };

  const selectFile = (f) => {
    if (!f || !validateFile(f)) return;
    setFile(f);
    if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^/.]+$/, '') }));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) selectFile(f);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast({ title: 'Please select an audio file', variant: 'destructive' }); return; }
    if (!form.artist_email) { toast({ title: 'Email is required', variant: 'destructive' }); return; }
    setUploading(true);
    let file_url;
    try { const result = await base44.integrations.Core.UploadFile({ file }); file_url = result.file_url; }
    catch { toast({ title: 'Upload failed. Please try again.', variant: 'destructive' }); setUploading(false); return; }
    setUploading(false); setAnalysing(true);
    const analysisResult = await analyseAudio(file);
    setAnalysis(analysisResult); setAnalysing(false);
    const { mastering_score, streaming_score } = readinessScore(analysisResult);
    const created = await base44.entities.MasteringProject.create({
      title: form.title || file.name, artist_name: form.artist_name, artist_email: form.artist_email,
      file_url, file_name: file.name, file_format: file.name.split('.').pop().toLowerCase(),
      file_size_mb: parseFloat((file.size / 1024 / 1024).toFixed(2)), duration_seconds: analysisResult.duration_seconds,
      status: 'ready_to_master', analysis: analysisResult, mastering_score, streaming_score,
    });
    setProject(created); setStep('profile');
  };

  const handleMaster = async () => {
    setProcessing(true); setProgress(0);
    await base44.entities.MasteringProject.update(project.id, { mastering_profile: selectedProfile, settings: controls, status: 'mastering' });
    try {
      const result = await masterTrackPro(file, selectedProfile, controls, setProgress, {
        exportFormat,
        targetSampleRate,
      });
      setMasteredBlob(result.blob); setMasteredFilename(result.filename); setMasteredStats(result.stats);
      let mastered_file_url = null;
      try { const up = await base44.integrations.Core.UploadFile({ file: new File([result.blob], result.filename, { type: 'audio/wav' }) }); mastered_file_url = up.file_url; } catch {}
      await base44.entities.MasteringProject.update(project.id, { status: 'mastered', mastered_file_url, export_format: exportFormat });
      setStep('done');
    } catch (err) {
      toast({ title: 'Mastering failed. Please try again.', description: err?.message, variant: 'destructive' });
      await base44.entities.MasteringProject.update(project.id, { status: 'failed' });
    }
    setProcessing(false);
  };

  // ── Mix mode: stem management ──
  const addStem = (f) => {
    if (!f) return;
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) { toast({ title: 'Unsupported file type', description: 'WAV, AIFF, FLAC, or MP3 only', variant: 'destructive' }); return; }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) { toast({ title: 'File too large', description: `Max ${MAX_SIZE_MB}MB`, variant: 'destructive' }); return; }
    setStems(prev => [...prev, {
      file: f,
      name: f.name.replace(/\.[^/.]+$/, ''),
      gain: 0,
      pan: 0,
      eq: { low: 0, mid: 0, high: 0 },
    }]);
  };

  const updateStem = (idx, field, value) => {
    setStems(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const updateStemEQ = (idx, band, value) => {
    setStems(prev => prev.map((s, i) => i === idx ? { ...s, eq: { ...s.eq, [band]: value } } : s));
  };

  const removeStem = (idx) => {
    setStems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMix = async () => {
    if (stems.length === 0) { toast({ title: 'Add at least one stem', variant: 'destructive' }); return; }
    setProcessing(true); setProgress(0); setStep('profile');
    try {
      const result = await mixStems(stems, setProgress);
      setMasteredBlob(result.blob); setMasteredFilename(result.filename); setMasteredStats(result.stats);
      setStep('done');
    } catch (err) {
      toast({ title: 'Mixing failed. Please try again.', description: err?.message, variant: 'destructive' });
      setStep('upload');
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    if (!masteredBlob || !masteredFilename) return;
    const url = URL.createObjectURL(masteredBlob);
    const a = document.createElement('a');
    a.href = url; a.download = masteredFilename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const resetAll = () => {
    setStep('upload'); setFile(null); setProject(null); setAnalysis(null);
    setMasteredBlob(null); setMasteredFilename(null); setMasteredStats(null);
    setForm({ title: '', artist_name: '', artist_email: '' });
    setControls(DEFAULT_CONTROLS); setSelectedProfile('streaming_master'); setProgress(0);
    setStems([]);
    setPaid(false);
    setShowPayment(false);
  };

  return (
    <div className={`min-h-screen ${d.bg} transition-colors duration-500`}>

      {/* ── Design Picker Banner ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
          <span className="text-xs text-white/50 font-body">Active style: <span className="text-white/80">{d.label}</span></span>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(DESIGNS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setDesign(key)}
              className={`px-3 py-1 rounded-full text-xs font-body transition-all border ${design === key ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-white/10 text-white/40 hover:border-white/30'}`}
            >
              {key === 'cinematic' ? '2 — Cinematic' : '1 — Luxury Glass'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* ── Mode Toggle: Master vs Mix ─────────────────────────────── */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button
            onClick={() => { setMode('master'); resetAll(); }}
            className={`px-6 py-2.5 rounded-full font-body text-xs tracking-wider uppercase transition-all border ${
              mode === 'master' ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1.5" /> Master
          </button>
          <button
            onClick={() => { setMode('mix'); resetAll(); }}
            className={`px-6 py-2.5 rounded-full font-body text-xs tracking-wider uppercase transition-all border ${
              mode === 'mix' ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1.5" /> Mix Stems
          </button>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          {design === 'cinematic' ? (
            <>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-[#C9A84C]/20" />
                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/60">Engineer Suite</span>
                <div className="flex-1 h-px bg-[#C9A84C]/20" />
              </div>
              <div className="relative mb-6">
                <p className={`${d.number} select-none absolute -top-6 -left-2 pointer-events-none`}>M</p>
                <h1 className={`${d.heading} text-5xl md:text-7xl font-display leading-none relative z-10`}>
                  Master<br />Your Track
                </h1>
              </div>
              <p className={`${d.sub} font-body text-sm leading-relaxed max-w-md mt-6`}>
                {mode === 'master'
                  ? 'Pro mastering chain: Linkwitz-Riley 4th-order crossovers · True multiband compression · 4× oversampled true-peak limiter · K-weighted LUFS · 32-bit float export.'
                  : 'Stem mixing engine: Upload individual stems (vocals, guitar, drums, etc.) · per-stem gain, pan & EQ · mix bus glue compression · true-peak limiting · 32-bit float export at 48 kHz.'}
              </p>
              <div className="flex items-center gap-3 mt-5">
                <div className="h-px flex-1 max-w-12 bg-[#C9A84C]/30" />
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]/50">WAV · AIFF · FLAC · MP3 · Max {MAX_SIZE_MB}MB</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className={`font-body text-xs tracking-[0.3em] uppercase mb-5 ${d.sub}`}>Engineer Suite</p>
              <h1 className={`${d.heading} text-5xl md:text-6xl mb-6`}>Master Your Track</h1>
              <p className={`${d.sub} font-body text-sm max-w-md mx-auto leading-relaxed`}>
                Studio-grade mastering. 24-bit export. K-weighted LUFS normalisation. True-peak limiting.
              </p>
              <div className={`mt-4 inline-flex items-center gap-2 ${d.badge} rounded-full px-4 py-1.5`}>
                <Activity className="w-3 h-3" />
                <span className="font-body text-[10px]">WAV · AIFF · FLAC · MP3 · Max {MAX_SIZE_MB}MB</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── STEP 1 — UPLOAD (MIX MODE: STEM UPLOADER) ────────────────── */}
        {step === 'upload' && mode === 'mix' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Stem drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) addStem(f); }}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-white/10 hover:border-white/20'}`}
            >
              <input type="file" id="stem-upload" className="hidden" accept=".wav,.aiff,.aif,.flac,.mp3" onChange={e => { if (e.target.files[0]) addStem(e.target.files[0]); e.target.value = ''; }} multiple />
              <label htmlFor="stem-upload" className="cursor-pointer flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${dragging ? 'bg-[#C9A84C]/20' : 'bg-white/5'}`}>
                  <Plus className={`w-6 h-6 ${dragging ? 'text-[#C9A84C]' : 'text-white/30'}`} />
                </div>
                <div>
                  <p className={`font-body text-sm ${d.sub}`}>{dragging ? 'Drop to add stem' : 'Add a stem file'}</p>
                  <p className="font-body text-xs text-white/20 mt-1">Vocals, guitar, drums, bass, keys... one at a time</p>
                </div>
              </label>
            </div>

            {/* Stem list with per-stem controls */}
            {stems.length > 0 && (
              <div className="space-y-3">
                <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${d.sub}`}>{stems.length} Stem{stems.length > 1 ? 's' : ''} Loaded</p>
                {stems.map((stem, idx) => (
                  <div key={idx} className={`${d.card} rounded-xl p-4 space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Music className="w-4 h-4 text-[#C9A84C] shrink-0" />
                        <p className={`font-body text-sm truncate ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>{stem.name}</p>
                        <span className="font-body text-[10px] text-white/30 shrink-0">{(stem.file.size / 1024 / 1024).toFixed(1)}MB</span>
                      </div>
                      <button onClick={() => removeStem(idx)} className="text-white/30 hover:text-red-400 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Gain + Pan */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label className={`font-body text-[10px] ${d.sub}`}>Gain</Label>
                          <span className={`font-body text-[10px] ${d.sub}`}>{stem.gain > 0 ? '+' : ''}{stem.gain} dB</span>
                        </div>
                        <Slider value={[stem.gain]} min={-24} max={12} step={0.5} onValueChange={([v]) => updateStem(idx, 'gain', v)} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <Label className={`font-body text-[10px] ${d.sub}`}>Pan</Label>
                          <span className={`font-body text-[10px] ${d.sub}`}>{stem.pan === 0 ? 'C' : stem.pan < 0 ? `L${Math.abs(stem.pan * 100)}` : `R${stem.pan * 100}`}</span>
                        </div>
                        <Slider value={[stem.pan]} min={-1} max={1} step={0.05} onValueChange={([v]) => updateStem(idx, 'pan', v)} className="w-full" />
                      </div>
                    </div>
                    {/* Per-stem EQ */}
                    <div className="grid grid-cols-3 gap-3">
                      {['low', 'mid', 'high'].map(band => (
                        <div key={band}>
                          <div className="flex justify-between mb-1">
                            <Label className={`font-body text-[9px] uppercase ${d.sub}`}>{band}</Label>
                            <span className={`font-body text-[9px] ${d.sub}`}>{stem.eq[band] > 0 ? '+' : ''}{stem.eq[band]}</span>
                          </div>
                          <Slider value={[stem.eq[band]]} min={-12} max={12} step={0.5} onValueChange={([v]) => updateStemEQ(idx, band, v)} className="w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={handleMix} disabled={processing || stems.length === 0} className={`w-full rounded-full ${d.btn} border-0 font-body text-sm tracking-wider uppercase py-6`}>
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mixing {progress}%...</>
                : <><Layers className="w-4 h-4 mr-2" />Mix {stems.length} Stem{stems.length !== 1 ? 's' : ''} → Master</>}
            </Button>
          </motion.div>
        )}

        {/* ── STEP 1 — UPLOAD (MASTER MODE) ───────────────────────────── */}
        {step === 'upload' && mode === 'master' && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleUpload} className="space-y-5">
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${dragging ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-white/10 hover:border-white/20'} ${design === 'luxury' ? 'backdrop-blur-sm' : ''}`}
            >
              <input type="file" id="audio-upload" className="hidden" accept=".wav,.aiff,.aif,.flac,.mp3" onChange={e => selectFile(e.target.files[0])} />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${dragging ? 'bg-[#C9A84C]/20' : 'bg-white/5'}`}>
                  <Upload className={`w-7 h-7 ${dragging ? 'text-[#C9A84C]' : 'text-white/30'}`} />
                </div>
                <div>
                  <p className={`font-body text-sm ${d.sub}`}>{dragging ? 'Drop to upload' : 'Drag & drop your audio file'}</p>
                  <p className="font-body text-xs text-white/20 mt-1">or click to browse</p>
                </div>
              </label>
              {file && (
                <div className="mt-5 flex items-center justify-center gap-2">
                  <div className={`flex items-center gap-2 ${d.badge} rounded-full px-4 py-1.5`}>
                    <Music className="w-3 h-3" />
                    <span className="font-body text-xs">{file.name} · {(file.size / 1024 / 1024).toFixed(1)}MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className={`font-body text-[10px] tracking-widest uppercase ${d.sub} block mb-1.5`}>Track Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="My Track" className={d.input} />
              </div>
              <div>
                <Label className={`font-body text-[10px] tracking-widest uppercase ${d.sub} block mb-1.5`}>Artist Name</Label>
                <Input value={form.artist_name} onChange={e => setForm(f => ({ ...f, artist_name: e.target.value }))} placeholder="Your name" className={d.input} />
              </div>
            </div>
            <div>
              <Label className={`font-body text-[10px] tracking-widest uppercase ${d.sub} block mb-1.5`}>Email *</Label>
              <Input type="email" value={form.artist_email} onChange={e => setForm(f => ({ ...f, artist_email: e.target.value }))} placeholder="you@example.com" className={d.input} required />
            </div>

            <Button type="submit" disabled={uploading || analysing || !file} className={`w-full rounded-full ${d.btn} border-0 font-body text-sm tracking-wider uppercase py-6`}>
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Uploading...</>
               : analysing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analysing audio...</>
               : <>Analyse & Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </motion.form>
        )}

        {/* ── STEP 2 — PROFILE + CONTROLS ───────────────────────────────── */}
        {step === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Analysis panel */}
            {analysis && !analysis.decode_failed && (
              <div className={`${d.card} rounded-2xl p-5`}>
                {design === 'cinematic' && <div className={`h-px w-12 ${d.rule} mb-4`} />}
                <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${d.sub} mb-4`}>Input Analysis</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Loudness', value: `${analysis.lufs} LUFS`, warn: analysis.lufs > -8 },
                    { label: 'Peak', value: `${analysis.peak_db} dBTP`, warn: analysis.peak_db >= 0 },
                    { label: 'Dynamic Range', value: `~${analysis.dynamic_range} dB` },
                    { label: 'Stereo Width', value: `${analysis.stereo_width}%` },
                  ].map(stat => (
                    <div key={stat.label}>
                      <p className={`font-body text-[9px] tracking-wider uppercase ${d.sub} mb-1`}>{stat.label}</p>
                      <p className={`font-display text-lg ${stat.warn ? 'text-red-400' : d.heading.replace('font-display ', '')}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                {analysis.clipping_detected && (
                  <div className="mt-3 flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-body text-xs">Clipping detected — reduce gain before mastering</span>
                  </div>
                )}
              </div>
            )}

            {/* Profile selection */}
            <div>
              {design === 'cinematic' && (
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className={`font-body text-[10px] tracking-[0.3em] uppercase ${d.sub}`}>Select Profile</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              )}
              {design === 'luxury' && <p className={`font-body text-[10px] tracking-widest uppercase ${d.sub} mb-4`}>Mastering Profile</p>}
              <div className="space-y-2">
                {PROFILES.map(p => (
                  <button key={p.value} onClick={() => setSelectedProfile(p.value)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedProfile === p.value ? d.profileActive : d.profileInactive}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {design === 'cinematic' && (
                          <span className={`font-display text-2xl ${selectedProfile === p.value ? 'text-[#C9A84C]' : 'text-white/10'} leading-none w-8`}>{p.num}</span>
                        )}
                        <div>
                          <p className={`font-display text-base ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>{p.label}</p>
                          <p className={`font-body text-xs ${d.sub} mt-0.5`}>{p.desc}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ml-4 ${selectedProfile === p.value ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-white/10'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export format selector */}
            <div className={`${d.card} rounded-2xl p-5 space-y-3`}>
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-[#C9A84C]" />
                <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${d.sub}`}>Export Format</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_FORMATS.map(f => (
                  <button key={f.value} type="button" onClick={() => setExportFormat(f.value)}
                    className={`text-left p-3 rounded-xl border transition-all ${exportFormat === f.value ? d.profileActive : d.profileInactive}`}>
                    <p className={`font-body text-xs ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>{f.label}</p>
                    <p className={`font-body text-[10px] ${d.sub} mt-0.5`}>{f.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Sliders className="w-4 h-4 text-[#C9A84C]" />
                <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${d.sub}`}>Sample Rate</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_RATES.map(sr => (
                  <button key={sr.value} type="button" onClick={() => setTargetSampleRate(sr.value)}
                    className={`text-left p-2.5 rounded-lg border transition-all ${targetSampleRate === sr.value ? d.profileActive : d.profileInactive}`}>
                    <p className={`font-body text-xs ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>{sr.label}</p>
                    <p className={`font-body text-[9px] ${d.sub} mt-0.5`}>{sr.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine controls */}
            <div className={`${d.card} rounded-2xl p-6 space-y-5`}>
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-[#C9A84C]" />
                <p className={`font-body text-[10px] tracking-[0.3em] uppercase ${d.sub}`}>Fine Controls</p>
              </div>
              {Object.entries(controls).map(([key, val]) => (
                <div key={key} className="grid grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className={`font-body text-xs ${d.sub}`}>{CONTROL_LABELS[key]}</Label>
                      <span className={`font-body text-xs ${d.heading.includes('F5F0E8') ? 'text-[#F5F0E8]' : 'text-white'}`}>{val}</span>
                    </div>
                    <Slider value={[val]} min={0} max={100} step={1}
                      onValueChange={([v]) => setControls(c => ({ ...c, [key]: v }))} className="w-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            {processing && (
              <div className={`${d.card} rounded-xl p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 className="w-4 h-4 text-[#C9A84C] animate-spin" />
                  <p className={`font-body text-sm ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>Applying DSP mastering chain...</p>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div className="bg-gradient-to-r from-[#C9A84C] to-[#FFE08A] h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className={`font-body text-[10px] ${d.sub} mt-2`}>HPF → 4-band EQ → Saturation → M/S Width → LR4 Multiband Comp → K-weighted LUFS → 4× True-Peak Limiter → Dither → {exportFormat === 'wav32' ? '32-bit Float' : '24-bit'} WAV</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('upload')} className="rounded-full gap-2 border-white/10 text-white/50 hover:border-white/30" disabled={processing}>
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleMaster} disabled={processing} className={`flex-1 rounded-full ${d.btn} border-0 font-body text-sm tracking-wider uppercase`}>
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mastering {progress}%...</>
                  : <><Zap className="w-4 h-4 mr-2" />Master This Track</>}
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── DONE ─────────────────────────────────────────────────────── */}
        {step === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-6">
            {design === 'cinematic' ? (
              <>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 h-px bg-[#C9A84C]/20" />
                  <CheckCircle2 className="w-6 h-6 text-[#C9A84C]" />
                  <div className="flex-1 h-px bg-[#C9A84C]/20" />
                </div>
                <h2 className="font-display text-5xl text-[#F5F0E8]">Mastered</h2>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-16 h-16 text-[#FFE08A] mx-auto" />
                <h2 className="font-display text-4xl text-white">Mastered</h2>
              </>
            )}
            <p className={`font-body ${d.sub}`}>Pro mastering chain applied. Your {masteredStats?.export_format === 'wav32' ? '32-bit float' : '24-bit'} WAV is ready to download.</p>

            <div className={`${d.card} rounded-2xl p-6 text-left space-y-3`}>
              <div className="flex justify-between text-sm font-body">
                <span className={d.sub}>Profile</span>
                <span className={design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}>{PROFILES.find(p => p.value === selectedProfile)?.label}</span>
              </div>
              {masteredStats && (
                <>
                  {[
                    { label: 'Output Loudness', value: `${masteredStats.output_lufs} LUFS` },
                    { label: 'Output Peak', value: `${masteredStats.output_peak_db} dBTP` },
                    { label: 'Sample Rate', value: `${masteredStats.sample_rate / 1000} kHz · ${masteredStats.channels}ch` },
                    { label: 'Format', value: masteredStats?.export_format === 'wav32' ? 'WAV · 32-bit Float' : 'WAV · 24-bit PCM' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm font-body">
                      <span className={d.sub}>{row.label}</span>
                      <span className={design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}>{row.value}</span>
                    </div>
                  ))}
                </>
              )}
              {analysis && !analysis.decode_failed && masteredStats && (
                <div className="pt-3 border-t border-white/5">
                  <p className={`font-body text-xs ${d.sub} mb-2`}>Before → After</p>
                  <div className="flex justify-between text-xs font-body text-white/40">
                    <span>Loudness: {analysis.lufs} → {masteredStats?.output_lufs} LUFS</span>
                    <span>Peak: {analysis.peak_db} → {masteredStats?.output_peak_db} dBTP</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment gate — unlock download after purchase */}
            {!paid ? (
              <div className={`${d.card} rounded-2xl p-6 space-y-4`}>
                <div className="flex items-center gap-3 justify-center">
                  <Lock className="w-4 h-4 text-[#C9A84C]" />
                  <p className={`font-body text-sm ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>Your master is ready. Complete your purchase to unlock the download.</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <div>
                    <p className={`font-display text-lg ${design === 'cinematic' ? 'text-[#F5F0E8]' : 'text-white'}`}>{MASTERING_PRICES[mode].label}</p>
                    <p className={`font-body text-xs ${d.sub} mt-0.5`}>{MASTERING_PRICES[mode].desc}</p>
                  </div>
                  <p className={`font-display text-2xl text-[#C9A84C]`}>${MASTERING_PRICES[mode].amount} AUD</p>
                </div>
                {showPayment ? (
                  <StripePaymentForm
                    amount={MASTERING_PRICES[mode].amount}
                    customerEmail={form.artist_email}
                    customerName={form.artist_name || 'Artist'}
                    productName={`${MASTERING_PRICES[mode].label} — ${form.title || 'Track'}`}
                    metadata={{ service: mode, track_title: form.title }}
                    onSuccess={() => { setPaid(true); setShowPayment(false); toast({ title: 'Payment successful! Download unlocked.' }); }}
                    onError={(msg) => toast({ title: msg || 'Payment failed', variant: 'destructive' })}
                  />
                ) : (
                  <Button onClick={() => setShowPayment(true)} className={`w-full rounded-full ${d.btn} border-0 font-body text-sm tracking-wider uppercase py-5`}>
                    <CreditCard className="w-4 h-4 mr-2" /> Purchase & Unlock Download — ${MASTERING_PRICES[mode].amount} AUD
                  </Button>
                )}
                <Button variant="outline" onClick={resetAll} className="rounded-full border-white/10 text-white/50 hover:border-white/30 w-full">
                  Start Over
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={handleDownload} className={`${d.btn} rounded-full border-0 gap-2 px-8`}>
                  <Download className="w-4 h-4" /> Download Mastered WAV
                </Button>
                <Button variant="outline" onClick={resetAll} className="rounded-full border-white/10 text-white/50 hover:border-white/30">
                  Master Another
                </Button>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}