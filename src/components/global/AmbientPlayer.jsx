import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🎵 Replace this URL with the actual "Thank You" audio file when ready
const AUDIO_URL = "https://media.base44.com/.../thank-you-chorus-1m30s-2m12s-site-loop.mp3";

export default function AmbientPlayer() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef(null);

  // Don't render if no audio URL is set yet
  if (!AUDIO_URL) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(p => !p);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          >
            <AnimatePresence>
              {playing && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-card/90 backdrop-blur border border-border/40 rounded-full px-3 py-1.5 flex items-center gap-2"
                >
                  {/* Animated waveform bars */}
                  <div className="flex items-end gap-0.5 h-3">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-primary rounded-full"
                        animate={{ height: ['4px', '10px', '4px'] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                  <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
                    Thank You
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={toggle}
              title={playing ? 'Mute ambient music' : 'Play ambient music'}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                playing
                  ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card/80 backdrop-blur border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary'
              }`}
            >
              {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}