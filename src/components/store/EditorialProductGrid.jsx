import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#D4AF37';

const PRODUCT_EMOJI = {
  'front-hoodie': '🖤', 'back-hoodie': '🖤', 'winter-writing-comfort-bundle': '❄️',
  'journal-pen-thermos-bundle': '📓', 'mug': '☕', 'wall-poster': '🖼️',
  'cd': '💿', 'tote-bag': '👜', 'mums-garden': '🌸'
};

export default function EditorialProductGrid({ products, onOpenModal }) {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div
        className="grid gap-5 px-1"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      >
        {products.map((product, i) => {
          const isWide = i === 0 || i === 3;
          const isSoldOut = product.status === 'sold_out';
          const isMemorial = product.status === 'memorial';
          const emoji = PRODUCT_EMOJI[product.id] || '🛍️';
          const images = (product.images || []).filter(Boolean);
          const imgSrc = images[0] || null;

          const handleClick = () => {
            if (isMemorial) { navigate(product.link); return; }
            onOpenModal(product.id);
          };

          return (
            <motion.button
              key={product.id}
              type="button"
              onClick={handleClick}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              whileHover={{ y: -4 }}
              className="group block text-left p-0 cursor-pointer overflow-hidden rounded-xl border transition-colors"
              style={{
                background: isMemorial ? 'linear-gradient(135deg, rgba(255,210,160,0.06), rgba(255,180,120,0.02))' : 'rgba(255,255,255,0.02)',
                borderColor: isMemorial ? 'rgba(255,210,160,0.15)' : 'rgba(212,175,55,0.12)',
                opacity: isSoldOut ? 0.7 : 1,
                gridColumn: isWide ? 'span 2' : undefined,
              }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: isWide ? '4/3' : '1' }}>
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">{emoji}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {product.badge && (
                  <span
                    className="absolute top-3 right-3 text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded z-10"
                    style={{
                      background: isSoldOut ? 'rgba(239,68,68,0.9)' : isMemorial ? 'rgba(255,210,160,0.15)' : 'rgba(212,175,55,0.9)',
                      color: isSoldOut ? '#fff' : isMemorial ? '#ffd6a5' : '#111',
                    }}
                  >
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm leading-tight">{product.shortName || product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span style={{ color: isSoldOut ? '#e05555' : isMemorial ? '#ffd6a5' : ACCENT }} className="font-bold text-sm">
                      {isMemorial ? 'Tribute' : product.price || 'Sold Out'}
                    </span>
                    <span style={{ color: 'rgba(212,175,55,0.6)' }} className="text-[10px] tracking-wider uppercase">
                      {isSoldOut ? 'Waitlist →' : isMemorial ? 'Visit →' : 'View →'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}