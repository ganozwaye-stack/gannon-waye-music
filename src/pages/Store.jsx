import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Store() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({ customer_name: '', customer_email: '', shipping_address: '', size: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sizeDrawerOpen, setSizeDrawerOpen] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.filter({ is_active: true }),
    initialData: [],
  });

  const handleOrder = async () => {
    if (!orderForm.customer_name || !orderForm.customer_email || !orderForm.shipping_address) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    await base44.entities.MerchOrder.create({
      customer_name: orderForm.customer_name,
      customer_email: orderForm.customer_email,
      shipping_address: orderForm.shipping_address,
      items: [{
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        size: orderForm.size,
        quantity: 1,
        price: selectedProduct.price,
      }],
      total_amount: selectedProduct.price,
      status: 'pending',
    });
    toast({ title: 'Order placed!', description: 'We\'ll be in touch with shipping details.' });
    setSelectedProduct(null);
    setOrderForm({ customer_name: '', customer_email: '', shipping_address: '', size: '' });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-4">Official</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground">Merch Store</h1>
        </motion.div>

        {/* Preorder banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-foreground tracking-wide">Preorder Now — Payment Processed 1 June 2026</p>
            <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">
              All items are available for preorder. Your order is reserved today but <strong className="text-foreground">payment will not be charged until 1 June 2026</strong>. All prices are in AUD and include GST. Shipping is calculated and added at checkout.
            </p>
          </div>
        </motion.div>

        {products.length === 0 ? (
           <div className="text-center py-20">
             <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
             <p className="font-body text-muted-foreground">Merchandise coming soon.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {products.map((product, i) => (
               <motion.div
                 key={product.id}
                 initial={{ opacity: 0, y: 24 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1, duration: 0.5 }}
                 className="group cursor-pointer"
                 onClick={() => setSelectedProduct(product)}
               >
                 <div className="relative rounded-3xl overflow-hidden bg-card border border-border/40 group-hover:border-primary/40 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                   <div className="aspect-square bg-secondary/50 overflow-hidden">
                     {product.image_url ? (
                       <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
                       </div>
                     )}
                   </div>
                   <div className="p-6">
                     <Badge variant="outline" className="font-body text-[10px] tracking-widest uppercase border-border/60 text-muted-foreground mb-3">
                       {product.category?.replace(/_/g, ' ')}
                     </Badge>
                     <h3 className="font-display text-lg text-foreground mb-2">{product.name}</h3>
                     <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="font-display text-2xl text-primary">${product.price?.toFixed(2)} <span className="font-body text-xs text-muted-foreground">AUD incl. GST</span></p>
                         <p className="font-body text-[10px] text-muted-foreground mt-0.5">+ shipping</p>
                       </div>
                       {product.stock_quantity <= 0 ? (
                         <Badge className="bg-destructive/10 text-destructive border-0">Sold Out</Badge>
                       ) : (
                         <Badge className="bg-primary/15 text-primary border-0 text-[10px] tracking-wider uppercase">Preorder</Badge>
                       )}
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
         )}
      </div>

      {/* Order Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-card border-border/40 max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
           <DialogTitle className="font-display text-2xl">{selectedProduct?.name}</DialogTitle>
           <DialogDescription className="font-body text-muted-foreground">
             {selectedProduct?.description}
           </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
           <div className="rounded-xl bg-primary/8 border border-primary/20 px-4 py-3 flex items-start gap-3">
             <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
             <p className="font-body text-xs text-muted-foreground leading-relaxed">
               <strong className="text-foreground">Preorder</strong> — Payment will not be charged until <strong className="text-foreground">1 June 2026</strong>. Shipping calculated separately.
             </p>
           </div>
           <p className="font-display text-2xl text-primary">${selectedProduct?.price?.toFixed(2)} <span className="font-body text-sm text-muted-foreground">AUD incl. GST</span></p>

            {selectedProduct?.sizes_available?.length > 0 && (
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Size</Label>
                {isMobile ? (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => setSizeDrawerOpen(true)}>
                      {orderForm.size || 'Select size'}
                    </Button>
                    <Drawer open={sizeDrawerOpen} onOpenChange={setSizeDrawerOpen}>
                      <DrawerContent className="bg-card">
                        <DrawerHeader>
                          <DrawerTitle className="font-display">Choose Size</DrawerTitle>
                        </DrawerHeader>
                        <div className="space-y-2 p-4">
                          {selectedProduct.sizes_available.map(s => (
                            <Button
                              key={s}
                              variant={orderForm.size === s ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => {
                                setOrderForm({ ...orderForm, size: s });
                                setSizeDrawerOpen(false);
                              }}
                            >
                              {s}
                            </Button>
                          ))}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </>
                ) : (
                  <Select value={orderForm.size} onValueChange={v => setOrderForm({ ...orderForm, size: v })}>
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                      {selectedProduct.sizes_available.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Name</Label>
              <Input value={orderForm.customer_name} onChange={e => setOrderForm({ ...orderForm, customer_name: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Email</Label>
              <Input type="email" value={orderForm.customer_email} onChange={e => setOrderForm({ ...orderForm, customer_email: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Shipping Address</Label>
              <Textarea value={orderForm.shipping_address} onChange={e => setOrderForm({ ...orderForm, shipping_address: e.target.value })} />
            </div>
            <Button className="w-full rounded-full font-body tracking-wider uppercase" onClick={handleOrder} disabled={submitting || selectedProduct?.stock_quantity <= 0}>
              {submitting ? 'Placing Preorder...' : selectedProduct?.stock_quantity <= 0 ? 'Sold Out' : 'Place Preorder'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}