import { motion } from 'framer-motion';

const HOODIE_PUBLIC =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e3b61bc7d_hoodie-public-solidarity-supermarket-4x5.png';
const HOODIE_STUDIO =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/96ccf42ee_hoodie-premium-studio-back-hero-4x5.png';
const MUG_MORNING =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b169e8aea_mug-morning-reflection-4x5.png';
const MUG_EVENING =
  'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ba1e27a28_mug-evening-songwriting-instagram-4x5.png';

function Tile({ src, label, span, delay }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay }}
      className={`relative rounded-2xl overflow-hidden border border-border/30 bg-card group ${span}`}
    >
      <img
        src={src}
        alt={label}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <figcaption className="absolute bottom-0 left-0 p-4 md:p-5">
        <p className="font-body text-[9px] md:text-[10px] tracking-[0.32em] uppercase text-primary/90">{label}</p>
      </figcaption>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/30 transition" />
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
        <Tile src={HOODIE_STUDIO} label="The Standard · Studio" span="col-span-1 row-span-2 lg:col-span-2 lg:row-span-2" delay={0} />
        <Tile src={HOODIE_PUBLIC} label="Worn in Public" span="col-span-2 lg:col-span-2" delay={0.05} />
        <Tile src={MUG_MORNING} label="Morning Ritual" span="col-span-1 lg:col-span-1" delay={0.1} />
        <Tile src={MUG_EVENING} label="Evening Pages" span="col-span-1 lg:col-span-1" delay={0.15} />
      </div>
    </section>
  );
}