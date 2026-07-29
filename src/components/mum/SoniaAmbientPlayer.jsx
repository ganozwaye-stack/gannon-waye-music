import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import SingleCoverPlaque from './SingleCoverPlaque';
import { WITHOUT_YOU_HERE_PREVIEW } from '@/constants/musicAssets';

const TRACKS = [
  {
    id: 'ave_maria',
    title: 'Ave Maria',
    subtitle: 'Gannon Waye - sung live at Sonia\'s funeral',
    src: 'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/6e65f5e12_AveMariaGannonSinging.mp3',
    soniaNote: `"When I was just a boy, I would sit by Mum's side and she would say to me - 'My boy, when I go to heaven, will you sing Ave Maria for me?' I was only young. I said yes, Mum. Years later, in the weeks before she passed, she looked at me softly and said - 'It's okay if you can't.' But I did. I sang for her. And I know she was there, listening."`,
    soniaLabel: "Sonia\u2019s request \u2014 fulfilled with love",
  },
  {
    id: 'amazing_grace',
    title: 'Amazing Grace',
    subtitle: 'Gannon Waye - acapella, at her graveside',
    src: 'https://media.base44.com/files/public/69eb7905ca6eb4180010f794/bb1ad3db4_AmazingGraceAcaapellaGannonSinging.mp3',
    soniaNote: `"Amazing Grace was one of Sonia's most beloved hymns. It was the song we sang when we laid her to rest - her voice, her warmth, and her grace all wrapped into those timeless words. She always said it gave her peace."`,
    soniaLabel: 'Sung at her graveside - a farewell in music',
  },
];

const SONIA_VOICE_TRACKS = [
  {
    id: 'happy_birthday',
    title: 'Mum Singing Happy Birthday',
    subtitle: 'Sonia Katisa Waye — voicemail recording',
    src: '/audio/mum/happy_birthday.m4a',
    soniaNote: `"This is a recording of Mum singing Happy Birthday. When I hear it, it brings back her laughter, her warmth, and that cheeky, beautiful spark. She was always singing, always celebrating the people she loved."`,
    soniaLabel: "Sonia's voice — singing Happy Birthday",
  },
  {
    id: 'voicemail',
    title: "Mum's Voicemail",
    subtitle: 'Sonia Katisa Waye — voicemail message',
    src: '/audio/mum/voicemail.m4a',
    soniaNote: `"A voicemail from Mum, left during one of her quiet check-ins. Just her voice, talking about the simple things, asking how I was. A quiet reminder that she is always with us in spirit."`,
    soniaLabel: 'A message left in love',
  },
  {
    id: 'horsham',
    title: 'Greetings from Horsham',
    subtitle: 'Sonia Katisa Waye — voicemail message',
    src: '/audio/mum/horsham.m4a',
    soniaNote: `"Sonia checking in from Horsham. A sweet, quiet greeting that keeps her voice alive in our hearts."`,
    soniaLabel: "Sonia's voice — checking in",
  },
  {
    id: 'mumma',
    title: 'Mumma Voice Note',
    subtitle: 'Sonia Katisa Waye — voice note',
    src: '/audio/mum/mumma.m4a',
    soniaNote: `"Mumma's gentle voice note — keeping her warmth, love and presence close."`,
    soniaLabel: "Sonia's voice note",
  },
];

const WITHOUT_YOU_HERE_CLIP_START_SECONDS = 3 * 60 + 46;
const WITHOUT_YOU_HERE_CLIP_END_SECONDS = 4 * 60 + 35;
const WITHOUT_YOU_HERE_PREVIEW_DURATION_SECONDS = WITHOUT_YOU_HERE_CLIP_END_SECONDS - WITHOUT_YOU_HERE_CLIP_START_SECONDS;

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
          {track.soniaLabel}
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
            - Sonia Katisa Waye
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
          data-song-feedback-trigger="true"
          data-song-title={track.title}
          data-song-artist="Gannon Waye"
          data-song-feedback-source="sonia-garden-track-button"
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #d8c071 100%)',
            boxShadow: playing
              ? '0 0 24px rgba(216,192,113,0.55), 0 4px 14px rgba(0,0,0,0.4)'
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
                background: 'linear-gradient(90deg, #c9a84c, #d8c071)',
                boxShadow: playing ? '0 0 6px rgba(216,192,113,0.5)' : 'none',
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

      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        data-song-title={track.title}
        data-song-artist="Gannon Waye"
        data-song-feedback-source="sonia-garden-track-audio"
        data-song-feedback-exempt="true"
      />
    </div>
  );
}

export function WithoutYouHereClipPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const clipDuration = WITHOUT_YOU_HERE_PREVIEW_DURATION_SECONDS;
  const progress = Math.max(
    0,
    Math.min(100, (current / clipDuration) * 100)
  );

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (audio.currentTime >= clipDuration) {
      audio.currentTime = 0;
    }

    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * clipDuration;
    setCurrent(audio.currentTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrent(audio.currentTime);
      if (audio.currentTime >= clipDuration) {
        audio.pause();
        audio.currentTime = 0;
        setCurrent(0);
        setPlaying(false);
      }
    };
    const handleEnded = () => {
      audio.currentTime = 0;
      setCurrent(0);
      setPlaying(false);
    };

    audio.volume = 0.85;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [clipDuration]);

  return (
    <div
      className="mx-auto mb-5 max-w-md rounded-2xl p-4 text-left"
      style={{
        background: 'rgba(8,12,7,0.78)',
        border: '1px solid rgba(212,175,55,0.24)',
        boxShadow: '0 0 36px rgba(212,175,55,0.10)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <p className="font-body text-[8px] tracking-[0.35em] uppercase mb-4 text-center" style={{ color: 'rgba(212,175,55,0.35)' }}>
        Internal preview - 3:46 to 4:35
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause Without You Here preview' : 'Play Without You Here preview from 3:46 to 4:35'}
          className="flex h-[52px] w-[52px] min-h-[52px] min-w-[52px] items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #d8c071 100%)',
            boxShadow: playing ? '0 0 30px rgba(216,192,113,0.52)' : '0 0 14px rgba(212,175,55,0.25)',
          }}
        >
          {playing ? <Pause className="h-5 w-5 text-black" /> : <Play className="ml-0.5 h-5 w-5 text-black" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="font-display text-lg italic text-foreground/85 leading-tight">Without You Here</p>
          <p className="font-body text-[10px] tracking-[0.22em] uppercase mt-1 mb-3" style={{ color: 'rgba(212,175,55,0.42)' }}>
            bridge preview
          </p>
          <button
            type="button"
            onClick={seek}
            className="h-2 w-full overflow-hidden rounded-full text-left"
            style={{ background: 'rgba(212,175,55,0.12)' }}
            aria-label="Seek Without You Here preview clip"
          >
            <span
              className="block h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #c9a84c, #d8c071)',
                boxShadow: playing ? '0 0 10px rgba(216,192,113,0.55)' : 'none',
              }}
            />
          </button>
          <div className="mt-2 flex justify-between font-body text-[9px]" style={{ color: 'rgba(212,175,55,0.32)' }}>
            <span>{fmt(WITHOUT_YOU_HERE_CLIP_START_SECONDS + current)}</span>
            <span>{fmt(WITHOUT_YOU_HERE_CLIP_END_SECONDS)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute Without You Here preview' : 'Mute Without You Here preview'}
          className="shrink-0 opacity-45 transition-opacity hover:opacity-80"
        >
          {muted
            ? <VolumeX className="h-4 w-4" style={{ color: 'rgba(212,175,55,0.70)' }} />
            : <Volume2 className="h-4 w-4" style={{ color: 'rgba(212,175,55,0.70)' }} />
          }
        </button>
      </div>

      <audio
        ref={audioRef}
        src={WITHOUT_YOU_HERE_PREVIEW}
        preload="metadata"
        data-song-title="Without You Here"
        data-song-artist="Gannon Waye"
        data-song-feedback-source="sonia-garden-without-you-here-preview"
        data-song-feedback-exempt="true"
      />
    </div>
  );
}

export function WithoutYouHereFeature({ compact = false }) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.35 }}
      className={`w-full ${compact ? 'max-w-xl' : 'max-w-2xl'} mx-auto`}
    >
      <div
        className="rounded-[28px] p-4 md:p-6"
        style={{
          background: 'linear-gradient(145deg, rgba(6,9,7,0.82), rgba(18,13,7,0.72))',
          border: '1px solid rgba(212,175,55,0.20)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.42), 0 0 42px rgba(212,175,55,0.10)',
          backdropFilter: 'blur(22px)',
        }}
      >
        <p className="font-body text-[8px] tracking-[0.44em] uppercase text-primary/40 text-center mb-4">
          Written for her
        </p>
        <div className="grid gap-5 md:grid-cols-[150px_minmax(0,1fr)] md:items-center">
          <SingleCoverPlaque size="sm" />
          <div className="text-center md:text-left">
            <div className="mb-4 md:hidden">
              <WithoutYouHereClipPlayer />
            </div>
            <p className="font-display italic text-2xl md:text-3xl text-foreground/90 leading-none mb-2">
              Without You Here
            </p>
            <p className="font-body text-[10px] tracking-[0.24em] uppercase text-primary/40 mb-3">
              Gannon Waye - original song
            </p>
            <div className="mt-4 hidden md:block">
              <WithoutYouHereClipPlayer />
            </div>
          </div>
        </div>
        <p className="font-display mt-4 text-center text-lg italic leading-snug text-foreground/70 md:text-left">
          "Your last breath took mine away. There's not much more I have to say."
        </p>
        <div className="text-center">
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
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white" aria-hidden>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Stream on Spotify
          </a>
        </div>
        <p className="font-body text-[9px] mt-5 text-center italic" style={{ color: 'rgba(212,175,55,0.26)' }}>
          Internal preview plays 3:46 to 4:35.
        </p>
      </div>
    </motion.aside>
  );
}

export default function SoniaAmbientPlayer({ showWithoutYouHere = true } = {}) {
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
          His Voice - Her Request
        </p>
        <h3 className="font-display text-2xl md:text-3xl text-foreground/80 mb-2">
          Songs Sung for Sonia
        </h3>
        <p className="font-body text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(245,235,200,0.35)' }}>
          These recordings were made live - no studio, no rehearsal. Just love, and a promise kept.
        </p>
      </div>

      {/* Ambient note */}
      <div className="text-center mb-8">
        <p className="font-body text-[8px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.22)' }}>
          Play softly - Let them fill the room
        </p>
      </div>

      <div className="space-y-10">
        {TRACKS.map((track) => (
          <TrackPlayer key={track.id} track={track} isAmbient />
        ))}
      </div>

      {/* Sonia's Voicemails & Voice Notes Section */}
      <div className="text-center mt-16 mb-8">
        <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.32)' }}>
          Her Voice · Real Recordings
        </p>
        <h3 className="font-display text-2xl md:text-3xl text-foreground/80 mb-2">
          Sonia’s Voicemails & Voice Notes
        </h3>
        <p className="font-body text-xs max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(245,235,200,0.35)' }}>
          Original voicemail recordings and voice notes left by Sonia, preserved exactly as she recorded them to keep her laughter, singing and warmth alive.
        </p>
      </div>

      <div className="space-y-10">
        {SONIA_VOICE_TRACKS.map((track) => (
          <TrackPlayer key={track.id} track={track} isAmbient={false} />
        ))}
      </div>

      {/* Without You Here release note */}
      {showWithoutYouHere && (
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
          Gannon Waye - Original Song
        </p>
        <WithoutYouHereClipPlayer />
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
          You're My Mum - coming soon - Written 2016, reborn for her
        </p>
      </motion.div>
      )}
    </motion.div>
  );
}
