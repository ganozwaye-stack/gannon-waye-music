import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Copy, Share2, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { applyThankYouLyrics } from '@/lib/thankYouLyrics';

export default function LyricsModal({ release, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!release) return null;

  const displayRelease = applyThankYouLyrics(release);
  const isLocked = displayRelease.isLocked || displayRelease.status === 'recording' || displayRelease.id?.includes('recording');
  const hasLyrics = displayRelease.lyrics && displayRelease.lyrics.trim().length > 0;

  const handleCopy = () => {
    if (!hasLyrics) return;
    navigator.clipboard.writeText(displayRelease.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Lyrics copied');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/lyrics`;
    if (navigator.share) {
      await navigator.share({ title: `${displayRelease.title} — Gannon Waye`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-xl bg-card border border-border/40 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col"
          style={{ maxHeight: '92vh' }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border/30 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-primary/30 text-primary">
                    {displayRelease.type || 'Single'}
                  </Badge>
                  {displayRelease.status === 'released' && (
                    <Badge className="text-[10px] tracking-widest uppercase bg-primary/20 text-primary">Out Now</Badge>
                  )}
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">{displayRelease.title}</h2>
                {displayRelease.release_date && (
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    {new Date(displayRelease.release_date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={onClose} className="gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="w-3 h-3" />Back
              </Button>
              {hasLyrics && !isLocked && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 text-xs">
                  {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1 text-xs">
                <Share2 className="w-3 h-3" />Share
              </Button>
              {displayRelease.youtube_link && (
                <a href={displayRelease.youtube_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    ▶️ Video <ExternalLink className="w-3 h-3" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Scrollable lyrics */}
          <div className="overflow-y-auto flex-1 px-6 py-6">
            {isLocked ? (
              <div className="bg-gradient-to-br from-card to-secondary/30 rounded-2xl p-8 border border-border/40 backdrop-blur-md text-center py-12 relative overflow-hidden my-4">
                <div className="absolute -inset-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-2xl opacity-60 animate-pulse pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center border border-primary/30 text-primary mb-4 shadow-lg shadow-primary/5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-2">Studio Session</h3>
                  <p className="font-body text-sm text-primary/90 tracking-wider uppercase font-semibold mb-3">Release Pending</p>
                  <p className="font-body text-base text-muted-foreground max-w-sm">
                    Lyrics under studio wraps — Single drop coming soon.
                  </p>
                </div>
              </div>
            ) : hasLyrics ? (
              <pre className="font-body text-sm md:text-base text-foreground/85 leading-relaxed whitespace-pre-wrap font-normal">
                {displayRelease.lyrics}
              </pre>
            ) : (
              <div className="text-center py-12">
                <p className="font-display text-xl text-muted-foreground">Lyrics coming soon.</p>
                <p className="font-body text-xs text-muted-foreground mt-2">Check back closer to the release date.</p>
              </div>
            )}

            {/* Credits */}
            {displayRelease.credits && (
              <div className="mt-8 pt-6 border-t border-border/30">
                <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Credits</p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{displayRelease.credits}</p>
              </div>
            )}

            {/* Related store CTA */}
            <div className="mt-8 pt-6 border-t border-border/30">
              <p className="font-body text-xs text-muted-foreground text-center">
                Support the music →{' '}
                <a href="/store" className="text-primary hover:underline">Shop</a>
                {' · '}
                <a href="/back-this" className="text-primary hover:underline">Back This</a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
