import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import GoldDust from '@/components/mums-garden/GoldDust';
import { CandleGarden } from '@/components/mum/EnhancedCandle';
import TributeSection from '@/components/memorial/TributeSection';

const MUM_PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dc8919b4b_IMG_5624.png';

// The Memorial page: a heartfelt, open space for Sonia and for every loved
// one the visitors carry. Candles, tributes, photos and stories, all held
// with care. House style: no em dashes.
export default function Memorial() {
  return (
    <div className="min-h-screen" style={{ background: '#080706' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(255,210,140,0.05) 0%, transparent 60%)'
      }} />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <GoldDust />
        <div className="relative max-w-2xl mx-auto px-6 pt-28 pb-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2" style={{ borderColor: 'rgba(255,210,160,0.2)' }}>
              <img src={MUM_PORTRAIT} alt="Sonia" className="w-full h-full object-cover" />
            </div>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(255,210,160,0.4)' }}>
              In Loving Memory
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-4" style={{ color: 'rgba(255,210,160,0.9)' }}>
              The Memorial Garden
            </h1>
            <p className="font-body text-sm leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Dedicated to Sonia Katisa Waye, and to every loved one carried in our hearts.
              Always in our hearts. Always in the music.
            </p>
            <p className="font-display text-base italic leading-7 mt-6" style={{ color: 'rgba(255,210,160,0.55)' }}>
              "Respect Is Earned, Not A Game You Make Me Play."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Candle garden: visitors light a candle */}
      <div className="relative max-w-xl mx-auto px-6 pb-14 text-center">
        <p className="font-body text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: 'rgba(255,210,160,0.4)' }}>
          Light a Candle
        </p>
        <p className="font-body text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Tap each candle to light it for someone you love.
        </p>
        <CandleGarden count={5} />
      </div>

      {/* Interactive tribute wall and share form */}
      <TributeSection />

      <div className="text-center pb-12">
        <Link to="/" className="inline-flex items-center gap-1.5 font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          <ChevronLeft className="w-3 h-3" /> Back to site
        </Link>
      </div>
    </div>
  );
}