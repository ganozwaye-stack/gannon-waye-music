import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import HeavenlyArrival from '@/components/mums-garden/scenes/HeavenlyArrival';
import EnteringTheTrees from '@/components/mums-garden/scenes/EnteringTheTrees';
import MemoriesAmongTrees from '@/components/mums-garden/scenes/MemoriesAmongTrees';
import RealAustralianGarden from '@/components/mums-garden/scenes/RealAustralianGarden';
import ArchwayScene from '@/components/mums-garden/scenes/ArchwayScene';
import GardenRooms from '@/components/mums-garden/scenes/GardenRooms';
import BenchGarden from '@/components/mums-garden/scenes/BenchGarden';
import MusicalConclusion from '@/components/mums-garden/scenes/MusicalConclusion';

const NAVY = 'hsl(156 35% 4%)';

const SCENES = [
  { id: 'arrival', label: 'Heavenly Arrival' },
  { id: 'trees', label: 'Entering the Trees' },
  { id: 'memories', label: 'Memories Among Trees' },
  { id: 'garden', label: 'The Real Garden' },
  { id: 'archway', label: "Onya & Gay's Archway" },
  { id: 'rooms', label: 'Garden Rooms' },
  { id: 'bench', label: 'The Bench Garden' },
  { id: 'conclusion', label: 'Musical Conclusion' },
];

export default function MumsGarden() {
  const [reduced, setReduced] = useState(false);
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
      <div className="relative w-full" style={{ background: NAVY }}>
        {/* Scene index — gentle wayfinding, not a hard nav */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 rounded-full border border-[hsl(var(--garden-gold))]/20 bg-black/40 px-3 py-1.5 backdrop-blur">
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(s.id)}
              className="rounded-full px-2.5 py-1 font-body text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--garden-cream))]/55 hover:text-[hsl(var(--garden-gold))] transition-colors"
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Reduced-motion toggle — required accessibility control */}
        <button
          type="button"
          onClick={() => setReduced((v) => !v)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--garden-gold))]/30 bg-black/50 px-4 py-2.5 backdrop-blur hover:border-[hsl(var(--garden-gold))]/60 transition-colors"
          aria-pressed={reduced}
          aria-label="Toggle reduced motion"
        >
          {reduced ? <Moon className="w-4 h-4 text-[hsl(var(--garden-gold))]" /> : <Sun className="w-4 h-4 text-[hsl(var(--garden-cream))]/70" />}
          <span className="font-body text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--garden-cream))]/70">
            {reduced ? 'Reduced motion' : 'Cinematic motion'}
          </span>
        </button>

        <HeavenlyArrival onEnter={() => goTo('trees')} />
        <EnteringTheTrees onContinue={() => goTo('memories')} />
        <MemoriesAmongTrees onContinue={() => goTo('garden')} />
        <RealAustralianGarden onContinue={() => goTo('archway')} />
        <ArchwayScene onContinue={() => goTo('rooms')} />
        <GardenRooms onContinue={() => goTo('bench')} />
        <BenchGarden onContinue={() => goTo('conclusion')} />
        <MusicalConclusion />
      </div>
    </MotionConfig>
  );
}