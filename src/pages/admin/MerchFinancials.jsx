import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { DollarSign, Package, TrendingUp, Zap, Edit2, Search, Plus, ArrowLeft, Save, X, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  calculateProductProfitability,
  calculateOrderFinancials,
  calculateInventoryValuation,
} from '@/lib/businessLogic';

export default function MerchFinancials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [bulkEditMode, setBulkEditMode] = useState(false);

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

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await base44.entities.MerchProduct.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      toast({ title: 'Product financials updated successfully' });
      setSelectedProduct(null);
    },
    onError: () => {
      toast({ title: 'Error updating product', variant: 'destructive' });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates) => {
      const promises = updates.map(({ id, data }) => base44.entities.MerchProduct.update(id, data));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      setBulkEditMode(false);
      toast({ title: 'Bulk update complete', description: 'All products updated' });
    },
  });

  // Calculate store totals and product financials
  const storeTotals = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalCosts = orders.reduce((sum, o) => {
      const itemsCost = o.items?.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.product_id);
        return itemSum + ((product?.cost_price || 0) + (product?.delivery_cost || 0)) * (item.quantity || 1);
      }, 0) || 0;
      return sum + itemsCost;
    }, 0);
    const totalProfit = totalRevenue - totalCosts;
    const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      profitMarginPercent,
    };
  }, [products, orders]);

  const productsWithFinancials = useMemo(() => {
    return products.map(p => {
      const profitability = calculateProductProfitability(p);
      const unitsSold = orders.reduce((sum, order) => {
        const item = order.items?.find(i => i.product_id === p.id);
        return sum + (item?.quantity || 0);
      }, 0);

      return {
        ...p,
        salePrice: p.sale_price,
        costPrice: p.cost_price,
        deliveryCost: p.delivery_cost,
        merchantFeePercent: p.merchant_fee_percent || 3.5,
        merchantFee: profitability.pricing.merchantFee,
        subtotal: p.sale_price - p.cost_price - p.delivery_cost,
        totalProfit: profitability.profitability.profit,
        profitMarginPercent: profitability.profitability.marginPercent,
        unitsSold,
        totalUnitRevenue: p.sale_price * unitsSold,
        totalUnitCost: (p.cost_price + p.delivery_cost) * unitsSold,
        missingCosts: !p.cost_price || !p.delivery_cost,
      };
    });
  }, [products, orders]);

  const filtered = useMemo(() => {
    if (!searchTerm) return productsWithFinancials;
    return productsWithFinancials.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productsWithFinancials, searchTerm]);

  const productsMissingCosts = productsWithFinancials.filter(p => p.missingCosts);

  const handleEditProduct = async () => {
    updateMutation.mutate({
      id: selectedProduct.id,
      data: {
        cost_price: Number(editForm.cost_price),
        delivery_cost: Number(editForm.delivery_cost),
        merchant_fee_percent: Number(editForm.merchant_fee_percent),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/financials">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl text-foreground">Product Costing Dashboard</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Enter cost prices, delivery costs, and view profit margins
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/merch">
            <Button variant="outline" className="gap-2 rounded-full">
              <Plus className="w-4 h-4" /> Add New Product
            </Button>
          </Link>
          <Button 
            onClick={() => setBulkEditMode(!bulkEditMode)} 
            variant={bulkEditMode ? 'default' : 'outline'}
            className="gap-2 rounded-full"
          >
            <Edit2 className="w-4 h-4" /> {bulkEditMode ? 'Done' : 'Bulk Edit'}
          </Button>
        </div>
      </div>

      {/* Alert: Missing Costs */}
      {productsMissingCosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-900/20 border border-amber-600/30 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-amber-100 mb-2">
                {productsMissingCosts.length} Product{productsMissingCosts.length > 1 ? 's' : ''} Need Cost Data
              </p>
              <p className="font-body text-xs text-amber-200/70 mb-3">
                Click "Edit" on each product below to enter cost prices and delivery costs.
              </p>
              <div className="flex gap-2">
                {bulkEditMode && (
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={() => {
                    const updates = productsMissingCosts.map(p => ({
                      id: p.id,
                      data: { cost_price: 20, delivery_cost: 8, merchant_fee_percent: 3.5 }
                    }));
                    bulkUpdateMutation.mutate(updates);
                  }}>
                    <Save className="w-3 h-3 mr-2" /> Auto-Fill Defaults
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Store Totals */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Revenue', value: `$${storeTotals.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
          { label: 'Costs', value: `$${storeTotals.totalCosts.toFixed(2)}`, icon: Package, color: 'text-red-500' },
          { label: 'Profit', value: `$${storeTotals.totalProfit.toFixed(2)}`, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Margin %', value: `${storeTotals.profitMarginPercent.toFixed(1)}%`, icon: Zap, color: 'text-yellow-500' },
          { label: 'Products', value: products.length, icon: Package, color: 'text-blue-500' },
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

      {/* Products List */}
      <div className="space-y-3">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
          >
            <Card className={product.missingCosts ? 'border-amber-600/30 bg-amber-900/10' : ''}>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-sm text-foreground font-medium">{product.name}</p>
                      {product.missingCosts && (
                        <Badge variant="destructive" className="text-[10px]">Missing Costs</Badge>
                      )}
                    </div>
                    <p className="font-body text-xs text-muted-foreground mt-1">{product.unitsSold} sold · {product.sizes_available?.length || 0} sizes</p>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-2 md:col-span-2">
                    <div>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Sale Price</p>
                      <p className="font-display text-lg text-primary">${product.salePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Cost</p>
                      <p className="font-display text-sm text-foreground">${product.costPrice?.toFixed(2) || '—'}</p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Delivery</p>
                      <p className="font-display text-sm text-foreground">${product.deliveryCost?.toFixed(2) || '—'}</p>
                    </div>
                  </div>

                  {/* Profit Metrics */}
                  <div className="grid grid-cols-2 gap-2 md:col-span-2">
                    <div>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Profit/Unit</p>
                      <p className={`font-display text-lg ${product.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${product.totalProfit?.toFixed(2) || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Margin %</p>
                      <p className={`font-display text-lg ${product.profitMarginPercent >= 30 ? 'text-green-500' : product.profitMarginPercent >= 15 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {product.profitMarginPercent?.toFixed(1) || '—'}%
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end md:col-span-1">
                    {bulkEditMode ? (
                      <Button
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                        className="gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </Button>
                    ) : (
                      <>
                        <Link to="/admin/merch">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Edit2 className="w-3 h-3" /> Full Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setEditForm({
                              cost_price: product.costPrice || '',
                              delivery_cost: product.deliveryCost || '',
                              merchant_fee_percent: product.merchantFeePercent || 3.5,
                            });
                          }}
                          className="gap-1"
                        >
                          <Calculator className="w-3 h-3" /> Costs
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Expanded Financial Info */}
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
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-24 bg-card border border-border/40 rounded-2xl">
            <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground mb-4">No products found.</p>
            <Link to="/admin/merch">
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Add Your First Product
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-card border-border/40 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{selectedProduct?.name} — Financials</DialogTitle>
            <DialogDescription>
              Enter cost data. Profit calculations update automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Cost Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.cost_price || ''}
                onChange={e => setEditForm({ ...editForm, cost_price: e.target.value })}
                placeholder="What you paid supplier"
              />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Delivery Cost ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.delivery_cost || ''}
                onChange={e => setEditForm({ ...editForm, delivery_cost: e.target.value })}
                placeholder="Shipping per unit"
              />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Merchant Fee (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={editForm.merchant_fee_percent || ''}
                onChange={e => setEditForm({ ...editForm, merchant_fee_percent: e.target.value })}
                placeholder="Payment processor fee"
              />
              <p className="font-body text-[10px] text-muted-foreground mt-1">Default: 3.5% (Stripe/PayPal)</p>
            </div>

            {/* Live Calculation */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-primary" />
                <p className="font-display text-sm text-primary">Live Profit Calculation</p>
              </div>
              {editForm.cost_price !== undefined && selectedProduct && (
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sale Price:</span>
                    <span className="font-display text-primary">${selectedProduct.salePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Price:</span>
                    <span>${editForm.cost_price || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span>${editForm.delivery_cost || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Merchant Fee:</span>
                    <span>${(selectedProduct.salePrice * ((editForm.merchant_fee_percent || 3.5) / 100)).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-primary/30 pt-2 flex justify-between font-display">
                    <span>Profit/Unit:</span>
                    <span className="text-green-500">
                      ${(selectedProduct.salePrice - (editForm.cost_price || 0) - (editForm.delivery_cost || 0) - (selectedProduct.salePrice * ((editForm.merchant_fee_percent || 3.5) / 100))).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-primary/30 pt-2 flex justify-between">
                    <span>Margin %:</span>
                    <span className={
                      (selectedProduct.salePrice - (editForm.cost_price || 0) - (editForm.delivery_cost || 0) - (selectedProduct.salePrice * ((editForm.merchant_fee_percent || 3.5) / 100))) / selectedProduct.salePrice >= 0.3
                        ? 'text-green-500' : 'text-yellow-500'
                    }>
                      {(((selectedProduct.salePrice - (editForm.cost_price || 0) - (editForm.delivery_cost || 0) - (selectedProduct.salePrice * ((editForm.merchant_fee_percent || 3.5) / 100))) / selectedProduct.salePrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setSelectedProduct(null)} className="gap-2">
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button onClick={handleEditProduct} disabled={updateMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Financials'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}