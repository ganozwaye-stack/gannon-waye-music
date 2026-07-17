import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ACCENT = '#D4AF37';

export default function EditorialProductGrid({ products, onOpenModal }) {
  const navigate = useNavigate();

  return (
    <div className="mb-12">
      <div
        className="grid gap-5 px-1"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' }}
      >
        {products.map((product, index) => {
          const isSoldOut = product.status === 'sold_out';
          const isMemorial = product.status === 'memorial';
          const images = (product.images || product.images_array || []).filter(Boolean);
          const imgSrc = images[0] || product.image_url || null;

          const handleClick = () => {
            if (isMemorial) {
              navigate(product.link);
              return;
            }
            onOpenModal(product.id);
          };

          return (
            <motion.button
              key={product.id}
              type="button"
              onClick={handleClick}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
              whileHover={{ y: -3 }}
              className="group block cursor-pointer overflow-hidden rounded-lg border p-0 text-left transition-colors"
              style={{
                background: isMemorial ? 'linear-gradient(135deg, rgba(255,210,160,0.06), rgba(255,180,120,0.02))' : 'rgba(255,255,255,0.025)',
                borderColor: isMemorial ? 'rgba(255,210,160,0.15)' : 'rgba(212,175,55,0.14)',
                opacity: isSoldOut ? 0.74 : 1,
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.22em] text-primary/40">
                    Image Pending
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/8 to-transparent" />
                {product.badge && (
                  <span
                    className="absolute right-3 top-3 rounded px-2 py-1 text-[8px] font-bold uppercase tracking-wider"
                    style={{
                      background: isSoldOut ? 'rgba(239,68,68,0.9)' : isMemorial ? 'rgba(255,210,160,0.15)' : 'rgba(212,175,55,0.9)',
                      color: isSoldOut ? '#fff' : isMemorial ? '#ffd6a5' : '#111',
                    }}
                  >
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-semibold leading-tight text-white">{product.shortName || product.name}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span style={{ color: isSoldOut ? '#e05555' : isMemorial ? '#ffd6a5' : ACCENT }} className="text-sm font-bold">
                      {isMemorial ? 'Tribute' : product.price || 'Sold Out'}
                    </span>
                    <span style={{ color: 'rgba(212,175,55,0.64)' }} className="text-[10px] uppercase tracking-wider">
                      {isSoldOut ? 'Waitlist' : isMemorial ? 'Visit' : 'View'}
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
