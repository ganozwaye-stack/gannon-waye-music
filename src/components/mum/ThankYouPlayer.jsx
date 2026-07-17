import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { THANKYOU_FULL_AUDIO_URL } from '@/config/audioAssets';

const THANK_YOU_MP3     = THANKYOU_FULL_AUDIO_URL;
const SONIA_PORTRAIT    = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/da5efd6c2_reel1_s2_keyframe1.jpg';
const GANNON_SPOTIFY    = 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function ThankYouPlayer() {
  const audioRef   = useRef(null);
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [current,  setCurrent]  = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else         { audioRef.current.play().then(() => setPlaying(true)); }
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onUpdate  = () => { setCurrent(a.currentTime); setProgress((a.currentTime / a.duration) * 100 || 0); };
    const onLoaded  = () => setDuration(a.duration);
    const onEnded   = () => setPlaying(false);
    a.addEventListener('timeupdate',     onUpdate);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('ended',          onEnded);
    return () => {
      a.removeEventListener('timeupdate',     onUpdate);
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('ended',          onEnded);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background:     'rgba(8,12,7,0.85)',
        border:         '1px solid rgba(212,175,55,0.22)',
        backdropFilter: 'blur(24px)',
        boxShadow:      '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.06)',
      }}
    >
      <div className="flex flex-col md:flex-row">

        {/* ── Player left ── */}
        <div className="flex-1 p-6 flex items-center gap-5">

          {/* Play / Pause */}
          <button
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play Thank You'}
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{
              background:  'linear-gradient(135deg, #c9a84c 0%, #f5d06e 100%)',
              boxShadow:   playing
                ? '0 0 28px rgba(245,208,110,0.6), 0 4px 16px rgba(0,0,0,0.4)'
                : '0 0 12px rgba(212,175,55,0.3), 0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            {playing
              ? <Pause className="w-5 h-5 text-black" />
              : <Play  className="w-5 h-5 text-black ml-0.5" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <p className="font-body text-[8px] tracking-[0.5em] uppercase text-primary/35 mb-0.5">Gannon Waye</p>
            <p className="font-display text-xl md:text-2xl text-foreground/90 mb-0.5 truncate">Thank You</p>
            <p className="font-body text-[10px] text-muted-foreground/40 mb-3">
              For the ones who chose peace over toxicity. This song is for you, Mum.
            </p>

            {/* Progress bar */}
            <div
              className="h-1 rounded-full cursor-pointer overflow-hidden mb-1"
              style={{ background: 'rgba(212,175,55,0.12)' }}
              onClick={seek}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  width:      `${progress}%`,
                  background: 'linear-gradient(90deg, #c9a84c, #f5d06e)',
                  boxShadow:  playing ? '0 0 8px rgba(245,208,110,0.6)' : 'none',
                }}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-body text-[9px] text-muted-foreground/30">{fmt(current)}</span>
              <span className="font-body text-[9px] text-muted-foreground/30">{fmt(duration)}</span>
            </div>
          </div>
        </div>

        {/* ── Portrait + Spotify right ── */}
        <div className="relative w-full md:w-52 h-40 md:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={SONIA_PORTRAIT}
            alt="Sonia Katisa Waye — the inspiration"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.65) saturate(0.9)' }}
          />
          {/* Gradient over photo */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, rgba(8,12,7,0.85) 0%, transparent 55%)',
          }} />
          {/* Spotify button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
            <p className="font-body text-[8px] tracking-[0.4em] uppercase text-white/40">Listen Now</p>
            <a
              href={GANNON_SPOTIFY}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-[10px] tracking-wider font-semibold uppercase px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{
                background: '#1DB954',
                color:      'white',
                boxShadow:  '0 4px 14px rgba(29,185,84,0.35)',
              }}
            >
              {/* Spotify icon inline SVG */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={THANK_YOU_MP3}
        preload="metadata"
      />
    </motion.div>
  );
}
