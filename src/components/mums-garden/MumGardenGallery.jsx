import { motion } from 'framer-motion';
import GoldDust from '@/components/mums-garden/GoldDust';
import FiligreeDivider from '@/components/mums-garden/FiligreeDivider';
import MemoryFrame from '@/components/mums-garden/MemoryFrame';

const GALLERY_IMAGES = [
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3f0a494fe_ChatGPTImageJun23202605_44_12PM.png', caption: 'I looked up and asked the sky' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f40dcf451_ChatGPTImageJun23202605_44_06PM.png', caption: 'Every word, a memory' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/70762b7fa_ChatGPTImageJun23202605_44_19PM.png', caption: 'The story behind the artwork' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bf49dfafc_ChatGPTImageJun23202605_44_01PM.png', caption: 'Built from memory, stitch by stitch' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9b3f9f67b_ChatGPTImageJun23202605_43_41PM.png', caption: 'I wanted her to feel present' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/03843c612_ChatGPTImageJun23202605_43_47PM2.png', caption: 'A song for my mum' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ed16421e2_ChatGPTImageJun23202605_43_37PM.png', caption: 'Her love lights the way' },
  { src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b52c8e6ce_ChatGPTImageJun23202605_43_31PM.png', caption: 'Forever in my heart' },
];

export default function MumGardenGallery() {
  return (
    <section className="relative px-6 py-24" style={{ background: '#0a1120' }}>
      <GoldDust count={8} />
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <p className="mb-4 font-body text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(245,224,160,0.4)' }}>
            A Garden of Memories
          </p>
          <h2 className="font-display text-2xl italic md:text-3xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Every moment, held gently
          </h2>
          <div className="mt-6">
            <FiligreeDivider />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, i) => (
            <MemoryFrame key={i} src={img.src} caption={img.caption} delay={i * 0.08} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <FiligreeDivider />
        </div>
      </div>
    </section>
  );
}