import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Music2, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

const MOODS = [
  { label: 'Healing', emoji: '🌿' },
  { label: 'Empowered', emoji: '⚡' },
  { label: 'Reflective', emoji: '🌙' },
  { label: 'Heartbreak', emoji: '💔' },
  { label: 'Hopeful', emoji: '✨' },
  { label: 'Raw & Real', emoji: '🔥' },
];

export default function MusicRecommendations() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setRecs(null);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a music curator for fans of Gannon Waye — an Australian singer-songwriter who writes deeply personal, emotionally honest songs. His debut single "Thank You" is about breaking cycles and choosing self-respect.

A fan is feeling: "${mood.label}" ${mood.emoji}

Recommend 4 songs (NOT by Gannon Waye) that complement this mood AND would resonate with fans of raw, emotional singer-songwriter music. These fans value authenticity, vulnerability, and real storytelling.

Return ONLY a JSON object like:
{
  "intro": "One sentence about why these songs fit this mood",
  "songs": [
    { "title": "Song Title", "artist": "Artist Name", "why": "One sentence why this fits" }
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          intro: { type: 'string' },
          songs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                artist: { type: 'string' },
                why: { type: 'string' },
              },
            },
          },
        },
      },
    });
    setRecs(result);
    setLoading(false);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Curated For You</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">How Are You Feeling?</h2>
          <p className="font-body text-foreground/50 mt-3 text-sm">Pick a mood and get music recommendations that match where you're at.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => getRecommendations(mood)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all border ${
                selectedMood?.label === mood.label
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-card border-border/40 text-foreground/70 hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground">Finding songs for you...</p>
          </div>
        )}

        {recs && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="font-body text-sm text-foreground/60 text-center italic mb-6">{recs.intro}</p>
            {recs.songs?.map((song, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/40 rounded-xl p-4 flex items-start gap-4 hover:border-primary/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Music2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-foreground">{song.title}</p>
                  <p className="font-body text-sm text-primary/80">{song.artist}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{song.why}</p>
                </div>
                <a
                  href={`https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              </motion.div>
            ))}
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1.5" onClick={() => getRecommendations(selectedMood)}>
                <RefreshCw className="w-3 h-3" /> Different suggestions
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}