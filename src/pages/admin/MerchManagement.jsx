import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, ShoppingBag, DollarSign, TrendingUp, Package, Eye, Calculator, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import MultiImageGallery from '@/components/products/MultiImageGallery';
import ProductFinancials from '@/components/products/ProductFinancials';
import { calculateProductProfitability } from '@/lib/businessLogic';
import { emitEvent, EVENT_TYPES } from '@/lib/eventAutomation';

const CATEGORIES = ['apparel', 'accessories', 'vinyl', 'cd', 'poster', 'bundle', 'other'];
const emptyProduct = {
  name: '',
  description: '',
  category: 'apparel',
  sale_price: '',
  cost_price: '',
  delivery_cost: '',
  merchant_fee_percent: 3.5,
  image_url: '',
  images_array: [],
  sizes_available: [],
  stock_quantity: 0,
  is_active: true,
};

export default function MerchManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [sizeInput, setSizeInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [bulkAction, setBulkAction] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: products, isLoading } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.list('-created_date'),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        sale_price: Number(data.sale_price) || 0,
        cost_price: Number(data.cost_price) || 0,
        delivery_cost: Number(data.delivery_cost) || 0,
        merchant_fee_percent: Number(data.merchant_fee_percent) || 3.5,
        stock_quantity: Number(data.stock_quantity) || 0,
      };

      if (editing === 'new') {
        const result = await base44.entities.MerchProduct.create(payload);
        // Trigger event automation
        await emitEvent(EVENT_TYPES.PRODUCT_CREATED, { ...payload, id: result.id });
        return result;
      }
      
      return await base44.entities.MerchProduct.update(editing, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      setEditing(null);
      toast({ title: 'Product saved successfully', description: 'All systems synchronized' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const product = products.find(p => p.id === id);
      
      // Check inventory before delete
      if (product.stock_quantity > 0) {
        const confirmed = window.confirm(`This product has ${product.stock_quantity} units in stock. Delete anyway?`);
        if (!confirmed) return;
      }
      
      const result = await base44.entities.MerchProduct.delete(id);
      // Trigger event automation
      await emitEvent(EVENT_TYPES.PRODUCT_DELETED, { id, name: product?.name });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      toast({ title: 'Product deleted' });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, updates }) => {
      const promises = ids.map(id => base44.entities.MerchProduct.update(id, updates));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      setBulkAction(null);
      setSelectedProducts([]);
      toast({ title: 'Bulk update complete', description: `${selectedProducts.length} products updated` });
    },
  });

  const handleImagesChange = (newImages) => {
    setForm({ 
      ...form, 
      images_array: newImages,
      image_url: newImages.length > 0 ? newImages[0] : ''
    });
  };

  const addSize = () => {
    if (sizeInput.trim() && !form.sizes_available.includes(sizeInput.trim())) {
      setForm({ ...form, sizes_available: [...form.sizes_available, sizeInput.trim()] });
      setSizeInput('');
    }
  };

  const removeSize = (s) => setForm({ ...form, sizes_available: form.sizes_available.filter(x => x !== s) });

  const openEdit = (product) => {
    setEditing(product ? product.id : 'new');
    setForm(product ? { ...emptyProduct, ...product } : emptyProduct);
    setCurrentImageIndex(0);
  };

  const toggleSelect = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const calculatedForm = useMemo(() => {
    if (!form.sale_price || !form.cost_price || !form.delivery_cost) return null;
    return calculateProductProfitability({
      sale_price: Number(form.sale_price),
      cost_price: Number(form.cost_price),
      delivery_cost: Number(form.delivery_cost),
      merchant_fee_percent: Number(form.merchant_fee_percent),
    });
  }, [form.sale_price, form.cost_price, form.delivery_cost, form.merchant_fee_percent]);

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Merchandise Management</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {products.length} products · {products.filter(p => p.is_active).length} active · ${products.reduce((sum, p) => sum + (p.stock_quantity * p.sale_price), 0).toFixed(2)} inventory value
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="gap-2">
            <Eye className="w-4 h-4" /> {viewMode === 'grid' ? 'List' : 'Grid'}
          </Button>
          {selectedProducts.length > 0 && (
            <Button variant="destructive" size="sm" onClick={() => setBulkAction('delete')} className="gap-2">
              <Trash2 className="w-4 h-4" /> Delete ({selectedProducts.length})
            </Button>
          )}
          <Button onClick={() => openEdit(null)} className="gap-2 rounded-full">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: ShoppingBag, color: 'text-primary' },
          { label: 'Active', value: products.filter(p => p.is_active).length, icon: Eye, color: 'text-green-500' },
          { label: 'Total Stock', value: products.reduce((sum, p) => sum + p.stock_quantity, 0), icon: Package, color: 'text-blue-500' },
          { label: 'Avg Margin', value: `${products.length > 0 ? (products.reduce((sum, p) => sum + (p.profit_margin_percent || 0), 0) / products.length).toFixed(1) : 0}%`, icon: TrendingUp, color: 'text-green-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/40 rounded-xl p-4"
            >
              <Icon className={`w-4 h-4 ${stat.color} mb-2`} />
              <p className="font-display text-2xl text-foreground">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-card border border-border/40 overflow-hidden rounded-xl ${selectedProducts.includes(product.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center gap-2 p-3 border-b border-border/30 bg-secondary/30">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleSelect(product.id)}
                  className="w-4 h-4 rounded border-border"
                />
                <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                {!product.is_active && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
                {product.stock_quantity < 10 && <Badge variant="secondary" className="text-[10px]">Low Stock</Badge>}
              </div>
              <div className="aspect-square bg-secondary/50 overflow-hidden relative group">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                )}
                {product.images_array && product.images_array.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {product.images_array.length} images
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-display text-lg text-foreground font-medium">{product.name}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Sale Price</p>
                    <p className="font-display text-primary">${product.sale_price?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-display">${product.cost_price?.toFixed(2) || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit</p>
                    <p className={`font-display ${product.total_profit_per_unit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${product.total_profit_per_unit?.toFixed(2) || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margin</p>
                    <p className={`font-display ${product.profit_margin_percent >= 30 ? 'text-green-500' : product.profit_margin_percent >= 15 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {product.profit_margin_percent?.toFixed(1) || '—'}%
                    </p>
                  </div>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-2">Stock: {product.stock_quantity} · Sizes: {product.sizes_available?.length || 0}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => openEdit(product)} className="gap-1 flex-1">
                    <Pencil className="w-3 h-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(product.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`bg-card border border-border/40 rounded-xl p-4 flex items-center gap-4 ${selectedProducts.includes(product.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => toggleSelect(product.id)}
                className="w-4 h-4 rounded border-border"
              />
              <div className="w-16 h-16 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2">
                  <p className="font-display text-sm font-medium">{product.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div>
                  <p className="font-display text-primary">${product.sale_price?.toFixed(2)}</p>
                  <p className="font-body text-xs text-muted-foreground">Cost: ${product.cost_price?.toFixed(2) || '—'}</p>
                </div>
                <div>
                  <p className={`font-display text-sm ${product.total_profit_per_unit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${product.total_profit_per_unit?.toFixed(2) || '—'}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">{product.profit_margin_percent?.toFixed(1) || '—'}% margin</p>
                </div>
                <div>
                  <p className="font-body text-sm">{product.stock_quantity} units</p>
                  <p className="font-body text-xs text-muted-foreground">{product.sizes_available?.length || 0} sizes</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => openEdit(product)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(product.id)}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-24 bg-card border border-border/40 rounded-2xl">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground mb-4">No products yet. Start building your merchandise collection.</p>
          <Button onClick={() => openEdit(null)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Your First Product
          </Button>
        </div>
      )}

      {/* Edit Dialog with Advanced Multi-Image Gallery */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-card border-border/40 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing === 'new' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
            <DialogDescription>
              Enterprise-grade product management with multi-image gallery and real-time financial calculations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Product Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Premium Hoodie" />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Product description, materials, features..." />
            </div>

            {/* Professional Multi-Image Gallery - Integrated Component */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4 text-primary" />
                <p className="font-display text-sm text-primary">Product Image Gallery</p>
              </div>
              <MultiImageGallery
                images={form.images_array || []}
                onChange={handleImagesChange}
              />
            </div>

            {/* Financial Fields with Real-time Calculations */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <p className="font-display text-sm text-primary">Financial Details</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase text-primary">Sale Price ($)</Label>
                  <Input type="number" step="0.01" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })} className="border-primary/30" />
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Cost Price ($)</Label>
                  <Input type="number" step="0.01" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: e.target.value })} placeholder="Supplier cost" />
                </div>
                <div>
                  <Label className="font-body text-xs tracking-wider uppercase">Delivery Cost ($)</Label>
                  <Input type="number" step="0.01" value={form.delivery_cost} onChange={e => setForm({ ...form, delivery_cost: e.target.value })} placeholder="Shipping per unit" />
                </div>
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Merchant Fee (%)</Label>
                <Input type="number" step="0.1" value={form.merchant_fee_percent} onChange={e => setForm({ ...form, merchant_fee_percent: e.target.value })} />
                <p className="font-body text-[10px] text-muted-foreground mt-1">Payment processor fee (default 3.5%)</p>
              </div>
              
              {/* Live Profitability Analysis - Integrated Component */}
              {calculatedForm && (
                <ProductFinancials product={{
                  sale_price: Number(form.sale_price),
                  cost_price: Number(form.cost_price),
                  delivery_cost: Number(form.delivery_cost),
                  merchant_fee_percent: Number(form.merchant_fee_percent),
                  stock_quantity: Number(form.stock_quantity),
                  sizes_available: form.sizes_available,
                }} />
              )}
            </div>

            {/* Inventory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Stock Quantity</Label>
                <Input type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Sizes Available</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="e.g. XL" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} />
                  <Button variant="outline" size="sm" onClick={addSize}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.sizes_available?.map(s => (
                    <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => removeSize(s)}>{s} ×</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
              <Label className="font-body text-sm">Active (visible in store)</Label>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.name || !form.sale_price} className="gap-2">
              <Calculator className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={bulkAction === 'delete'} onOpenChange={() => setBulkAction(null)}>
        <DialogContent className="bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Delete {selectedProducts.length} Products?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All product data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAction(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              Promise.all(selectedProducts.map(id => deleteMutation.mutateAsync(id))).then(() => {
                setBulkAction(null);
              });
            }}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}