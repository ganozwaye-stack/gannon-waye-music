import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Film, Sparkles, MessageSquare, Calendar, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PRESETS = [
  {
    id: 'emotional',
    label: 'Emotional',
    icon: '🎭',
    desc: 'Slow zoom · warm gold tint · soft captions · fade transitions',
    color: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    id: 'viral',
    label: 'Viral',
    icon: '⚡',
    desc: 'Fast cuts 1–2s · zoom punches · bold captions · hard cuts',
    color: 'border-blue-400/30 bg-blue-400/5',
  },
  {
    id: 'reveal',
    label: 'Reveal',
    icon: '💥',
    desc: 'Particle burst · light flash · gold glow · audio hit sync',
    color: 'border-primary/30 bg-primary/5',
  },
];

const EMOTIONS = ['sad', 'intense', 'hopeful', 'reflective'];
const TONES = ['dark', 'warm', 'high energy'];

export default function ContentEngine() {
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preset, setPreset] = useState('emotional');
  const [analysis, setAnalysis] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState('');
  const [copied, setCopied] = useState('');

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setAnalysis(null);
    setCaptions(null);
    setSchedule(null);
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: f });
      setFileUrl(file_url);
    } catch {
      toast({ title: 'Upload failed', variant: 'destructive' });
    }
    setUploading(false);
  };

  const runAnalysis = async () => {
    if (!fileUrl) return;
    setLoading('analysis');
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a music content strategist for singer-songwriter Gannon Waye. Analyse this media upload and return a JSON object.

Media URL: ${fileUrl}
File name: ${file?.name}

Return ONLY valid JSON with this exact structure:
{
  "emotion": "one of: sad / intense / hopeful / reflective",
  "tempo": "estimated BPM as a number or 'unknown'",
  "tone": "one of: dark / warm / high energy",
  "summary": "1 sentence describing the mood and energy",
  "clips": [
    { "start": "0:00", "end": "0:07", "type": "hook", "note": "why this is a good clip" },
    { "start": "0:08", "end": "0:18", "type": "emotional", "note": "..." },
    { "start": "0:30", "end": "0:45", "type": "highlight", "note": "..." }
  ],
  "recommendedPreset": "emotional | viral | reveal"
}`,
        response_json_schema: {
          type: 'object',
          properties: {
            emotion: { type: 'string' },
            tempo: {},
            tone: { type: 'string' },
            summary: { type: 'string' },
            clips: { type: 'array', items: { type: 'object' } },
            recommendedPreset: { type: 'string' },
          },
        },
        file_urls: [fileUrl],
      });
      setAnalysis(res);
      if (res.recommendedPreset) setPreset(res.recommendedPreset);
    } catch {
      toast({ title: 'Analysis failed', variant: 'destructive' });
    }
    setLoading('');
  };

  const generateCaptions = async () => {
    if (!analysis) return;
    setLoading('captions');
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are writing TikTok/Instagram Reel captions for Gannon Waye, a deeply emotional singer-songwriter.

Detected emotion: ${analysis.emotion}
Detected tone: ${analysis.tone}
Summary: ${analysis.summary}
Preset: ${preset}

Generate caption sets in this JSON format. Each caption set includes:
- hook: the first 2 seconds (grabs attention)
- emotional_line: the core message 
- cta: call to action

{
  "reel_1": { "hook": "...", "emotional_line": "...", "cta": "...", "full_caption": "full IG caption with hashtags" },
  "reel_2": { "hook": "...", "emotional_line": "...", "cta": "...", "full_caption": "..." },
  "reel_3": { "hook": "...", "emotional_line": "...", "cta": "...", "full_caption": "..." },
  "story": { "hook": "...", "emotional_line": "...", "cta": "..." }
}`,
        response_json_schema: {
          type: 'object',
          properties: {
            reel_1: { type: 'object' },
            reel_2: { type: 'object' },
            reel_3: { type: 'object' },
            story: { type: 'object' },
          },
        },
      });
      setCaptions(res);
    } catch {
      toast({ title: 'Caption generation failed', variant: 'destructive' });
    }
    setLoading('');
  };

  const generateSchedule = async () => {
    setLoading('schedule');
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a 7-day social media posting schedule for Gannon Waye's single "Thank You" release (releasing June 10, 2026). Today is ${new Date().toLocaleDateString('en-AU')}.

Current phase: ${new Date() < new Date('2026-05-10') ? 'Pre-reveal (building tension)' : new Date() < new Date('2026-06-10') ? 'Post-reveal (driving pre-saves)' : 'Post-release (driving streams)'}.

Preset style: ${preset}

Return JSON:
{
  "phase": "phase name",
  "posts": [
    { "day": "Day 1 - Mon", "platform": "TikTok", "time": "7:00 PM AEST", "type": "reel_1 | reel_2 | reel_3 | story", "caption_note": "brief note on which caption to use", "hook": "opening line" }
  ]
}

Include 7-10 posts across TikTok and Instagram, 1-2 per day.`,
        response_json_schema: {
          type: 'object',
          properties: {
            phase: { type: 'string' },
            posts: { type: 'array', items: { type: 'object' } },
          },
        },
      });
      setSchedule(res);
    } catch {
      toast({ title: 'Schedule generation failed', variant: 'destructive' });
    }
    setLoading('');
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl text-foreground">Content Engine</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          GW_CONTENT_ENGINE · Upload media → AI analysis → captions → schedule
        </p>
      </div>

      {/* STEP 1 — Upload */}
      <div className="bg-card border border-border/40 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center font-body text-xs text-primary font-bold">1</div>
          <h2 className="font-display text-xl text-foreground">Upload Media</h2>
        </div>

        <input ref={fileRef} type="file" accept="video/*,audio/*,image/*" onChange={handleFile} className="hidden" />
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="font-body text-sm text-muted-foreground">Uploading…</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <p className="font-body text-sm text-foreground font-medium">{file.name}</p>
              <p className="font-body text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB · Click to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground/40" />
              <p className="font-body text-sm text-muted-foreground">Drop a video, audio, or image</p>
              <p className="font-body text-xs text-muted-foreground/50">MP4, MOV, MP3, JPG, PNG</p>
            </div>
          )}
        </div>

        {fileUrl && (
          <Button
            onClick={runAnalysis}
            disabled={loading === 'analysis'}
            className="mt-4 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
          >
            {loading === 'analysis' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading === 'analysis' ? 'Analysing…' : 'Analyse Media'}
          </Button>
        )}
      </div>

      {/* STEP 2 — Analysis result */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/40 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center font-body text-xs text-primary font-bold">2</div>
              <h2 className="font-display text-xl text-foreground">AI Analysis</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Emotion', value: analysis.emotion },
                { label: 'Tone', value: analysis.tone },
                { label: 'Tempo', value: typeof analysis.tempo === 'number' ? `${analysis.tempo} BPM` : analysis.tempo },
              ].map(({ label, value }) => (
                <div key={label} className="bg-secondary/40 rounded-xl p-3 text-center">
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{label}</p>
                  <p className="font-display text-base text-foreground capitalize">{value}</p>
                </div>
              ))}
            </div>

            <p className="font-body text-sm text-foreground/70 italic border-l-2 border-primary/30 pl-3">{analysis.summary}</p>

            {/* Detected clips */}
            {analysis.clips?.length > 0 && (
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Suggested Clips</p>
                <div className="space-y-2">
                  {analysis.clips.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-lg px-3 py-2">
                      <Film className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-body text-xs text-foreground font-medium">{c.start} → {c.end} <span className="text-primary ml-1 uppercase">{c.type}</span></p>
                        <p className="font-body text-xs text-muted-foreground">{c.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 — Style preset */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center font-body text-xs text-primary font-bold">3</div>
            <h2 className="font-display text-xl text-foreground">Style Preset</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  preset === p.id ? p.color + ' border-primary/50' : 'border-border/40 hover:border-primary/20'
                }`}
              >
                <p className="text-xl mb-1">{p.icon}</p>
                <p className="font-display text-base text-foreground">{p.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                {analysis.recommendedPreset === p.id && (
                  <span className="inline-block mt-2 font-body text-[9px] tracking-widest uppercase text-primary border border-primary/30 rounded-full px-2 py-0.5">AI Recommended</span>
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={generateCaptions}
            disabled={loading === 'captions'}
            className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
          >
            {loading === 'captions' ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            {loading === 'captions' ? 'Generating…' : 'Generate Captions'}
          </Button>
        </motion.div>
      )}

      {/* STEP 4 — Captions */}
      <AnimatePresence>
        {captions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/40 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center font-body text-xs text-primary font-bold">4</div>
              <h2 className="font-display text-xl text-foreground">Generated Captions</h2>
            </div>

            {['reel_1', 'reel_2', 'reel_3', 'story'].map(key => {
              const cap = captions[key];
              if (!cap) return null;
              return (
                <div key={key} className="bg-secondary/30 rounded-xl p-4 space-y-2">
                  <p className="font-body text-[10px] tracking-widest uppercase text-primary mb-2">
                    {key === 'story' ? '📱 Story' : `🎬 Reel ${key.split('_')[1]}`}
                  </p>
                  <div className="space-y-1">
                    <p className="font-body text-sm text-foreground"><span className="text-muted-foreground text-xs mr-2">HOOK</span>{cap.hook}</p>
                    <p className="font-body text-sm text-foreground"><span className="text-muted-foreground text-xs mr-2">LINE</span>{cap.emotional_line}</p>
                    <p className="font-body text-sm text-foreground"><span className="text-muted-foreground text-xs mr-2">CTA</span>{cap.cta}</p>
                  </div>
                  {cap.full_caption && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-body text-xs text-muted-foreground leading-relaxed flex-1">{cap.full_caption}</p>
                        <button
                          onClick={() => copyText(cap.full_caption, key)}
                          className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {copied === key ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Button
              onClick={generateSchedule}
              disabled={loading === 'schedule'}
              variant="outline"
              className="rounded-full font-body text-sm tracking-wider uppercase gap-2 border-primary/30 text-primary hover:bg-primary/10"
            >
              {loading === 'schedule' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              {loading === 'schedule' ? 'Building…' : 'Generate Posting Schedule'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 5 — Schedule */}
      <AnimatePresence>
        {schedule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border/40 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center font-body text-xs text-primary font-bold">5</div>
              <h2 className="font-display text-xl text-foreground">Posting Schedule</h2>
              <span className="font-body text-xs text-primary border border-primary/30 rounded-full px-2 py-0.5">{schedule.phase}</span>
            </div>

            <div className="space-y-2">
              {schedule.posts?.map((post, i) => (
                <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl px-4 py-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-body text-xs font-medium text-foreground">{post.day}</span>
                      <span className="font-body text-[10px] text-muted-foreground">{post.time}</span>
                      <span className="font-body text-[9px] tracking-wider uppercase text-primary border border-primary/20 rounded-full px-1.5 py-0.5">{post.platform}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{post.hook}</p>
                    {post.caption_note && <p className="font-body text-[10px] text-muted-foreground/60 mt-0.5">{post.caption_note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => copyText(JSON.stringify(schedule, null, 2), 'schedule')}
              variant="outline"
              className="rounded-full font-body text-xs tracking-wider uppercase gap-2"
            >
              {copied === 'schedule' ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              Copy Full Schedule
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}