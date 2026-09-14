import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { ArrowUpRight, CheckCircle, Flame } from 'lucide-react';

// What needs the owner right now, merged from every old dashboard cluster:
// approvals, pending orders, raw social assets and unread contact messages.
export default function ActionsRequiredCard() {
  const { data: approvals = [] } = useQuery({
    queryKey: ['cc-approvals-list'],
    queryFn: () => base44.entities.ApprovalQueue.filter({ status: 'pending' }).catch(() => []),
    initialData: [],
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['cc-orders-list'],
    queryFn: () => base44.entities.MerchOrder.filter({ status: 'pending' }).catch(() => []),
    initialData: [],
  });
  const { data: rawAssets = [] } = useQuery({
    queryKey: ['cc-raw-assets'],
    queryFn: () => base44.entities.SocialAsset.filter({ status: 'raw' }).catch(() => []),
    initialData: [],
  });
  const { data: messages = [] } = useQuery({
    queryKey: ['cc-new-messages'],
    queryFn: () => base44.entities.ContactSubmission.filter({ status: 'new' }).catch(() => []),
    initialData: [],
  });

  const rows = [
    approvals.length > 0 && {
      count: approvals.length,
      text: 'approval queue item' + (approvals.length === 1 ? '' : 's') + ' awaiting your decision.',
      link: '/admin/approval-queue',
    },
    orders.length > 0 && {
      count: orders.length,
      text: 'merch order' + (orders.length === 1 ? '' : 's') + ' pending fulfilment.',
      link: '/admin/orders',
    },
    rawAssets.length > 0 && {
      count: rawAssets.length,
      text: 'raw social asset' + (rawAssets.length === 1 ? '' : 's') + ' awaiting brand sign-off.',
      link: '/admin/social-asset-library',
    },
    messages.length > 0 && {
      count: messages.length,
      text: 'new contact message' + (messages.length === 1 ? '' : 's') + ' to read.',
      link: '/admin/communications-hub',
    },
  ].filter(Boolean);

  return (
    <Card className="border-border/40 h-full">
      <CardHeader>
        <CardTitle className="font-display text-lg text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500" /> Actions Required Now
        </CardTitle>
        <CardDescription className="text-xs">
          Everything across the business that is waiting on you, in one list.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {rows.length === 0 && (
          <div className="p-4 text-center border border-dashed border-border/30 rounded-xl text-xs text-muted-foreground">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-60" />
            <span>All clear. Nothing is waiting on you right now.</span>
          </div>
        )}
        {rows.map((row) => (
          <Link key={row.link} to={row.link} className="block">
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between text-xs hover:bg-primary/20 transition-colors">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary shrink-0">{row.count}</Badge>
                <span className="text-foreground">{row.text}</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-primary shrink-0" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}