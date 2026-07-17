import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { THANKYOU_FULL_AUDIO_URL, THANKYOU_HOME_PLAYER_START_SECONDS } from '@/config/audioAssets';

const AUDIO_URL = THANKYOU_FULL_AUDIO_URL;
const AUDIO_SRC = `${AUDIO_URL}#t=${THANKYOU_HOME_PLAYER_START_SECONDS}`;
const VOLUME = 0.18;
const PREF_KEY = 'gw_ambient_playing';

// Custom GW heart asset (matches the designed heart)
const GW_HEART_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/094c64c87_image.png';

const MEMORIAL_PATHS = ['/mum', '/without-you-here'];
const BAR_GOLD = 'linear-gradient(180deg, #d8c071 0%, #b8913b 52%, #7f6125 100%)';

function cueThankyouSegment(audio) {
  if (!audio || audio.readyState === 0) return;
  if (audio.duration > THANKYOU_HOME_PLAYER_START_SECONDS && (audio.currentTime < THANKYOU_HOME_PLAYER_START_SECONDS || audio.ended)) {
    audio.currentTime = THANKYOU_HOME_PLAYER_START_SECONDS;
  }
}

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
    const handleError = () => setAudioMissing(true);
    const handleLoadedMetadata = () => cueThankyouSegment(audio);
    const handleEnded = () => {
      cueThankyouSegment(audio);
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.volume = VOLUME;
    audio.muted = true;
    cueThankyouSegment(audio);
    audio.play().then(() => {
      setPlaying(true);
      startedRef.current = true;
    }).catch(() => {});

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;
      audio.volume = VOLUME;
      audio.muted = true;
      cueThankyouSegment(audio);
      audio.play().then(() => {setPlaying(true);startedRef.current = true;}).catch(() => {});
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
      cueThankyouSegment(audio);
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
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" style={{ display: 'none' }} />
      }

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/40 px-4 py-2.5 z-50">
        
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">

          {/* LEFT: Audio player */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggle}
              disabled={audioMissing}
              aria-label={playing ? 'Pause music' : 'Play Thank You'}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
              audioMissing ?
              'bg-card/50 border-border/20 text-muted-foreground/40 cursor-not-allowed' :
              playing ?
              'gradient-gold-button border-primary/60 text-primary-foreground shadow-[0_0_18px_rgba(184,145,59,0.35)]' :
              'bg-card/80 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary'}`
              }>
              
              {playing && !audioMissing ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            {/* Animated bars */}
            <div className="flex items-end gap-0.5 h-3 hidden sm:flex" aria-hidden>
              {[0, 0.15, 0.3, 0.45].map((delay, i) =>
              playing && !audioMissing ?
              <motion.div key={i} className="w-0.5 rounded-full"
              style={{ background: BAR_GOLD, boxShadow: '0 0 6px rgba(184,145,59,0.35)' }}
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
