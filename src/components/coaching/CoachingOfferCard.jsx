import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CoachingOfferCard({ icon, title, hook, description, ctaLabel, ctaLink, price = null, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-card/50 border border-border/40 hover:border-primary/40 rounded-2xl p-7 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase gradient-gold-text mb-2">Gannon Waye Coaching</p>
        <h3 className="font-display text-xl text-foreground italic leading-snug">{title}</h3>
      </div>
      <p className="font-body text-sm text-muted-foreground leading-relaxed italic">{hook}</p>
      {description && <p className="font-body text-xs text-muted-foreground/70 leading-relaxed">{description}</p>}
      <div className="mt-auto pt-2 flex items-center justify-between">
        {price ? (
          <span className="font-body text-sm text-primary font-semibold">{price}</span>
        ) : (
          <span className="font-body text-xs text-muted-foreground/50 italic">Price on enquiry</span>
        )}
        <Link
          to={ctaLink || '/coaching/intake'}
          className="inline-flex items-center gap-1.5 font-body text-xs tracking-widest uppercase text-primary border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/10 transition-all group-hover:border-primary/60"
        >
          {ctaLabel || 'Learn More'} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
