import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Music2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PUBLIC_RELEASE_FILTER, isPublicRelease } from '@/lib/publicRelease';

const MOODS = [
  'Reflective',
  'Hopeful',
  'Quiet',
  'Resilient',
  'Heartbroken',
  'Rebuilding',
];

export default function MusicRecommender() {
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const { data: candidates = [] } = useQuery({
    queryKey: ['recommender-public-releases'],
    queryFn: () => base44.entities.Release.filter(PUBLIC_RELEASE_FILTER, '-release_date', 100),
    initialData: [],
  });

  const releases = useMemo(
    () => candidates.filter(isPublicRelease),
    [candidates],
  );

  const recommend = async () => {
    if (!mood || releases.length === 0) return;

    setIsWorking(true);
    setError('');
    setRecommendation(null);

    try {
      const catalogue = releases.map((release) => ({
        id: release.id,
        title: release.title,
        version_label: release.version_label || '',
        description: release.description || '',
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Choose one item from this exact current public Gannon Waye catalogue for a listener feeling "${mood}".

Catalogue:
${JSON.stringify(catalogue)}

Return only a JSON object with:
- "title": one title copied exactly from the catalogue
- "reason": a short explanation based only on the supplied description

Do not invent or infer a title, lyric, release date, story, artwork, link, status, or platform claim.`,
        response_json_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            reason: { type: 'string' },
          },
          required: ['title', 'reason'],
        },
      });

      const exactRelease = releases.find((release) => release.title === result?.title);
      if (!exactRelease) {
        setError('No verified catalogue match was returned. Please try another mood.');
        return;
      }

      setRecommendation({
        release: exactRelease,
        reason: result.reason || exactRelease.description || 'Selected from the approved public catalogue.',
      });
    } catch {
      setError('The recommender is unavailable right now.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Sparkles className="w-9 h-9 text-primary mx-auto mb-5" />
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-5">
            Music Recommender
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto">
            Choose a mood and receive a suggestion only from Gannon's current public catalogue.
          </p>
        </motion.header>

        <section className="rounded-3xl border border-primary/20 bg-card/55 p-7 md:p-10">
          {releases.length === 0 ? (
            <div className="text-center py-8">
              <Music2 className="w-10 h-10 text-primary/60 mx-auto mb-4" />
              <h2 className="font-display text-3xl text-foreground mb-3">No public catalogue yet</h2>
              <p className="font-body text-sm text-muted-foreground">
                The recommender stays off until at least one exact Release is approved for public sharing.
              </p>
              <Link to="/music" className="inline-block mt-6">
                <Button variant="outline" className="rounded-full border-primary/35 text-primary">
                  Visit Music
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <label htmlFor="mood" className="font-body text-xs tracking-[0.2em] uppercase text-primary">
                How are you feeling?
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                className="mt-3 w-full rounded-xl border border-border/50 bg-background px-4 py-3 font-body text-sm text-foreground"
              >
                <option value="">Choose a mood</option>
                {MOODS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <Button
                type="button"
                onClick={recommend}
                disabled={!mood || isWorking}
                className="mt-5 w-full rounded-full gradient-gold-button border-0"
              >
                {isWorking ? 'Finding a verified match...' : 'Recommend Music'}
              </Button>
            </>
          )}

          {error && (
            <p className="font-body text-sm text-red-300 text-center mt-5">{error}</p>
          )}

          {recommendation && (
            <div className="mt-8 rounded-2xl border border-border/40 bg-background/35 p-6">
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                Verified recommendation
              </p>
              <h2 className="font-display text-3xl text-foreground mt-2">
                {recommendation.release.title}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mt-3">
                {recommendation.reason}
              </p>
              <Link to={`/release/${recommendation.release.id}`} className="inline-block mt-5">
                <Button variant="outline" className="rounded-full border-primary/35 text-primary">
                  View Release
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}