import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import SingleCoverPlaque from './SingleCoverPlaque';
import { WITHOUT_YOU_HERE_FULL_AUDIO_URL } from '@/config/audioAssets';

const TRACKS = [
  {
    id: 'ave_maria',
    title: 'Ave Maria',
    subtitle: 'Gannon Waye — sung live at Sonia\'s funeral',
    src: 'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/6e65f5e12_AveMariaGannonSinging.mp3',
    soniaNote: `"When I was just a boy, I would sit by Mum's side and she would say to me — 'My boy, when I go to heaven, will you sing Ave Maria for me?' I was only young. I said yes, Mum. Years later, in the weeks before she passed, she looked at me softly and said — 'It's okay if you can't.' But I did. I sang for her. And I know she was there, listening."`,
    soniaLabel: "Sonia\u2019s request \u2014 fulfilled with love",
  },
  {
    id: 'amazing_grace',
    title: 'Amazing Grace',
    subtitle: 'Gannon Waye — acapella, at her graveside',
    src: 'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/bb1ad3db4_AmazingGraceAcaapellaGannonSinging.mp3',
    soniaNote: `"Amazing Grace was one of Sonia's most beloved hymns. It was the song we sang when we laid her to rest — her voice, her warmth, and her grace all wrapped into those timeless words. She always said it gave her peace."`,
    soniaLabel: 'Sung at her graveside — a farewell in music',
  },
];

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function TrackPlayer({ track, isAmbient }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().then(() => setPlaying(true)); }
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isAmbient) a.volume = 0.18;
    const onUpdate = () => { setCurrent(a.currentTime); setProgress((a.currentTime / a.duration) * 100 || 0); };
    const onLoaded = () => setDuration(a.duration);
    const onEnded = () => setPlaying(false);
    a.addEventListener('timeupdate', onUpdate);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onUpdate);
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('ended', onEnded);
    };
  }, [isAmbient]);

  return (
    <div className="relative">
      {/* Sonia's voice introducing the track */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mb-5 px-1"
      >
        <p className="font-body text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.35)' }}>
          ♥ {track.soniaLabel}
        </p>
        <blockquote
          className="relative pl-5 leading-relaxed"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
            color: 'rgba(245,235,210,0.62)',
            borderLeft: '2px solid rgba(212,175,55,0.22)',
          }}
        >
          {track.soniaNote}
          <span className="block mt-2 font-body not-italic text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.30)' }}>
            — Sonia Katisa Waye
          </span>
        </blockquote>
      </motion.div>

      {/* Player */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="rounded-2xl p-5 flex items-center gap-5"
        style={{
          background: 'rgba(8,12,7,0.75)',
          border: '1px solid rgba(212,175,55,0.18)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Play button */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : `Play ${track.title}`}
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #f5d06e 100%)',
            boxShadow: playing
              ? '0 0 24px rgba(245,208,110,0.55), 0 4px 14px rgba(0,0,0,0.4)'
              : '0 0 10px rgba(212,175,55,0.25)',
          }}
        >
          {playing
            ? <Pause className="w-4 h-4 text-black" />
            : <Play className="w-4 h-4 text-black ml-0.5" />
          }
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-display text-base md:text-lg text-foreground/85 truncate mb-0.5">{track.title}</p>
          <p className="font-body text-[9px] tracking-wider mb-3" style={{ color: 'rgba(212,175,55,0.38)' }}>
            {track.subtitle}
          </p>
          <div
            className="h-0.5 rounded-full cursor-pointer overflow-hidden mb-1"
            style={{ background: 'rgba(212,175,55,0.10)' }}
            onClick={seek}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #c9a84c, #f5d06e)',
                boxShadow: playing ? '0 0 6px rgba(245,208,110,0.5)' : 'none',
              }}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-body text-[8px]" style={{ color: 'rgba(212,175,55,0.25)' }}>{fmt(current)}</span>
            <span className="font-body text-[8px]" style={{ color: 'rgba(212,175,55,0.25)' }}>{fmt(duration)}</span>
          </div>
        </div>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity"
        >
          {muted
            ? <VolumeX className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.6)' }} />
            : <Volume2 className="w-4 h-4" style={{ color: 'rgba(212,175,55,0.6)' }} />
          }
        </button>
      </motion.div>

      <audio ref={audioRef} src={track.src} preload="metadata" />
    </div>
  );
}

export default function SoniaAmbientPlayer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="max-w-2xl mx-auto px-4 md:px-0"
    >
      {/* Section intro */}
      <div className="text-center mb-10">
        <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.32)' }}>
          His Voice · Her Request
        </p>
        <h3 className="font-display text-2xl md:text-3xl text-foreground/80 mb-2">
          Songs Sung for Sonia
        </h3>
        <p className="font-body text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(245,235,200,0.35)' }}>
          These recordings were made live — no studio, no rehearsal. Just love, and a promise kept.
        </p>
      </div>

      {/* Ambient note */}
      <div className="text-center mb-8">
        <p className="font-body text-[8px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.22)' }}>
          ♪ Play softly · Let them fill the room
        </p>
      </div>

      <div className="space-y-10">
        {TRACKS.map((track) => (
          <TrackPlayer key={track.id} track={track} isAmbient />
        ))}
      </div>

      {/* Without You Here release note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-12 pt-8 text-center"
        style={{ borderTop: '1px solid rgba(212,175,55,0.10)' }}
      >
        <p className="font-body text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.28)' }}>
          Written for her
        </p>
        <div className="mb-5 flex justify-center">
          <SingleCoverPlaque size="sm" />
        </div>
        <p className="font-display italic text-lg md:text-xl mb-1" style={{ color: 'rgba(245,235,210,0.55)' }}>
          Without You Here
        </p>
        <p className="font-body text-xs mb-4" style={{ color: 'rgba(212,175,55,0.30)' }}>
          Gannon Waye — Original Song
        </p>
        <div
          className="mx-auto mb-5 max-w-md rounded-2xl p-4"
          style={{
            background: 'rgba(8,12,7,0.72)',
            border: '1px solid rgba(212,175,55,0.18)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <p className="font-body text-[8px] tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.32)' }}>
            Full studio master
          </p>
          <audio
            src={WITHOUT_YOU_HERE_FULL_AUDIO_URL}
            controls
            preload="metadata"
            className="w-full"
            aria-label="Play Without You Here by Gannon Waye"
          />
        </div>
        <a
          href="https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-[10px] tracking-wider font-semibold uppercase px-5 py-2 rounded-full transition-all hover:scale-105"
          style={{
            background: '#1DB954',
            color: 'white',
            boxShadow: '0 4px 14px rgba(29,185,84,0.3)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Stream on Spotify
        </a>
        <p className="font-body text-[9px] mt-5 italic" style={{ color: 'rgba(212,175,55,0.22)' }}>
          You're My Mum — coming soon · Written 2016, reborn for her
        </p>
      </motion.div>
    </motion.div>
  );
}
