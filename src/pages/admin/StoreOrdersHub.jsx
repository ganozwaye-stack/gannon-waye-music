import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Package, Calculator,
  Send, RefreshCw, BarChart3, AlertTriangle, ShieldCheck, Info
} from 'lucide-react';

export default function StoreOrdersHub() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('orders');

  // UTM builder states
  const [utmSource, setUtmSource] = useState('tiktok');
  const [utmMedium, setUtmMedium] = useState('bio_link');
  const [utmCampaign, setUtmCampaign] = useState('thankyou_june5');
  const [generatedLink, setGeneratedLink] = useState('');

  // Landed Cost calculator states
  const [productCost, setProductCost] = useState('15.00');
  const [shippingCost, setShippingCost] = useState('7.50');
  const [marketplaceFee, setMarketplaceFee] = useState('1.50');
  const [stripeFee, setStripeFee] = useState('0.75');
  const [adCost, setAdCost] = useState('0.00');
  const [packagingCost, setPackagingCost] = useState('1.00');
  const [refundAllowance, setRefundAllowance] = useState('5.00'); // % allowance
  const [sellingPrice, setSellingPrice] = useState('45.00');

  // Fetch merch orders
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['merchOrders-hub'],
    queryFn: () => base44.entities.MerchOrder.list('-created_date'),
    initialData: [],
  });

  const activeOrders = orders.filter(o => o.status !== 'duplicate' && o.financial_status !== 'duplicate_void');

  // UTM generator
  const buildUtmLink = () => {
    const link = `https://gannonwaye.com/store?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`;
    setGeneratedLink(link);
    toast({ title: 'Campaign link generated ✓' });
  };

  // Landed cost calculator calculations
  const calculateFinancials = () => {
    const prod = Number(productCost) || 0;
    const ship = Number(shippingCost) || 0;
    const market = Number(marketplaceFee) || 0;
    const stripe = Number(stripeFee) || 0;
    const ad = Number(adCost) || 0;
    const pack = Number(packagingCost) || 0;
    const refundPct = Number(refundAllowance) || 0;
    const price = Number(sellingPrice) || 0;

    const landedCost = prod + ship + market + stripe + ad + pack;
    const refundReserve = price * (refundPct / 100);
    const totalExpenses = landedCost + refundReserve;
    const profit = price - totalExpenses;
    const margin = price > 0 ? (profit / price) * 100 : 0;

    return { landedCost, totalExpenses, profit, margin };
  };

  const calc = calculateFinancials();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Commerce Command</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Store & Orders Hub</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Monitor incoming customer orders, construct UTM campaigns, and audit product profit margins.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5 p-1 h-auto">
          <TabsTrigger value="orders" className="text-xs py-2"><Package className="w-3.5 h-3.5 mr-1 text-primary" /> Orders Registry</TabsTrigger>
          <TabsTrigger value="utm-builder" className="text-xs py-2"><BarChart3 className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Revenue Attribution</TabsTrigger>
          <TabsTrigger value="financial-calculator" className="text-xs py-2"><Calculator className="w-3.5 h-3.5 mr-1 text-green-400" /> Financial Truth</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><Send className="w-3.5 h-3.5 mr-1" /> All Store Tools</TabsTrigger>
        </TabsList>

        {/* ─── TAB: ORDERS OVERVIEW ──────────────────────────────────── */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Recent Orders</CardTitle>
                <CardDescription className="text-xs">Quick preview of recent customer orders. Click View details to process shipping.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
                ) : activeOrders.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs">No orders logged in database.</div>
                ) : (
                  <div className="space-y-3">
                    {activeOrders.slice(0, 5).map(order => (
                      <div key={order.id} className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-center justify-between text-xs cursor-pointer hover:border-primary/20" onClick={() => window.location.href = `/admin/orders?id=${order.id}`}>
                        <div>
                          <p className="font-semibold text-white">{order.customer_name}</p>
                          <p className="text-[10px] text-muted-foreground">{order.customer_email} · Status: {order.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">${order.total_amount?.toFixed(2)} AUD</p>
                          <p className="text-[9px] text-muted-foreground">ID: #{order.id.slice(-6)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Store Analytics</CardTitle>
                <CardDescription className="text-xs">Overall financials calculated from non-duplicate sales.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-secondary/20 rounded-xl border border-border/20">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Sales Revenue</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    ${activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toFixed(2)} AUD
                  </p>
                </div>

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/20">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pending Shipments</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">
                    {activeOrders.filter(o => o.status === 'pending').length} Orders
                  </p>
                </div>

                <Button variant="outline" className="w-full text-xs border-border/40" onClick={() => window.location.href = '/admin/orders'}>
                  Manage Shipping & Fulfillment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: UTM BUILDER & ATTRIBUTION ────────────────────────── */}
        <TabsContent value="utm-builder" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" /> Revenue Attribution Link Generator
              </CardTitle>
              <CardDescription className="text-xs">Track which TikTok post, QR code, or campaign link is driving merchandise checkout conversions.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-white">Traffic Source (e.g. tiktok, instagram, qr_flyer)</Label>
                  <Input value={utmSource} onChange={e => setUtmSource(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Traffic Medium (e.g. bio_link, stories_cta, paid_ad)</Label>
                  <Input value={utmMedium} onChange={e => setUtmMedium(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Campaign Name (e.g. thankyou_june5, mum_tribute)</Label>
                  <Input value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <Button onClick={buildUtmLink} className="w-full gradient-gold-button border-0 text-xs">
                  Generate Trackable Campaign URL
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-display text-sm font-semibold text-white">Generated Destination Link</h4>
                {generatedLink ? (
                  <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 space-y-3">
                    <pre className="p-3 bg-secondary/40 rounded-lg text-[10px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                      {generatedLink}
                    </pre>
                    <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { navigator.clipboard.writeText(generatedLink); toast({ title: 'Link copied' }); }}>
                      Copy Trackable Link
                    </Button>
                  </div>
                ) : (
                  <div className="h-44 border border-dashed border-border/30 rounded-xl flex items-center justify-center text-muted-foreground text-xs text-center p-4">
                    <p>Parameters entered on the left will generate a tracking URL with UTM parameters to attribute clicks and orders.</p>
                  </div>
                )}

                <div className="p-3 bg-secondary/20 rounded-xl border border-border/20 text-[10px] text-muted-foreground flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary shrink-0" />
                  <p>Attribution data is automatically tracked inside the database logs when checkout successes match incoming browser UTM referrers.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: LANDED COST & FINANCIAL TRUTH ────────────────────── */}
        <TabsContent value="financial-calculator" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-green-400" /> Landed Cost & Dropshipping Margin Auditor
              </CardTitle>
              <CardDescription className="text-xs">Calculate true margins on GanozMix Direct dropshipped goods before publishing them live to marketplaces.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-white">Product Supplier Cost ($)</Label>
                  <Input type="number" step="0.01" value={productCost} onChange={e => setProductCost(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Fulfillment & Shipping ($)</Label>
                  <Input type="number" step="0.01" value={shippingCost} onChange={e => setShippingCost(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">eBay Marketplace Fee ($)</Label>
                  <Input type="number" step="0.01" value={marketplaceFee} onChange={e => setMarketplaceFee(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Stripe / Payment Processing ($)</Label>
                  <Input type="number" step="0.01" value={stripeFee} onChange={e => setStripeFee(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Packaging & Handling ($)</Label>
                  <Input type="number" step="0.01" value={packagingCost} onChange={e => setPackagingCost(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Refund / Return Reserve (%)</Label>
                  <Input type="number" value={refundAllowance} onChange={e => setRefundAllowance(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs text-white">Target Marketplace Selling Price ($)</Label>
                  <Input type="number" step="0.01" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} className="bg-secondary/40 text-xs border-border/40" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-display text-sm font-semibold text-white">Margin Analysis</h4>
                <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs font-body">
                    <div>
                      <p className="text-muted-foreground">Product Landed Cost:</p>
                      <p className="text-base font-bold text-white">${calc.landedCost.toFixed(2)} AUD</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Costs + Refund Reserve:</p>
                      <p className="text-base font-bold text-white">${calc.totalExpenses.toFixed(2)} AUD</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit Per Sale:</p>
                      <p className={`text-base font-bold ${calc.profit >= 5 ? 'text-green-400' : 'text-red-400'}`}>
                        ${calc.profit.toFixed(2)} AUD
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Net Margin:</p>
                      <p className={`text-base font-bold ${calc.margin >= 20 ? 'text-green-400' : 'text-red-400'}`}>
                        {calc.margin.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border/10 pt-3 text-[10px] text-muted-foreground space-y-1">
                    <p className="font-bold text-white uppercase tracking-wider">Marketplace Financial Guidance:</p>
                    <p className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Margin exceeds safety baseline (target: &gt;20%).</p>
                    <p className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> Factor in fluctuations of supplier shipping charges.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: QUICK LINKS ────────────────────────────────────────── */}
        <TabsContent value="quick-links" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Merchandise List', desc: 'Create and edit products or stock variants.', link: '/admin/merch' },
              { title: 'Shipping Rates Config', desc: 'Adjust localized or country shipping zones.', link: '/admin/shipping-rates' },
              { title: 'Promo Codes Registry', desc: 'Set up campaign discount coupons.', link: '/admin/promo-codes' },
              { title: 'Order Financials', desc: 'View revenue dashboard charts.', link: '/admin/financials' },
              { title: 'Store Diagnostics', desc: 'Review Stripe payments checkout diagnostics.', link: '/admin/payment-diagnostics' },
              { title: 'GanozMix Margin Manager', desc: 'Review CJ / AliExpress supplier pricing metrics.', link: '/admin/ganozmix' }
            ].map(item => (
              <Card key={item.title} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = item.link}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                    {item.title} <Send className="w-3.5 h-3.5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
