import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveStoreProducts } from '@/lib/liveStoreProducts';

export default function MerchTeaserSection() {
  const { data: dbProducts = [] } = useQuery({
    queryKey: ['liveStoreProducts', 'merchTeaser'],
    queryFn: () => fetchLiveStoreProducts('-updated_date'),
    initialData: [],
    staleTime: 60_000,
  });

  // Fail closed. The homepage must never invent products, prices, stock or images.
  const products = Array.isArray(dbProducts) ? dbProducts.slice(0, 4) : [];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Current owner-held stock</p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground mb-3">
            Carry the message with you
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Only products whose design, stock and fulfilment have been approved appear here. Delivery is calculated before payment.
          </p>
        </motion.div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {products.map((product, i) => {
              const image = Array.isArray(product.images_array) && product.images_array.length > 0
                ? product.images_array.find(Boolean)
                : product.image_url;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border/30 bg-card/60 overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square bg-secondary/60 overflow-hidden relative">
                    {image ? (
                      <img src={image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-display text-sm text-foreground leading-snug">{product.name}</p>
                    <p className="font-body text-xs gradient-gold-glow mt-1">
                      ${product.sale_price ?? product.price} AUD
                    </p>
                    <Link to="/store">
                      <button className="mt-2 w-full gradient-gold-button rounded-full py-1.5 font-body text-[10px] tracking-wider uppercase">
                        View in Store
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-border/30 bg-card/50 px-6 py-10 text-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground">
              Current stock is being verified. Nothing unverified will be shown as available.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/store">
            <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0">
              View Current Stock <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
