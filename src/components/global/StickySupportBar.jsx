import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AUDIO_URL = "/ThankYou_Full_Master.mp3";
const VOLUME = 0.18;
const PREF_KEY = 'gw_ambient_playing';

// Custom GW heart asset (matches the designed heart)
const GW_HEART_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/094c64c87_image.png';

const MEMORIAL_PATHS = ['/mum', '/without-you-here'];

export default function StickySupportBar() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioMissing, setAudioMissing] = useState(false);
  const startedRef = useRef(false);
  const location = useLocation();
  const isMemorialPage = MEMORIAL_PATHS.includes(location.pathname);
  const isStorePage = location.pathname.startsWith('/store');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener('error', () => setAudioMissing(true));
    audio.volume = VOLUME;
    audio.muted = true;
    audio.play().then(() => {
      setPlaying(false);
      startedRef.current = true;
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handle = () => {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;
      audio.volume = VOLUME;
      audio.muted = true;
      audio.play().then(() => {setPlaying(false);startedRef.current = true;}).catch(() => {});
    };
    window.addEventListener('pointerdown', handle, { passive: true, once: true });
    return () => window.removeEventListener('pointerdown', handle);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || audioMissing) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem(PREF_KEY, 'false');
    } else {
      audio.muted = false;
      audio.volume = VOLUME;
      if (audio.paused) {
        audio.play().then(() => {setPlaying(true);localStorage.setItem(PREF_KEY, 'true');}).catch(() => {});
      } else {
        setPlaying(true);
        localStorage.setItem(PREF_KEY, 'true');
      }
    }
  };

  if (isMemorialPage || isStorePage) return null;

  return (
    <>
      {!audioMissing &&
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        loop
        preload="auto"
        style={{ display: 'none' }}
        data-song-title="Thank You"
        data-song-artist="Gannon Waye"
        data-song-feedback-source="sticky-support-audio"
        data-song-feedback-exempt="true"
      />
      }

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed left-4 right-4 top-16 z-40 mx-auto max-w-[760px] rounded-b-2xl border-x border-b border-[#d4af37]/18 bg-[#070907]/78 px-3 py-2 shadow-[0_16px_44px_rgba(0,0,0,0.32)] backdrop-blur-md">
        
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

          {/* LEFT: Audio player */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggle}
              disabled={audioMissing}
              data-song-feedback-trigger="true"
              data-song-title="Thank You"
              data-song-artist="Gannon Waye"
              data-song-feedback-source="sticky-support-player"
              aria-label={playing ? 'Pause music' : 'Play Thank You'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
              audioMissing ?
              'bg-card/50 border-border/20 text-muted-foreground/40 cursor-not-allowed' :
              playing ?
              'bg-primary border-primary text-primary-foreground' :
              'bg-card/80 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary'}`
              }>
              
              {playing && !audioMissing ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            {/* Animated bars */}
            <div className="flex items-end gap-0.5 h-3 hidden sm:flex" aria-hidden>
              {[0, 0.15, 0.3, 0.45].map((delay, i) =>
              playing && !audioMissing ?
              <motion.div key={i} className="w-0.5 bg-primary rounded-full"
              animate={{ height: ['4px', '10px', '4px'] }}
              transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }} /> :

              <div key={i} className="w-0.5 bg-muted-foreground/30 rounded-full" style={{ height: '4px' }} />

              )}
            </div>
            <span className="font-body text-[9px] tracking-widest uppercase text-muted-foreground hidden sm:block select-none">
              Thank You
            </span>
          </div>

          {/* CENTRE: charity message */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png" alt="GW Heart" className="w-6 h-6 object-contain flex-shrink-0" />
            <div>
              <p className="font-body text-xs text-foreground font-medium leading-tight">Support the "Thank You" Project</p>
              <p className="font-body text-[10px] text-muted-foreground">10% of all support → 1800RESPECT</p>
            </div>
          </div>

          {/* RIGHT: CTA buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <Link to="/impact">
              <Button variant="outline" size="sm" className="rounded-full border-primary/40 text-primary hover:bg-primary/10 font-body text-xs tracking-wider uppercase px-3 hidden sm:inline-flex h-8">
                Impact
              </Button>
            </Link>
            <Link to="/back-this">
              <Button size="sm" className="rounded-full gradient-gold-button border-0 font-body text-xs tracking-wider uppercase px-4 h-8">
                Support Now
              </Button>
            </Link>
          </div>

        </div>
      </motion.div>
    </>);

}
