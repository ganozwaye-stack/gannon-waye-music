import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const SongFeedbackContext = createContext({
  requestSongFeedback: async () => true,
});

const REQUIRED_COPY = {
  rating: 'Please rate the song out of 5.',
  favouriteThing: 'Please tell me your favourite thing about the song.',
  inspiration: "Please share what inspires you about Gannon's music and story.",
};

const slug = (value = 'gannon-waye-music') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'gannon-waye-music';

const getSessionKey = (songTitle) => `gwm-song-feedback-submitted:${slug(songTitle)}`;

const isSpotifyHref = (href = '') => {
  try {
    const url = new URL(href, window.location.origin);
    return url.hostname === 'spotify.com' || url.hostname.endsWith('.spotify.com');
  } catch {
    return false;
  }
};

const getTriggerContext = (element) => {
  const trigger = element?.closest?.('[data-song-feedback-trigger="true"], a, button, [role="button"], audio, video');
  if (
    !trigger ||
    trigger.closest('[data-song-feedback-dialog="true"]') ||
    trigger.closest('[data-song-feedback-exempt="true"]')
  ) return null;

  const tagName = trigger.tagName?.toLowerCase();
  const href = trigger.getAttribute?.('href') || '';
  const label = [
    trigger.getAttribute?.('aria-label'),
    trigger.getAttribute?.('title'),
    trigger.dataset?.songTitle,
    trigger.textContent,
    href,
  ].filter(Boolean).join(' ').toLowerCase();

  const isExplicit = trigger.dataset?.songFeedbackTrigger === 'true';
  const isSpotifyLink = isSpotifyHref(href);
  const looksLikeListenAction = /\b(play|stream|listen|spotify|preview)\b/.test(label) || isSpotifyLink;
  const looksLikeAdminTool = /\bplaywright\b/.test(label);

  if (!isExplicit && (!looksLikeListenAction || looksLikeAdminTool)) return null;

  return {
    element: trigger,
    songTitle: trigger.dataset?.songTitle || 'Gannon Waye Music',
    artist: trigger.dataset?.songArtist || 'Gannon Waye',
    source: trigger.dataset?.songFeedbackSource || tagName || 'site-play-action',
  };
};

const getMediaContext = (mediaElement) => {
  if (!mediaElement || mediaElement.dataset?.songFeedbackExempt === 'true') return null;
  if (mediaElement.muted || Number(mediaElement.volume) === 0) return null;

  return {
    element: mediaElement,
    songTitle: mediaElement.dataset?.songTitle || mediaElement.getAttribute('aria-label') || 'Gannon Waye Music',
    artist: mediaElement.dataset?.songArtist || 'Gannon Waye',
    source: mediaElement.dataset?.songFeedbackSource || 'native-media-play',
  };
};

function getStoredFeedback() {
  try {
    return JSON.parse(localStorage.getItem('gwm-song-feedback-submissions') || '[]');
  } catch {
    return [];
  }
}

function storeFallbackFeedback(payload) {
  const stored = getStoredFeedback();
  stored.unshift(payload);
  localStorage.setItem('gwm-song-feedback-submissions', JSON.stringify(stored.slice(0, 100)));
}

export function useSongFeedback() {
  return React.useContext(SongFeedbackContext);
}

export default function SongFeedbackProvider({ children }) {
  const location = useLocation();
  const { toast } = useToast();
  const pendingResolve = useRef(null);
  const pendingAction = useRef(null);
  const pendingApprovedAction = useRef(null);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [context, setContext] = useState(null);
  const [form, setForm] = useState({
    rating: 0,
    favouriteThing: '',
    inspiration: '',
    name: '',
    email: '',
    subscribe: false,
  });

  const resetForm = useCallback(() => {
    setForm({
      rating: 0,
      favouriteThing: '',
      inspiration: '',
      name: '',
      email: '',
      subscribe: false,
    });
  }, []);

  const requestSongFeedback = useCallback((playContext = {}) => {
    const songTitle = playContext.songTitle || 'Gannon Waye Music';
    const sessionKey = getSessionKey(songTitle);

    if (sessionStorage.getItem(sessionKey) === 'true') {
      playContext.onApproved?.();
      return Promise.resolve(true);
    }

    setContext({
      songTitle,
      artist: playContext.artist || 'Gannon Waye',
      source: playContext.source || 'manual-request',
    });
    pendingApprovedAction.current = typeof playContext.onApproved === 'function' ? playContext.onApproved : null;
    resetForm();
    setOpen(true);

    return new Promise((resolve) => {
      pendingResolve.current = resolve;
    });
  }, [resetForm]);

  const completePending = useCallback((allowed) => {
    if (pendingResolve.current) {
      pendingResolve.current(allowed);
      pendingResolve.current = null;
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return undefined;

    const handleClick = (event) => {
      if (open) return;
      const triggerContext = getTriggerContext(event.target);
      if (!triggerContext) return;

      const sessionKey = getSessionKey(triggerContext.songTitle);
      if (sessionStorage.getItem(sessionKey) === 'true') return;

      event.preventDefault();
      event.stopPropagation();
      pendingAction.current = () => {
        setTimeout(() => triggerContext.element.click(), 25);
      };
      requestSongFeedback(triggerContext);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [location.pathname, open, requestSongFeedback]);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return undefined;

    const handlePlay = (event) => {
      if (open) return;
      const mediaContext = getMediaContext(event.target);
      if (!mediaContext) return;

      const sessionKey = getSessionKey(mediaContext.songTitle);
      if (sessionStorage.getItem(sessionKey) === 'true') return;

      event.target.pause();
      pendingAction.current = () => {
        setTimeout(() => event.target.play().catch(() => {}), 25);
      };
      requestSongFeedback(mediaContext);
    };

    document.addEventListener('play', handlePlay, true);
    return () => document.removeEventListener('play', handlePlay, true);
  }, [location.pathname, open, requestSongFeedback]);

  const errors = useMemo(() => {
    const next = {};
    if (!form.rating) next.rating = REQUIRED_COPY.rating;
    if (!form.favouriteThing.trim()) next.favouriteThing = REQUIRED_COPY.favouriteThing;
    if (!form.inspiration.trim()) next.inspiration = REQUIRED_COPY.inspiration;
    if (form.subscribe && !form.email.trim()) next.email = 'Please add your email to subscribe.';
    return next;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || !context) return;

    const payload = {
      song_title: context.songTitle,
      artist: context.artist,
      rating: form.rating,
      favourite_thing: form.favouriteThing.trim(),
      inspiration: form.inspiration.trim(),
      submitter_name: form.name.trim(),
      submitter_email: form.email.trim(),
      subscribe_requested: Boolean(form.subscribe && form.email.trim()),
      source: context.source,
      route: location.pathname,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    setSubmitting(true);
    const sessionKey = getSessionKey(context.songTitle);
    const resumeAction = pendingApprovedAction.current || pendingAction.current;
    pendingApprovedAction.current = null;
    pendingAction.current = null;

    storeFallbackFeedback(payload);
    sessionStorage.setItem(sessionKey, 'true');
    setOpen(false);
    completePending(true);

    try {
      await resumeAction?.();
    } catch {
      // Some browsers may still block audio; the visible player remains clickable.
    }

    try {
      await base44.entities.SongFeedback.create(payload);

      if (payload.subscribe_requested) {
        await base44.entities.EmailSubscriber.create({
          name: payload.submitter_name || 'Music listener',
          email: payload.submitter_email,
          source: 'song_feedback_popup',
          how_found: 'Song feedback after listening',
          consent_marketing: true,
          feedback_song_title: payload.song_title,
        });
      }

      toast({
        title: 'Thank you for listening',
        description: 'Your feedback has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Feedback saved locally',
        description: 'It will still be available from this preview device.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen) => {
    if (submitting) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      pendingAction.current = null;
      pendingApprovedAction.current = null;
      completePending(false);
    }
  };

  return (
    <SongFeedbackContext.Provider value={{ requestSongFeedback }}>
      {children}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          data-song-feedback-dialog="true"
          className="max-h-[92svh] overflow-y-auto border-[#d4af37]/28 bg-[#070907]/96 text-[#fff7df] shadow-[0_28px_120px_rgba(0,0,0,0.72),0_0_50px_rgba(212,175,55,0.16)] sm:max-w-2xl"
        >
          <DialogHeader>
            <p className="font-body text-[10px] uppercase tracking-[0.36em] text-[#d4af37]/82">Before you listen</p>
            <DialogTitle className="font-display text-3xl italic text-[#fff7df]">
              Tell Gannon what lands.
            </DialogTitle>
            <DialogDescription className="font-body text-sm leading-6 text-[#fff7df]/62">
              Three quick answers. It helps shape the release, the story, and the way the music reaches the right people.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-lg border border-[#d4af37]/18 bg-black/24 p-4">
              <p className="font-body text-[10px] uppercase tracking-[0.26em] text-[#d4af37]/70">Listening to</p>
              <p className="mt-1 font-display text-xl italic text-[#fff7df]">{context?.songTitle || 'Gannon Waye Music'}</p>
              <p className="mt-1 font-body text-[10px] uppercase tracking-[0.22em] text-[#fff7df]/48">{context?.artist || 'Gannon Waye'}</p>
            </div>

            <div>
              <Label className="font-body text-xs uppercase tracking-[0.2em] text-[#d4af37]/82">
                1. Rating out of 5 *
              </Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, rating }))}
                    className={`flex h-11 min-w-12 items-center justify-center gap-1 rounded-full border px-4 font-body text-sm transition ${
                      form.rating >= rating
                        ? 'border-[#f5d06e]/70 bg-[#d4af37]/18 text-[#ffe08a]'
                        : 'border-[#fff7df]/12 bg-black/18 text-[#fff7df]/52 hover:border-[#d4af37]/44 hover:text-[#f5d06e]'
                    }`}
                    aria-label={`Rate ${rating} out of 5`}
                  >
                    <Star className={`h-4 w-4 ${form.rating >= rating ? 'fill-current' : ''}`} />
                    {rating}
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-2 font-body text-xs text-red-300">{errors.rating}</p>}
            </div>

            <div>
              <Label htmlFor="song-feedback-favourite" className="font-body text-xs uppercase tracking-[0.2em] text-[#d4af37]/82">
                2. What is your favourite thing about the song? *
              </Label>
              <Textarea
                id="song-feedback-favourite"
                value={form.favouriteThing}
                onChange={(event) => setForm((current) => ({ ...current, favouriteThing: event.target.value }))}
                placeholder="A lyric, the vocal, the feeling, the story..."
                className="mt-3 min-h-24 border-[#fff7df]/14 bg-black/18 text-[#fff7df] placeholder:text-[#fff7df]/30 focus-visible:ring-[#d4af37]/60"
              />
              {errors.favouriteThing && <p className="mt-2 font-body text-xs text-red-300">{errors.favouriteThing}</p>}
            </div>

            <div>
              <Label htmlFor="song-feedback-inspiration" className="font-body text-xs uppercase tracking-[0.2em] text-[#d4af37]/82">
                3. What inspires you about Gannon's music and story? *
              </Label>
              <Textarea
                id="song-feedback-inspiration"
                value={form.inspiration}
                onChange={(event) => setForm((current) => ({ ...current, inspiration: event.target.value }))}
                placeholder="What do you connect with? What makes you want to follow the journey?"
                className="mt-3 min-h-24 border-[#fff7df]/14 bg-black/18 text-[#fff7df] placeholder:text-[#fff7df]/30 focus-visible:ring-[#d4af37]/60"
              />
              {errors.inspiration && <p className="mt-2 font-body text-xs text-red-300">{errors.inspiration}</p>}
            </div>

            <div className="rounded-lg border border-[#d4af37]/16 bg-[#d4af37]/6 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="song-feedback-name" className="font-body text-xs uppercase tracking-[0.18em] text-[#fff7df]/54">Name</Label>
                  <Input
                    id="song-feedback-name"
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Optional"
                    className="mt-2 border-[#fff7df]/14 bg-black/18 text-[#fff7df] placeholder:text-[#fff7df]/30"
                  />
                </div>
                <div>
                  <Label htmlFor="song-feedback-email" className="font-body text-xs uppercase tracking-[0.18em] text-[#fff7df]/54">Email</Label>
                  <Input
                    id="song-feedback-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Optional unless subscribing"
                    className="mt-2 border-[#fff7df]/14 bg-black/18 text-[#fff7df] placeholder:text-[#fff7df]/30"
                  />
                  {errors.email && <p className="mt-2 font-body text-xs text-red-300">{errors.email}</p>}
                </div>
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.subscribe}
                  onChange={(event) => setForm((current) => ({ ...current, subscribe: event.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-[#d4af37]/50 bg-black accent-[#d4af37]"
                />
                <span className="font-body text-xs leading-5 text-[#fff7df]/62">
                  Keep me in the loop with new music, release notes, and the story behind the songs. Unsubscribe anytime.
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#fff7df]/14 px-5 py-3 font-body text-xs uppercase tracking-[0.2em] text-[#fff7df]/60 transition hover:border-[#fff7df]/32 hover:text-[#fff7df]"
              >
                <X className="h-4 w-4" /> Not now
              </button>
              <Button
                type="submit"
                disabled={!canSubmit || submitting}
                className="rounded-full border-0 bg-[linear-gradient(135deg,#caa647,#f8dc82)] px-7 py-6 font-body text-xs uppercase tracking-[0.2em] text-[#071007] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? 'Saving...' : 'Submit and listen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </SongFeedbackContext.Provider>
  );
}
