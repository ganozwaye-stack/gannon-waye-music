import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, Package, TrendingUp, Zap, Edit2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  calculateMerchFinancials,
  calculateStoreTotals,
  calculateMarginWithPromo,
} from '@/lib/financialCalculations';

export default function MerchFinancials() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [promoTest, setPromoTest] = useState(0);

  const { data: products } = useQuery({
    queryKey: ['merchProducts'],
    queryFn: () => base44.entities.MerchProduct.list('-created_date'),
    initialData: [],
  });

  const { data: orders } = useQuery({
    queryKey: ['merchOrders'],
    queryFn: () => base44.entities.MerchOrder.list(),
    initialData: [],
  });

  const { data: promoCodes } = useQuery({
    queryKey: ['promoCodes'],
    queryFn: () => base44.entities.PromoCode.filter({ is_active: true }),
    initialData: [],
  });

  // Calculate totals
  const storeTotals = useMemo(() => {
    return calculateStoreTotals(products, orders);
  }, [products, orders]);

  // Get product with financial data
  const productsWithFinancials = useMemo(() => {
    return products.map(p => {
      const financials = calculateMerchFinancials(p);
      const unitsSold = orders.reduce((sum, order) => {
        const item = order.items?.find(i => i.product_id === p.id);
        return sum + (item?.quantity || 0);
      }, 0);

      return {
        ...p,
        ...financials,
        unitsSold,
        totalUnitRevenue: financials.salePrice * unitsSold,
        totalUnitCost: (financials.costPrice + financials.deliveryCost) * unitsSold,
      };
    });
  }, [products, orders]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!searchTerm) return productsWithFinancials;
    return productsWithFinancials.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productsWithFinancials, searchTerm]);

  const handleEditProduct = async () => {
    try {
      await base44.entities.MerchProduct.update(selectedProduct.id, {
        cost_price: Number(editForm.cost_price),
        delivery_cost: Number(editForm.delivery_cost),
        merchant_fee_percent: Number(editForm.merchant_fee_percent),
      });
      toast({ title: 'Product financials updated' });
      setSelectedProduct(null);
    } catch (e) {
      toast({ title: 'Error updating product', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Merch Financial Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Complete costings, margins & profitability</p>
        </div>
      </div>

      {/* Store Totals */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Revenue', value: `$${storeTotals.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          { label: 'Costs', value: `$${storeTotals.totalCosts.toFixed(2)}`, icon: Package, color: 'text-red-500' },
          { label: 'Profit', value: `$${storeTotals.totalProfit.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Margin %', value: `${storeTotals.profitMarginPercent.toFixed(1)}%`, icon: Zap, color: 'text-yellow-500' },
          { label: 'Orders', value: storeTotals.totalOrders, icon: Package, color: 'text-blue-500' },
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
      </div>

      {/* Products Table */}
      <div className="space-y-3">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-card border border-border/40 rounded-xl p-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              {/* Product name */}
              <div className="md:col-span-1">
                <p className="font-display text-sm text-foreground font-medium">{product.name}</p>
                <p className="font-body text-xs text-muted-foreground">{product.unitsSold} sold</p>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-2 md:col-span-2">
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Sale Price</p>
                  <p className="font-display text-lg text-primary">${product.salePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Cost</p>
                  <p className="font-display text-sm text-foreground">${product.costPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Delivery</p>
                  <p className="font-display text-sm text-foreground">${product.deliveryCost.toFixed(2)}</p>
                </div>
              </div>

              {/* Profit metrics */}
              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Profit/Unit</p>
                  <p className={`font-display text-lg ${product.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${product.totalProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Margin %</p>
                  <p className={`font-display text-lg ${product.profitMarginPercent >= 30 ? 'text-green-500' : product.profitMarginPercent >= 15 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {product.profitMarginPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct(product);
                    setEditForm({
                      cost_price: product.costPrice,
                      delivery_cost: product.deliveryCost,
                      merchant_fee_percent: product.merchantFeePercent,
                    });
                  }}
                  className="rounded-full gap-1.5"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              </div>
            </div>

            {/* Expanded info */}
            {product.unitsSold > 0 && (
              <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">Total Revenue</p>
                  <p className="font-display text-sm text-primary">${product.totalUnitRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">Total Cost</p>
                  <p className="font-display text-sm text-red-500">${product.totalUnitCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-1">Total Profit</p>
                  <p className="font-display text-sm text-green-500">${(product.totalUnitRevenue - product.totalUnitCost).toFixed(2)}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="bg-card border-border/40">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">{selectedProduct.name} — Financials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-6">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Cost Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.cost_price || ''}
                  onChange={e => setEditForm({ ...editForm, cost_price: e.target.value })}
                />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Delivery Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.delivery_cost || ''}
                  onChange={e => setEditForm({ ...editForm, delivery_cost: e.target.value })}
                />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Merchant Fee %</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={editForm.merchant_fee_percent || ''}
                  onChange={e => setEditForm({ ...editForm, merchant_fee_percent: e.target.value })}
                />
              </div>

              {/* Live calculation */}
              <div className="bg-secondary/40 rounded-xl p-4 space-y-2">
                <p className="font-display text-sm text-foreground mb-3">Live Calculation</p>
                {editForm.cost_price !== undefined && (
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sale Price:</span>
                      <span className="font-display text-primary">${selectedProduct.salePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span>${editForm.cost_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span>${editForm.delivery_cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merchant Fee:</span>
                      <span>${(selectedProduct.salePrice * (editForm.merchant_fee_percent / 100)).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border/30 pt-2 flex justify-between font-display">
                      <span>Profit/Unit:</span>
                      <span className="text-green-500">
                        ${(selectedProduct.salePrice - editForm.cost_price - editForm.delivery_cost - (selectedProduct.salePrice * (editForm.merchant_fee_percent / 100))).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setSelectedProduct(null)} className="flex-1 rounded-full">
                  Cancel
                </Button>
                <Button onClick={handleEditProduct} className="flex-1 rounded-full">
                  Save Financials
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}