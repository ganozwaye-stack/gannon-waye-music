import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

// The Set Free promo banner for the store. Owner-directed 25 September 2026:
// it sits UNDER the locked boutique world artwork (never layered over it),
// just before the products. Carries the official Set Free wording.
const HOODIE_DESIGN = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f9d312be2_set_free_heavyweight_hoodie_3d_ad_mockup.png';

export default function SetFreeStoreBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden border-2 border-primary/40 mb-8 text-left shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
      style={{ background: 'linear-gradient(120deg, rgba(212,175,55,0.18) 0%, rgba(8,8,14,0.92) 55%)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] items-center">
        <div className="p-6 md:p-8">
          <p className="font-body text-[10px] tracking-[0.35em] uppercase gradient-gold-glow mb-2">The Single · Out Now</p>
          <h2 className="font-body text-3xl md:text-5xl uppercase tracking-[0.14em] gradient-gold-text">Set Free</h2>
          <p className="font-body text-sm tracking-[0.3em] uppercase text-primary mt-2">Carry the Message</p>
          <p className="font-body text-sm text-foreground/75 leading-relaxed mt-4 max-w-md">
            The Set Free collection is here. Every piece carries the message of the single, so what you wear says what you feel.
          </p>
          <a
            href="#store-products"
            className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 font-body text-xs tracking-wider uppercase gradient-gold-button border-0 mt-5"
          >
            Shop the Collection <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="px-6 pb-6 md:p-6 flex justify-start md:justify-end">
          <img
            src={HOODIE_DESIGN}
            alt="Set Free hoodie, cracked heart design"
            loading="lazy"
            className="w-full max-w-[280px] rounded-xl border border-primary/25"
          />
        </div>
      </div>
    </motion.div>
  );
}