import { motion } from 'framer-motion';

// The owner's Set Free galaxy, pre-cropped to the galaxy area only (no border
// or baked title) and saved as a 1080x1920 JPEG: 120 KB instead of the 3.5 MB
// original, so it paints straight away. The slow breathing zoom keeps the
// plate larger than the hero, so no edge can ever show.
export const GALAXY = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/f2bfe0dc2_SetFree_galaxy_1080.jpg';

export default function GalaxyBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.img
        src={GALAXY}
        alt=""
        draggable="false"
        fetchpriority="high"
        loading="eager"
        className="absolute inset-0 w-full h-full max-w-none object-cover select-none"
        initial={{ scale: 1.1 }}
        animate={{ scale: [1.1, 1.18, 1.1], rotate: [0, 1.2, 0] }}
        transition={{ duration: 70, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}