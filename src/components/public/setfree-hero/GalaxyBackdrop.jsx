import { motion } from 'framer-motion';

// The owner's Set Free galaxy wallpaper (Hero Design library). The file is a
// 9:16 plate inside a white border with the title baked in beneath, so this
// box frames the galaxy area only and cover-fills the hero. The slow breathing
// zoom always keeps the box larger than the hero, so no edge can ever show.
const GALAXY = 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/dc8cc71b7_GALAXYBACKDROP_TITLE_NAME.png';

export default function GalaxyBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ containerType: 'size' }} aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 overflow-hidden"
        style={{ width: 'max(100cqw, 56.25cqh)', aspectRatio: '9 / 16', x: '-50%', y: '-50%' }}
        initial={{ scale: 1.1 }}
        animate={{ scale: [1.1, 1.18, 1.1], rotate: [0, 1.2, 0] }}
        transition={{ duration: 70, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={GALAXY}
          alt=""
          draggable="false"
          className="select-none"
          style={{ position: 'absolute', width: '116.5%', maxWidth: 'none', height: 'auto', left: '-8%', top: '-2.66%' }}
        />
      </motion.div>
    </div>
  );
}