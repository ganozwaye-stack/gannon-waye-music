import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, SkipBack, SkipForward, Volume2, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CinematicLyricsPlayer({ release, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const lyricsContainerRef = useRef(null);
  
  // Split lyrics into lines
  const rawLines = release.lyrics?.split('\n') || [];
  
  // Group lyrics into cinematic "chapters" for interactive navigation
  const getChapters = (title) => {
    if (title.toLowerCase().includes('thank')) {
      return [
        { id: 0, title: 'Cold Grace', range: [0, 8], description: 'Ocean crossings and entitlement' },
        { id: 1, title: 'Dancing in the Fire', range: [9, 18], description: 'Arrogance exposed, finding freedom' },
        { id: 2, title: 'The Warmth Behind', range: [19, 28], description: 'Family holidays and holiday grace' },
        { id: 3, title: 'Chaos to Champagne', range: [29, 45], description: 'Breaking chains, raising a glass' },
      ];
    }
    return [
      { id: 0, title: 'Introduction', range: [0, Math.floor(rawLines.length / 3)], description: 'Opening verses' },
      { id: 1, title: 'The Core Storm', range: [Math.floor(rawLines.length / 3) + 1, Math.floor(rawLines.length * 2 / 3)], description: 'Rising emotions' },
      { id: 2, title: 'Rebuilding', range: [Math.floor(rawLines.length * 2 / 3) + 1, rawLines.length - 1], description: 'Resolution & strength' },
    ];
  };

  const chapters = getChapters(release.title);

  // Scroll to a specific chapter range in the lyrics panel
  const scrollToChapter = (chapter) => {
    setActiveSection(chapter.id);
    const container = lyricsContainerRef.current;
    if (!container) return;

    // Find the element representing the start line
    const targetElement = document.getElementById(`lyric-line-${chapter.range[0]}`);
    if (targetElement) {
      container.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Simulate audio track progress when "playing"
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0c10] text-[#f4eedb] overflow-hidden flex flex-col md:flex-row">
      {/* Floating Gold Particles System */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 opacity-20 filter blur-[1px] animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 6 + 4}s`,
              animationDelay: `${Math.random() * 3}s`,
              transform: `translateY(${Math.random() * 50}px)`
            }}
          />
        ))}
        {/* Cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      </div>

      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-black/40 border border-[#c9a84c]/20 hover:border-[#c9a84c]/60 hover:bg-black/80 transition-all text-[#c9a84c]"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Left panel: Media Controller & Chapter Navigation */}
      <div className="w-full md:w-[350px] bg-black/60 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col justify-between relative z-10 shrink-0 select-none backdrop-blur-md">
        <div className="space-y-8">
          {/* Header & Artwork */}
          <div className="flex items-center gap-4">
            {release.artwork_url ? (
              <img src={release.artwork_url} alt={release.title} className="w-14 h-14 rounded-lg object-cover border border-[#c9a84c]/30 shadow-md shadow-[#c9a84c]/5" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]">
                <Compass className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="font-display text-xl text-white font-semibold line-clamp-1">{release.title}</h2>
              <p className="font-body text-xs text-[#c9a84c] tracking-widest uppercase mt-0.5">{release.type}</p>
            </div>
          </div>

          {/* Interactive Chapters links */}
          <div className="space-y-4 pt-4">
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" /> Narrative Chapters
            </p>
            <div className="space-y-2.5">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(chapter)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    activeSection === chapter.id
                      ? 'bg-[#c9a84c]/10 border-[#c9a84c]/50 text-white shadow-md shadow-[#c9a84c]/5'
                      : 'bg-[#15161c]/30 border-white/5 text-muted-foreground hover:border-white/15'
                  }`}
                >
                  <span className="font-display text-sm font-semibold block">{chapter.title}</span>
                  <span className="text-[10px] opacity-70 leading-normal">{chapter.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Music Player Mock controls */}
        <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-full bg-[#c9a84c] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#c9a84c]/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 space-y-1">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#c9a84c] to-[#ffe08a] transition-all"
                  style={{ width: `${playProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                <span>{isPlaying ? `0:${Math.floor(playProgress * 2.1).toString().padStart(2, '0')}` : '0:00'}</span>
                <span>3:30</span>
              </div>
            </div>
          </div>

          {/* Graphic Equalizer bars */}
          <div className="flex justify-between items-end h-8 px-4 bg-black/40 border border-white/5 rounded-lg overflow-hidden">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i} 
                className="w-0.5 bg-[#c9a84c] rounded-t transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, Math.floor(Math.random() * 95))}%` : '15%',
                  opacity: isPlaying ? 0.9 : 0.4
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel: Full Screen Parallax Scrolling Lyrics */}
      <div 
        ref={lyricsContainerRef}
        className="flex-1 overflow-y-auto px-6 md:px-20 py-20 relative z-10 scrollbar-thin select-text"
      >
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
          {rawLines.map((line, index) => {
            const trimmed = line.trim();
            const isSectionHeader = trimmed.startsWith('[') || trimmed.startsWith('Verse') || trimmed.startsWith('Chorus') || trimmed.startsWith('Bridge') || trimmed.startsWith('Pre-Chorus') || trimmed.startsWith('Final') || trimmed.startsWith('Outro');
            
            return (
              <motion.div
                key={index}
                id={`lyric-line-${index}`}
                initial={{ opacity: 0.3, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px 0px -200px 0px" }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                {isSectionHeader ? (
                  <h3 className="font-body text-xs uppercase tracking-[0.3em] text-[#c9a84c]/80 font-bold mt-12 mb-6">
                    {trimmed}
                  </h3>
                ) : trimmed === '' ? (
                  <div className="h-6" />
                ) : (
                  <p className="font-display text-2xl md:text-3.5xl text-[#f4eedb] leading-relaxed select-text hover:text-white transition-colors cursor-pointer filter hover:drop-shadow-[0_0_8px_rgba(255,224,138,0.3)]">
                    {trimmed}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
