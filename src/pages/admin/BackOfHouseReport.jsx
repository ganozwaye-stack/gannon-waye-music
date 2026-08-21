import { useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, Heart, ShoppingBag, Mail, TrendingUp, Star } from 'lucide-react';

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function BackOfHouseReport() {
  const { data: subscribers } = useQuery({ queryKey: ['subscribers'], queryFn: () => base44.entities.EmailSubscriber.list('-created_date'), initialData: [] });
  const { data: prefs } = useQuery({ queryKey: ['emailPrefs'], queryFn: () => base44.entities.EmailPreference.list('-created_date'), initialData: [] });
  const { data: posts } = useQuery({ queryKey: ['fanPosts'], queryFn: () => base44.entities.FanPost.list('-created_date'), initialData: [] });
  const { data: interests } = useQuery({ queryKey: ['interests'], queryFn: () => base44.entities.MerchInterest.list('-created_date'), initialData: [] });
  const { data: orders } = useQuery({ queryKey: ['orders'], queryFn: () => base44.entities.MerchOrder.list('-created_date'), initialData: [] });
  const { data: media } = useQuery({ queryKey: ['fanMedia'], queryFn: () => base44.entities.FanMedia.list('-created_date'), initialData: [] });

  // Last 30 days
  const cutoff30 = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString(); }, []);
  const cutoff7 = useMemo(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString(); }, []);

  const newSubs30 = subscribers.filter(s => s.created_date > cutoff30);
  const newSubs7 = subscribers.filter(s => s.created_date > cutoff7);
  const newPosts7 = posts.filter(p => p.created_date > cutoff7);
  const newOrders7 = orders.filter(o => o.created_date > cutoff7);

  // Promo targeting: fans who want merch updates
  const promoTargets = prefs.filter(p => p.consent_merch_drops || p.consent_new_music || p.consent_exclusive_content);

  // Interest summary by product
  const interestByProduct = useMemo(() => {
    return interests.reduce((acc, i) => {
      acc[i.product_name] = (acc[i.product_name] || 0) + 1;
      return acc;
    }, {});
  }, [interests]);

  // Top community contributors (most posts)
  const postsByAuthor = useMemo(() => {
    const map = {};
    posts.forEach(p => {
      if (!p.author_name) return;
      map[p.author_name] = { count: (map[p.author_name]?.count || 0) + 1, email: p.author_email };
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count).slice(0, 10);
  }, [posts]);

  const statCards = [
    { label: 'Total Subscribers', value: subscribers.length, icon: Mail, color: 'text-primary', sub: `+${newSubs7.length} this week` },
    { label: 'New This Month', value: newSubs30.length, icon: UserPlus, color: 'text-chart-2', sub: `+${newSubs7.length} last 7 days` },
    { label: 'Community Posts', value: posts.length, icon: MessageSquare, color: 'text-chart-4', sub: `${newPosts7.length} this week` },
    { label: 'Merch Interests', value: interests.length, icon: Heart, color: 'text-chart-5', sub: `${Object.keys(interestByProduct).length} products` },
    { label: 'Promo Targets', value: promoTargets.length, icon: Star, color: 'text-primary', sub: 'opted into merch/music' },
    { label: 'Orders (7 days)', value: newOrders7.length, icon: ShoppingBag, color: 'text-chart-3', sub: `${orders.length} total orders` },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl text-foreground">Back of House Report</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Community growth, engagement, and promo-ready audience data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="bg-card border-border/40">
              <CardContent className="p-5">
                <Icon className={`w-4 h-4 ${s.color} mb-2`} />
                <p className="font-display text-3xl text-foreground">{s.value}</p>
                <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mt-1">{s.label}</p>
                <p className="font-body text-[10px] text-primary/70 mt-1">{s.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscribers */}
        <Card className="bg-card border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" /> Recent Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No subscribers yet</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {subscribers.slice(0, 20).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                    <div>
                      <p className="font-body text-sm text-foreground">{s.name || '(no name)'}</p>
                      <p className="font-body text-xs text-muted-foreground">{s.email}</p>
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground/60">{timeAgo(s.created_date)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Promo Targets — fans opted in for merch/music news */}
        <Card className="bg-card border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> Promo-Ready Fans
            </CardTitle>
            <p className="font-body text-xs text-muted-foreground">Opted into merch drops, new music or exclusive content</p>
          </CardHeader>
          <CardContent>
            {promoTargets.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No preference data yet</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {promoTargets.slice(0, 20).map(p => (
                  <div key={p.id} className="flex items-start justify-between py-1.5 border-b border-border/20 last:border-0">
                    <div>
                      <p className="font-body text-sm text-foreground">{p.name || '(no name)'}</p>
                      <p className="font-body text-xs text-muted-foreground">{p.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[140px]">
                      {p.consent_merch_drops && <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 text-primary border-primary/30">Merch</Badge>}
                      {p.consent_new_music && <Badge variant="outline" className="text-[9px] px-1.5 py-0.5">Music</Badge>}
                      {p.consent_exclusive_content && <Badge variant="outline" className="text-[9px] px-1.5 py-0.5">Exclusive</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Merch Interest by Product */}
        <Card className="bg-card border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" /> Merch Interest by Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(interestByProduct).length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No interest registrations yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(interestByProduct).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-body text-sm text-foreground">{name}</p>
                      <p className="font-body text-xs text-primary font-medium">{count} interested</p>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(count / interests.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Community Contributors */}
        <Card className="bg-card border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Top Community Voices
            </CardTitle>
            <p className="font-body text-xs text-muted-foreground">Most active in the fan forum</p>
          </CardHeader>
          <CardContent>
            {postsByAuthor.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No posts yet</p>
            ) : (
              <div className="space-y-2">
                {postsByAuthor.map(([name, data], i) => (
                  <div key={name} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-body text-xs text-muted-foreground/40 w-4">{i + 1}</span>
                      <div>
                        <p className="font-body text-sm text-foreground">{name}</p>
                        {data.email && <p className="font-body text-xs text-muted-foreground">{data.email}</p>}
                      </div>
                    </div>
                    <Badge variant="outline" className="font-body text-xs">{data.count} post{data.count !== 1 ? 's' : ''}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-card border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 px-2 text-xs tracking-wider uppercase text-muted-foreground font-normal">Customer</th>
                    <th className="text-left py-2 px-2 text-xs tracking-wider uppercase text-muted-foreground font-normal">Email</th>
                    <th className="text-left py-2 px-2 text-xs tracking-wider uppercase text-muted-foreground font-normal">Items</th>
                    <th className="text-left py-2 px-2 text-xs tracking-wider uppercase text-muted-foreground font-normal">Total</th>
                    <th className="text-left py-2 px-2 text-xs tracking-wider uppercase text-muted-foreground font-normal">Status</th>
                    <th className="text-left py-2 px-2 text-xs tracking-wider uppercase text-muted-foreground font-normal">When</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 15).map(o => (
                    <tr key={o.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/20">
                      <td className="py-2 px-2 text-foreground">{o.customer_name}</td>
                      <td className="py-2 px-2 text-muted-foreground text-xs">{o.customer_email}</td>
                      <td className="py-2 px-2 text-muted-foreground text-xs">{o.items?.length || 0} item(s)</td>
                      <td className="py-2 px-2 text-primary font-medium">${o.total_amount?.toFixed(2)}</td>
                      <td className="py-2 px-2">
                        <Badge variant="outline" className="text-[10px] capitalize">{o.status}</Badge>
                      </td>
                      <td className="py-2 px-2 text-muted-foreground text-xs">{timeAgo(o.created_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fan Media Uploads */}
      <Card className="bg-card border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Fan Media Wall Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="font-display text-3xl text-foreground">{media.length}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Total Uploads</p>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="font-display text-3xl text-foreground">{media.filter(m => m.is_featured).length}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Featured</p>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="font-display text-3xl text-foreground">{media.filter(m => m.file_type === 'video').length}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Videos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}