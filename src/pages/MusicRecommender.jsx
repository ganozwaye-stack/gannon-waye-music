import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Music, Heart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const MOODS = [
  { id: 'reflective', label: 'Reflective & Introspective', emoji: '🌙' },
  { id: 'uplifting', label: 'Uplifting & Hopeful', emoji: '☀️' },
  { id: 'raw', label: 'Raw & Honest', emoji: '💔' },
  { id: 'energetic', label: 'Energetic & Driven', emoji: '⚡' },
  { id: 'melancholic', label: 'Melancholic & Tender', emoji: '🌧️' },
  { id: 'empowering', label: 'Empowering & Bold', emoji: '🔥' },
];

const SITUATIONS = [
  'Going through a breakup',
  'Missing someone who passed',
  'Feeling stuck and needing change',
  'Celebrating a personal win',
  'Late night drive, windows down',
  'Needing courage to make a hard choice',
  'Processing complicated feelings',
  'Wanting to feel understood',
];

export default function MusicRecommender() {
  const [mood, setMood] = useState('');
  const [situation, setSituation] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.filter({ is_published: true }, '-release_date'),
    initialData: [],
  });

  const handleRecommend = async () => {
    if (!mood && !situation) {
      setError('Pick a mood or describe your situation to get a recommendation.');
      return;
    }
    setError('');
    setLoading(true);
    setRecommendation(null);

    try {
      const catalogText = releases.length > 0
        ? releases.map(r => `- "${r.title}": ${r.description || 'A song by Gannon Waye.'}`).join('\n')
        : '- "Thank You": A song about breaking a cycle and choosing self-respect.\n- "Without You Here": A raw, acoustic letter to a late mother.';

      const prompt = `You are a music recommendation engine for independent artist Gannon Waye. 

Here is Gannon's song catalog:
${catalogText}

The listener selected mood: "${mood || 'not specified'}"
The listener's situation: "${situation || 'not specified'}"

Based on the mood and situation, recommend the SINGLE best Gannon Waye song for them right now. Explain why in 2-3 sentences that feel personal and warm, as if a close friend is recommending it. Reference the specific mood or situation in your explanation.

Respond as JSON:
{
  "song_title": "the exact song title from the catalog",
  "why": "2-3 sentence personal explanation",
  "lyric_snippet": "a short representative line or theme from the song (you can infer from the description if needed)"
}`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            song_title: { type: 'string' },
            why: { type: 'string' },
            lyric_snippet: { type: 'string' },
          },
        },
      });

      setRecommendation(res);
    } catch (e) {
      setError('Something went wrong generating your recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recommendedRelease = recommendation
    ? releases.find(r => r.title.toLowerCase() === recommendation.song_title?.toLowerCase())
    : null;

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/20 text-primary/60 mx-auto mb-6">
            <Sparkles className="w-7 h-7" />
          </div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Find Your Song</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-5">Music Recommender</h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Tell me how you're feeling right now, and I'll recommend the perfect Gannon Waye song for this moment.
          </p>
        </motion.div>

        {/* Input form */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-8 space-y-6">
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-primary/60 mb-3 block">How are you feeling?</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMood(mood === m.id ? '' : m.id)}
                  className="font-body text-xs px-3 py-3 rounded-xl transition-all text-left"
                  style={{
                    background: mood === m.id ? 'hsl(var(--primary) / 0.12)' : 'hsl(var(--secondary) / 0.3)',
                    border: `1px solid hsl(var(--primary) / ${mood === m.id ? 0.4 : 0.15})`,
                  }}
                >
                  <span className="text-base mr-1.5">{m.emoji}</span>
                  <span className={mood === m.id ? 'text-primary' : 'text-muted-foreground'}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-xs tracking-widest uppercase text-primary/60 mb-3 block">What's going on right now?</label>
            <div className="flex flex-wrap gap-2">
              {SITUATIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSituation(situation === s ? '' : s)}
                  className="font-body text-xs px-4 py-2 rounded-full transition-all"
                  style={{
                    background: situation === s ? 'hsl(var(--primary) / 0.12)' : 'transparent',
                    border: `1px solid hsl(var(--primary) / ${situation === s ? 0.4 : 0.2})`,
                    color: situation === s ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="font-body text-sm text-red-400 text-center">{error}</p>}

          <Button
            onClick={handleRecommend}
            disabled={loading}
            className="w-full rounded-full font-body text-sm tracking-wider uppercase gradient-gold-button border-0 gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Finding your song…</>
            ) : recommendation ? (
              <><RefreshCw className="w-4 h-4" />Try Again</>
            ) : (
              <><Sparkles className="w-4 h-4" />Recommend a Song</>
            )}
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {recommendation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-card border border-primary/30 rounded-2xl p-8 text-center"
            >
              <p className="font-body text-xs tracking-[0.3em] uppercase text-primary/50 mb-4">Your Song</p>
              <h2 className="font-display text-3xl text-foreground mb-2">{recommendation.song_title}</h2>
              <p className="font-body italic text-primary/60 text-sm mb-6">"{recommendation.lyric_snippet}"</p>
              <div className="bg-secondary/30 rounded-xl p-5 mb-6 text-left">
                <p className="font-body text-sm text-foreground/75 leading-relaxed">{recommendation.why}</p>
              </div>

              {recommendedRelease && (
                <div className="flex flex-wrap justify-center gap-2">
                  {recommendedRelease.spotify_link && (
                    <a href={recommendedRelease.spotify_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="rounded-full font-body text-xs gradient-gold-button border-0 gap-1.5">
                        🎧 Listen on Spotify
                      </Button>
                    </a>
                  )}
                  <Link to="/music">
                    <Button size="sm" variant="outline" className="rounded-full font-body text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1.5">
                      <Music className="w-3 h-3" />All Songs
                    </Button>
                  </Link>
                  <Link to="/lyric-library">
                    <Button size="sm" variant="outline" className="rounded-full font-body text-xs border-primary/30 text-primary hover:bg-primary/10">
                      Read Lyrics
                    </Button>
                  </Link>
                </div>
              )}
              {!recommendedRelease && (
                <Link to="/music">
                  <Button size="sm" className="rounded-full font-body text-xs gradient-gold-button border-0 gap-1.5">
                    <Music className="w-3 h-3" />Listen on Music Page
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        {!recommendation && !loading && (
          <div className="text-center mt-8">
            <p className="font-body text-xs text-muted-foreground/50">
              Powered by AI · Recommendations based on your mood and situation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}