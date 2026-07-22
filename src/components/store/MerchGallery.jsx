import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { STORE_PRODUCTS } from '@/config/storeWorldConfig';
import ProductQuickViewModal from '@/components/store/ProductQuickViewModal';

const ACCENT = '#D4AF37';

const GALLERY_IDS = [
  '6a2d595ef7bb7ff53258cdfd',
  '69f11d1fc43e13c61fe6b9d7',
  '69fbd261b760426cede1b7a3',
  '6a16abb0198d4c5d294edc11',
  '6a2d595ef7bb7ff53258cdfe',
];

export default function MerchGallery() {
  const [activeModal, setActiveModal] = useState(null);
  const galleryProducts = STORE_PRODUCTS.filter(product => GALLERY_IDS.includes(product.id));

  return (
    <section className="px-0 py-16" style={{ background: '#0a0a0a' }}>
      <div className="mx-auto max-w-[1680px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="mb-3 font-body text-xs uppercase tracking-[0.3em]" style={{ color: 'rgba(212,175,55,0.7)' }}>
            The Collection
          </p>
          <h2 className="font-display text-3xl md:text-5xl" style={{ color: '#f0e8d8' }}>
            Landscape Product Gallery
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {galleryProducts.map((product, index) => (
            <motion.button
              key={product.id}
              type="button"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              onClick={() => setActiveModal(product.id)}
              className="group relative cursor-pointer overflow-hidden rounded-lg border p-0 text-left"
              style={{
                aspectRatio: '16 / 10',
                borderColor: 'rgba(212,175,55,0.15)',
                background: '#111',
              }}
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 56%, rgba(10,10,10,0.22) 100%)' }}
              />

              {product.badge && (
                <span className="absolute right-4 top-4 rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]" style={{ background: 'rgba(212,175,55,0.92)', color: '#111', zIndex: 5 }}>
                  {product.badge}
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <h3 className="mb-1 font-display text-lg leading-tight" style={{ color: '#f0e8d8' }}>
                  {product.shortName || product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-lg font-bold" style={{ color: ACCENT }}>
                    {product.price}
                  </span>
                  <span className="font-body text-[10px] uppercase tracking-[0.15em]" style={{ color: 'rgba(212,175,55,0.7)' }}>
                    View
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {activeModal && (
        <ProductQuickViewModal productId={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </section>
  );
}
