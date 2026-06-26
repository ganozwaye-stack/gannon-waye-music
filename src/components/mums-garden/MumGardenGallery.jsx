import { motion } from 'framer-motion';
import GoldDust from '@/components/mums-garden/GoldDust';
import FiligreeDivider from '@/components/mums-garden/FiligreeDivider';

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
    <section className="relative py-24 px-6" style={{ background: '#0a1120' }}>
      <GoldDust count={8} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: 'rgba(245,224,160,0.4)' }}>
            A Garden of Memories
          </p>
          <h2 className="font-display italic text-2xl md:text-3xl" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Every moment, held gently
          </h2>
          <div className="mt-6">
            <FiligreeDivider />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.figure
              key={i}
              className="group relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1 }}
            >
              <div className="aspect-[4/5] overflow-hidden" style={{ background: 'rgba(245,224,160,0.03)' }}>
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{ filter: 'saturate(0.85) brightness(0.92)' }}
                />
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-700 group-hover:opacity-0" style={{
                  background: 'linear-gradient(to bottom, transparent 50%, rgba(10,17,32,0.6) 100%)',
                }} />
              </div>
              <figcaption className="absolute bottom-0 left-0 right-0 p-4 text-center">
                <p className="font-display italic text-sm md:text-base transition-all duration-500"
                   style={{ color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
                  {img.caption}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <div className="text-center mt-16">
          <FiligreeDivider />
        </div>
      </div>
    </section>
  );
}