import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ShoppingBag, Package, Users, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { data: releases } = useQuery({ queryKey: ['releases'], queryFn: () => base44.entities.Release.list(), initialData: [] });
  const { data: products } = useQuery({ queryKey: ['merchProducts'], queryFn: () => base44.entities.MerchProduct.list(), initialData: [] });
  const { data: orders } = useQuery({ queryKey: ['merchOrders'], queryFn: () => base44.entities.MerchOrder.list(), initialData: [] });
  const { data: posts } = useQuery({ queryKey: ['fanPosts'], queryFn: () => base44.entities.FanPost.list(), initialData: [] });

  const stats = [
    { label: 'Releases', value: releases.length, icon: Music, path: '/admin/releases', color: 'text-primary' },
    { label: 'Products', value: products.length, icon: ShoppingBag, path: '/admin/merch', color: 'text-chart-2' },
    { label: 'Orders', value: orders.length, icon: Package, path: '/admin/orders', color: 'text-chart-4' },
    { label: 'Fan Posts', value: posts.length, icon: Users, path: '/admin/fans', color: 'text-chart-5' },
  ];

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const recordingReleases = releases.filter(r => r.status !== 'released');

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.path}>
              <Card className="bg-card border-border/40 hover:border-primary/20 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <Icon className={`w-5 h-5 ${stat.color} mb-3`} />
                  <p className="font-display text-3xl text-foreground">{stat.value}</p>
                  <p className="font-body text-xs text-muted-foreground tracking-wider uppercase mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card className="bg-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-display text-lg">Pending Orders</CardTitle>
            <Link to="/admin/orders" className="font-body text-xs text-primary flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-4">No pending orders</p>
            ) : (
              <div className="space-y-3">
                {pendingOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="font-body text-sm text-foreground">{order.customer_name}</p>
                      <p className="font-body text-xs text-muted-foreground">{order.items?.length || 0} item(s)</p>
                    </div>
                    <p className="font-display text-sm text-primary">${order.total_amount?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* In Progress Releases */}
        <Card className="bg-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-display text-lg">Releases in Progress</CardTitle>
            <Link to="/admin/releases" className="font-body text-xs text-primary flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recordingReleases.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground py-4">All releases are live</p>
            ) : (
              <div className="space-y-3">
                {recordingReleases.slice(0, 5).map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="font-body text-sm text-foreground">{r.title}</p>
                      <p className="font-body text-xs text-muted-foreground capitalize">{r.status?.replace(/_/g, ' ')}</p>
                    </div>
                    {r.release_date && (
                      <p className="font-body text-xs text-muted-foreground">
                        {new Date(r.release_date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}