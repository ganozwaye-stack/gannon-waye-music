import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { STORE_PRODUCTS } from '@/config/storeWorldConfig';
import ProductQuickViewModal from '@/components/store/ProductQuickViewModal';

const ACCENT = '#D4AF37';

export default function MerchGallery() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  // Curated gallery products — hoodies, bundles, and hero items only
  const GALLERY_IDS = ['front-hoodie', 'winter-writing-comfort-bundle', 'journal-pen-thermos-bundle', 'mug', 'wall-poster', 'back-hoodie'];
  const galleryProducts = STORE_PRODUCTS.filter(p => GALLERY_IDS.includes(p.id) && p.status !== 'sold_out' && p.status !== 'memorial');

  return (
    <div className="py-16 px-4 md:px-6" style={{ background: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,175,55,0.7)' }}>The Collection</p>
          <h2 className="font-display text-3xl md:text-5xl" style={{ color: '#f0e8d8' }}>Merch Gallery</h2>
          <p className="font-body text-sm mt-3 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Every piece carries a meaning. Hover to explore the details.
          </p>
        </motion.div>

        {/* Gallery Grid — large format, professional */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setActiveModal(product.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl"
              style={{
                aspectRatio: '4/5',
                border: '1px solid rgba(212,175,55,0.15)',
                background: '#111',
              }}
            >
              {/* Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 50%, rgba(10,10,10,0.3) 100%)'
                }} />
              </div>

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 right-4 text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-md"
                  style={{ background: 'rgba(212,175,55,0.92)', color: '#111', zIndex: 5 }}>
                  {product.badge}
                </span>
              )}

              {/* Info — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                  <h3 className="font-display text-lg leading-tight mb-1" style={{ color: '#f0e8d8' }}>
                    {product.shortName || product.name}
                  </h3>
                  {product.description && (
                    <p className="font-body text-xs leading-relaxed mb-2 max-h-0 overflow-hidden opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500"
                      style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {product.description.slice(0, 100)}…
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-display text-lg font-bold" style={{ color: ACCENT }}>
                      {product.price}
                    </span>
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ color: 'rgba(212,175,55,0.7)' }}>
                      View →
                    </span>
                  </div>
                </div>
              </div>

              {/* Gold border glow on hover */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick-view modal */}
      {activeModal && (
        <ProductQuickViewModal productId={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}