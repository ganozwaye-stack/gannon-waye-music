import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateProductProfitability } from '@/lib/enterpriseFinancials';

export default function ProductFinancials({ product }) {
  const [financials, setFinancials] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (product) {
      const calc = calculateProductProfitability(product);
      setFinancials(calc);
      
      // Generate alerts
      const newAlerts = [];
      if (!product.cost_price) newAlerts.push({ type: 'warning', message: 'Cost price not set' });
      if (!product.delivery_cost) newAlerts.push({ type: 'warning', message: 'Delivery cost not set' });
      if (calc.profitability.profit < 0) newAlerts.push({ type: 'error', message: 'Selling at a loss' });
      if (calc.profitability.marginPercent < 15) newAlerts.push({ type: 'warning', message: 'Low margin (<15%)' });
      if (product.stock_quantity < 10) newAlerts.push({ type: 'info', message: 'Low stock alert' });
      if (product.stock_quantity === 0) newAlerts.push({ type: 'error', message: 'Out of stock' });
      
      setAlerts(newAlerts);
    }
  }, [product]);

  if (!financials) return null;

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => {
            const Icon = alert.type === 'error' ? AlertTriangle : alert.type === 'warning' ? AlertTriangle : Info;
            const colors = alert.type === 'error' ? 'text-red-500 bg-red-500/10' : alert.type === 'warning' ? 'text-yellow-500 bg-yellow-500/10' : 'text-blue-500 bg-blue-500/10';
            return (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${colors}`}>
                <Icon className="w-4 h-4" />
                <p className="font-body text-sm">{alert.message}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Pricing Breakdown */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg text-foreground">Pricing Breakdown</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Sale Price</span>
              <span className="font-display text-lg text-primary">${financials.pricing.salePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Cost Price</span>
              <span className="font-display text-sm text-foreground">${financials.pricing.costPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Delivery Cost</span>
              <span className="font-display text-sm text-foreground">${financials.pricing.deliveryCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Merchant Fee ({financials.pricing.merchantFeePercent}%)</span>
              <span className="font-display text-sm text-foreground">${financials.pricing.merchantFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-border/40 pt-3 flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Total Cost</span>
              <span className="font-display text-lg text-red-500">${financials.profitability.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profitability Analysis */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-display text-lg text-green-900">Profitability Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-body text-xs text-green-700 mb-1">Profit Per Unit</p>
                <p className={`font-display text-2xl ${financials.profitability.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${financials.profitability.profit.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-green-700 mb-1">Profit Margin</p>
                <p className={`font-display text-2xl ${
                  financials.profitability.marginPercent >= 30 ? 'text-green-600' : 
                  financials.profitability.marginPercent >= 15 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {financials.profitability.marginPercent.toFixed(1)}%
                </p>
              </div>
            </div>
            
            {/* Margin Tier Badge */}
            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-green-700">Margin Tier:</span>
              <Badge className={
                financials.analysis.marginTier === 'excellent' ? 'bg-green-600' :
                financials.analysis.marginTier === 'good' ? 'bg-yellow-600' : 'bg-red-600'
              }>
                {financials.analysis.marginTier.toUpperCase()}
              </Badge>
            </div>

            {/* Break-even Analysis */}
            {financials.profitability.profit < 0 && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                <p className="font-body text-xs text-red-800">
                  ⚠️ Selling at a loss. Need to sell {financials.analysis.breakEvenUnits} units to break even on costs.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Status */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg text-foreground">Inventory Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Current Stock</span>
              <Badge variant={product.stock_quantity === 0 ? 'destructive' : product.stock_quantity < 10 ? 'secondary' : 'default'}>
                {product.stock_quantity} units
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-muted-foreground">Available Sizes</span>
              <span className="font-display text-sm text-foreground">{product.sizes_available?.length || 0} sizes</span>
            </div>
            {product.stock_quantity > 0 && (
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="font-body text-xs text-muted-foreground mb-1">Inventory Value</p>
                <p className="font-display text-lg text-primary">
                  ${(product.cost_price * product.stock_quantity).toFixed(2)} cost / ${(product.sale_price * product.stock_quantity).toFixed(2)} retail
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {financials.profitability.marginPercent < 30 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-display text-lg text-blue-900">Optimization Tips</h3>
            </div>
            <ul className="space-y-2 font-body text-sm text-blue-800">
              {financials.profitability.marginPercent < 15 && (
                <li>• Consider increasing sale price to improve margin</li>
              )}
              {!product.cost_price && (
                <li>• Add cost price for accurate profit calculations</li>
              )}
              {!product.delivery_cost && (
                <li>• Add delivery cost to calculate true profitability</li>
              )}
              {product.stock_quantity < 10 && (
                <li>• Restock soon to avoid stockouts</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}