import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const FALLBACK_QUOTES = [
  { text: "As long as you remember me, my memory will live on.", source: "Without You Here" },
  { text: "Thank You is what it sounds like when you break a cycle and refuse to return to it.", source: "Thank You" },
  { text: "Every word is intentional.", source: "Gannon Waye" },
];

export default function LyricsHighlights({ compact = false }) {
  const [idx, setIdx] = useState(0);

  const { data: lyrics = [] } = useQuery({
    queryKey: ['highlightLyrics'],
    queryFn: () => base44.entities.Lyric.filter({ is_published: true, publishing_safe: true }, 'sort_order', 20),
    initialData: [],
  });

  const quotes = lyrics.length > 0
    ? lyrics.slice(0, 6).map(l => {
        const lines = (l.lyrics_text || '').split('\n').filter(line => line.trim().length > 20);
        const picked = lines.length > 0 ? lines[Math.floor(lines.length / 2)] : l.title;
        return { text: picked.trim(), source: l.title };
      })
    : FALLBACK_QUOTES;

  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % quotes.length), 6000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  const current = quotes[idx] || quotes[0];

  return (
    <div className={`relative ${compact ? 'py-8' : 'py-16'} px-4 overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)'
      }} />
      <div className="relative max-w-2xl mx-auto text-center">
        <Quote className="w-8 h-8 text-primary/30 mx-auto mb-6" />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display italic text-foreground/85 leading-relaxed" style={{ fontSize: compact ? '1.1rem' : '1.4rem' }}>
              "{current.text}"
            </p>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-primary/50 mt-5">
              — {current.source}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-1.5 mt-8">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                background: i === idx ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}