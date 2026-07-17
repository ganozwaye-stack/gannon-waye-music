import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { THANKYOU_FULL_AUDIO_URL, THANKYOU_HOME_PLAYER_START_SECONDS } from '@/config/audioAssets';

const AUDIO_URL = THANKYOU_FULL_AUDIO_URL;
const AUDIO_SRC = `${AUDIO_URL}#t=${THANKYOU_HOME_PLAYER_START_SECONDS}`;
const VOLUME = 0.18;
const PREF_KEY = 'gw_ambient_playing';

function cueThankyouSegment(audio) {
  if (!audio || audio.readyState === 0) return;
  if (audio.duration > THANKYOU_HOME_PLAYER_START_SECONDS && (audio.currentTime < THANKYOU_HOME_PLAYER_START_SECONDS || audio.ended)) {
    audio.currentTime = THANKYOU_HOME_PLAYER_START_SECONDS;
  }
}

export default function AmbientPlayer() {
  const audioRef = useRef(null);
  const savedPref = typeof window !== 'undefined' ? localStorage.getItem(PREF_KEY) : null;
  const [playing, setPlaying] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);
  const [tapToPlay, setTapToPlay] = useState(savedPref !== 'false');
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleError = () => setAudioMissing(true);
    const handleLoadedMetadata = () => cueThankyouSegment(audio);
    const handleEnded = () => {
      cueThankyouSegment(audio);
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Always muted autoplay (browser-safe), volume pre-set for when unmuted
    audio.volume = VOLUME;
    audio.muted = true;
    cueThankyouSegment(audio);
    audio.play().then(() => {
      setPlaying(true);
      startedRef.current = true;
    }).catch(() => {
      // Autoplay blocked entirely — show tap to play
    });

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // First-interaction: start audio if not yet started
  useEffect(() => {
    const handleFirstInteraction = () => {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;
      audio.volume = VOLUME;
      audio.muted = true;
      cueThankyouSegment(audio);
      audio.play().then(() => {
        setPlaying(true);
        startedRef.current = true;
        setTapToPlay(false);
      }).catch(() => {});
    };
    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true, once: true });
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      // Pause
      audio.pause();
      setPlaying(false);
      setTapToPlay(false);
      localStorage.setItem(PREF_KEY, 'false');
    } else {
      // Play / unmute
      audio.muted = false;
      audio.volume = VOLUME;
      setTapToPlay(false);
      cueThankyouSegment(audio);

      if (audio.paused) {
        audio.play().then(() => {
          setPlaying(true);
          localStorage.setItem(PREF_KEY, 'true');
        }).catch(() => {
          setTapToPlay(true);
        });
      } else {
        // Was muted-playing — just unmute
        setPlaying(true);
        localStorage.setItem(PREF_KEY, 'true');
      }
    }
  };

  const statusText = audioMissing
    ? 'Audio track not uploaded yet'
    : tapToPlay && !playing
      ? 'Tap to play'
      : 'Thank You — Gannon Waye';

  return (
    <>
      {!audioMissing && (
        <audio
          ref={audioRef}
          src={AUDIO_SRC}
          preload="auto"
          style={{ display: 'none' }}
          aria-label="Ambient background music: Thank You by Gannon Waye"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      >
        <div className="bg-card/90 backdrop-blur border border-border/40 rounded-full px-3 py-1.5 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
            {[0, 0.15, 0.3, 0.45].map((delay, i) => (
              playing && !audioMissing ? (
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
            {statusText}
          </span>
        </div>

        <button
          onClick={audioMissing ? undefined : toggle}
          disabled={audioMissing}
          aria-label={playing ? 'Pause ambient music' : 'Play Thank You by Gannon Waye'}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
            audioMissing
              ? 'bg-card/50 border-border/20 text-muted-foreground/40 cursor-not-allowed'
              : playing
                ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-card/80 backdrop-blur border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary'
          }`}
        >
          {playing && !audioMissing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </motion.div>
    </>
  );
}
