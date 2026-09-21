import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, CheckCircle2, ClipboardList, Music, Package } from 'lucide-react';

// Top status strip of the Command Centre: the numbers that matter first.
export default function StatusStrip() {
  const { data: approvals = [] } = useQuery({
    queryKey: ['cc-approvals'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }).catch(() => []),
    initialData: [],
  });
  const { data: alerts = [] } = useQuery({
    queryKey: ['cc-alerts'],
    queryFn: () => base44.entities.RiskAlert.filter({ status: 'open' }).catch(() => []),
    initialData: [],
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['cc-pending-orders'],
    queryFn: () => base44.entities.MerchOrder.filter({ status: 'pending' }).catch(() => []),
    initialData: [],
  });
  const { data: todos = [] } = useQuery({
    queryKey: ['ownerWorkstreamTodos'],
    queryFn: () => base44.entities.OwnerWorkstreamTodo.filter({ status: { $ne: 'done' } }).catch(() => []),
    initialData: [],
  });
  const { data: releases = [] } = useQuery({
    queryKey: ['cc-private-releases'],
    queryFn: () => base44.entities.Release.filter({ is_published: false }, '-updated_date', 50).catch(() => []),
    initialData: [],
  });

  const cards = [
    {
      icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10',
      label: 'Pending approvals', value: approvals.length, link: '/admin/dashboard',
    },
    {
      icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10',
      label: 'Open risk alerts', value: alerts.length, link: '/admin/risk-alerts',
    },
    {
      icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10',
      label: 'Orders to fulfil', value: orders.length, link: '/admin/orders',
    },
    {
      icon: ClipboardList, color: 'text-amber-400', bg: 'bg-amber-500/10',
      label: 'Active to-dos', value: todos.length, link: '/admin/command-centre',
    },
    {
      icon: Music, color: 'text-emerald-400', bg: 'bg-emerald-500/10',
      label: 'Private releases', value: releases.length, link: '/admin/release-email-studio',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((c) => (
        <Link key={c.label} to={c.link}>
          <Card className="hover:border-primary/30 transition-all cursor-pointer h-full">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${c.bg} p-2 rounded-lg`}>
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground truncate">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}