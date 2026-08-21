import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MerchShowcase() {
  const { data: products = [] } = useQuery({
    queryKey: ['merchShowcase'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }, '-created_date'),
    initialData: [],
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const categoryGroups = {
    apparel: products.filter(p => p.category === 'apparel'),
    accessories: products.filter(p => p.category === 'accessories'),
    vinyl: products.filter(p => p.category === 'vinyl'),
    cd: products.filter(p => p.category === 'cd'),
    other: products.filter(p => !['apparel', 'accessories', 'vinyl', 'cd'].includes(p.category)),
  };

  return (
    <div className="space-y-16">
      {Object.entries(categoryGroups).map(
        ([category, items]) =>
          items.length > 0 && (
            <section key={category}>
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h3 className="font-display text-3xl text-foreground capitalize mb-2">{category}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
              </motion.div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onHoverStart={() => setHoveredId(product.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => setSelectedProduct(product)}
                    className="group cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative rounded-2xl overflow-hidden bg-secondary/40 aspect-square mb-4 border border-border/20 hover:border-primary/40 transition-colors">
                      {/* Image */}
                      {product.image_url ? (
                        <motion.img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: hoveredId === product.id ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}

                      {/* Overlay */}
                      <AnimatePresence>
                        {hoveredId === product.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-center gap-3"
                          >
                            <motion.div
                              initial={{ scale: 0, rotate: -10 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                              className="flex gap-2"
                            >
                              <button className="w-10 h-10 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center backdrop-blur-sm transition-all">
                                <Heart className="w-5 h-5 text-white" />
                              </button>
                              <button className="w-10 h-10 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center backdrop-blur-sm transition-all">
                                <Eye className="w-5 h-5 text-white" />
                              </button>
                            </motion.div>
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="text-center"
                            >
                              <p className="font-body text-xs text-white tracking-wider uppercase">View Details</p>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      {product.stock_quantity === 0 && (
                        <Badge className="absolute top-3 right-3 bg-destructive/80 text-white">
                          Out of Stock
                        </Badge>
                      )}
                      {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                        <Badge className="absolute top-3 right-3 bg-accent/80 text-white">
                          Limited
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h4 className="font-display text-lg text-foreground group-hover:gradient-gold-glow transition-all">
                        {product.name}
                      </h4>
                      <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-display text-xl gradient-gold-glow">${(product.sale_price ?? product.price ?? 0).toFixed(2)}</p>
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl overflow-hidden max-w-2xl w-full border border-primary/30"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary/60 hover:bg-secondary text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Image */}
                {selectedProduct.image_url && (
                  <div className="rounded-xl overflow-hidden bg-secondary/60 aspect-square">
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Details */}
                <div className="flex flex-col justify-center">
                  <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">
                    {selectedProduct.category}
                  </p>
                  <h2 className="font-display text-3xl text-foreground mb-3">{selectedProduct.name}</h2>
                  <p className="font-display text-2xl gradient-gold-glow mb-4">${(selectedProduct.sale_price ?? selectedProduct.price ?? 0).toFixed(2)}</p>
                  <p className="font-body text-foreground/70 leading-relaxed mb-6">{selectedProduct.description}</p>

                  {selectedProduct.sizes_available?.length > 0 && (
                    <div className="mb-6">
                      <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-3">
                        Available Sizes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.sizes_available.map(size => (
                          <Badge key={size} variant="outline" className="border-primary/40 text-primary">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full rounded-lg gradient-gold-button border-0 py-5 font-body text-sm tracking-wider uppercase"
                      disabled={selectedProduct.stock_quantity === 0}
                    >
                      {selectedProduct.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-lg border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Heart className="w-4 h-4 mr-2" /> Save for Later
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}