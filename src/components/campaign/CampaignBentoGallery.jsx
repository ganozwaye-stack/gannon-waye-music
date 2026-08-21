import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const HOODIE_STUDIO =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/96ccf42ee_hoodie-premium-studio-back-hero-4x5.png';
const HOODIE_PUBLIC =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e3b61bc7d_hoodie-public-solidarity-supermarket-4x5.png';
const MUG_MORNING =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b169e8aea_mug-morning-reflection-4x5.png';
const MUG_EVENING =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ba1e27a28_mug-evening-songwriting-instagram-4x5.png';
const JOURNAL_BUNDLE =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5909cdcc0_BundleJournalPenThermos.jpg';
const TOTE =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d3d69be4c_Respect_is_Earned_Tote_Bag_Front-removebg-preview.png';

const TILES = [
  { src: HOODIE_STUDIO, label: 'The Standard · Studio', span: 'col-span-2 row-span-2' },
  { src: HOODIE_PUBLIC, label: 'Worn in Public', span: 'col-span-2' },
  { src: MUG_MORNING, label: 'Morning Ritual', span: 'col-span-1' },
  { src: MUG_EVENING, label: 'Evening Pages', span: 'col-span-1' },
  { src: JOURNAL_BUNDLE, label: 'The Writing Set', span: 'col-span-2' },
  { src: TOTE, label: 'Carry It', span: 'col-span-2' },
];

function Tile({ src, label, span, delay }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay }}
      className={`relative rounded-2xl overflow-hidden border border-border/30 bg-card group ${span}`}
    >
      <Link to="/store" className="block w-full h-full" aria-label={`${label} — shop the collection`}>
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="w-full h-full object-cover transition-transform [transition-duration:900ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <figcaption className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-end justify-between gap-2">
          <p className="font-body text-[9px] md:text-[10px] tracking-[0.32em] uppercase text-primary/90">{label}</p>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-body text-[9px] tracking-[0.2em] uppercase text-primary">
            Shop <ArrowUpRight className="w-3 h-3" />
          </span>
        </figcaption>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/30 transition" />
      </Link>
    </motion.figure>
  );
}

export default function CampaignBentoGallery() {
  return (
    <section className="max-w-5xl mx-auto px-5 sm:px-8 py-12 md:py-16 border-t border-border/20">
      <div className="mb-7">
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-3">The Campaign · In Frame</p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight max-w-2xl">
          Carry the Message, <span className="gradient-gold-text">seen in ordinary light.</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[170px] lg:auto-rows-[230px] gap-3">
        {TILES.map((t, i) => (
          <Tile key={i} src={t.src} label={t.label} span={t.span} delay={i * 0.05} />
        ))}
      </div>
    </section>
  );
}