import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const AUDIO_URL = "https://media.base44.com/audio/public/69eb7905ca6eb4180010f794/thank-you-chorus-1m30s-2m12s-site-loop.mp3";
const VOLUME = 0.18;
const PREF_KEY = 'gw_ambient_playing';

export default function AmbientPlayer() {
  const audioRef = useRef(null);
  const savedPref = typeof window !== 'undefined' ? localStorage.getItem(PREF_KEY) : null;
  const [playing, setPlaying] = useState(savedPref === 'false' ? false : true);
  const [tapToPlay, setTapToPlay] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const interactionFiredRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    audio.muted = false;

    if (playing) {
      audio.play().catch(() => {
        setPlaying(false);
        setTapToPlay(true);
      });
    }

    const handleError = () => setAudioError(true);
    audio.addEventListener('error', handleError);
    return () => audio.removeEventListener('error', handleError);
  }, []);

  // First-interaction fallback
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (interactionFiredRef.current) return;
      interactionFiredRef.current = true;

      const pref = localStorage.getItem(PREF_KEY);
      if (pref !== 'false') {
        const audio = audioRef.current;
        if (audio && audio.paused) {
          audio.muted = false;
          audio.volume = VOLUME;
          audio.play().then(() => {
            setPlaying(true);
            setTapToPlay(false);
          }).catch(() => {});
        }
      }

      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      setTapToPlay(false);
      localStorage.setItem(PREF_KEY, 'false');
    } else {
      // Always unmute and restore volume before playing
      audio.muted = false;
      audio.volume = VOLUME;
      audio.play().then(() => {
        setPlaying(true);
        setTapToPlay(false);
        localStorage.setItem(PREF_KEY, 'true');
      }).catch(() => {
        setTapToPlay(true);
      });
    }
  };

  // If audio asset failed to load, show honest message
  if (audioError) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        loop
        preload="auto"
        style={{ display: 'none' }}
        aria-label="Ambient background music: Thank You by Gannon Waye"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        {/* Label */}
        <div className="bg-card/90 backdrop-blur border border-border/40 rounded-full px-3 py-1.5 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
            {[0, 0.15, 0.3, 0.45].map((delay, i) => (
              playing ? (
                <motion.div
                  key={i}
                  className="w-0.5 bg-primary rounded-full"
                  animate={{ height: ['4px', '10px', '4px'] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }}
                />
              ) : (
                <div key={i} className="w-0.5 bg-muted-foreground/40 rounded-full" style={{ height: '4px' }} />
              )
            ))}
          </div>
          <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground select-none">
            {tapToPlay ? 'Tap to play' : 'Thank You — Gannon Waye'}
          </span>
        </div>

        {/* Play / Pause button */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause ambient music' : 'Play Thank You by Gannon Waye'}
          title={playing ? 'Pause' : 'Play Thank You — Gannon Waye'}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
            playing
              ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
              : 'bg-card/80 backdrop-blur border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary'
          }`}
        >
          {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </motion.div>
    </>
  );
}