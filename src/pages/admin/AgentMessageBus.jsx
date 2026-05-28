import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MessageSquare, RefreshCw, Eye, CheckCircle2, Filter, XCircle } from 'lucide-react';

const STATUS_COLORS = {
  new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  triaged: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  assigned: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  in_progress: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  awaiting_approval: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  blocked: 'bg-red-500/20 text-red-300 border-red-500/30',
  resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
  failed: 'bg-red-600/20 text-red-200 border-red-600/30',
};

const PRIORITY_COLORS = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  high: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  low: 'bg-secondary text-muted-foreground border-border',
};

export default function AgentMessageBus() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ['all-agent-messages'],
    queryFn: () => base44.entities.AgentMessage.list('-created_date', 100),
    refetchInterval: 15000,
  });

  const resolveMutation = useMutation({
    mutationFn: id => base44.entities.AgentMessage.update(id, { status: 'resolved', resolved_date: new Date().toISOString() }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['all-agent-messages'] }); toast({ title: 'Resolved' }); },
  });

  const failMutation = useMutation({
    mutationFn: id => base44.entities.AgentMessage.update(id, { status: 'failed' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['all-agent-messages'] }),
  });

  const statuses = ['all', 'new', 'in_progress', 'awaiting_approval', 'blocked', 'resolved', 'failed'];
  const types = ['all', ...new Set(messages.map(m => m.message_type).filter(Boolean))];

  const filtered = messages.filter(m => {
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchType = typeFilter === 'all' || m.message_type === typeFilter;
    return matchStatus && matchType;
  });

  const byStatus = messages.reduce((acc, m) => { acc[m.status] = (acc[m.status] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin/openai-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">AI Agent Message Bus</h1>
            <p className="text-sm text-muted-foreground mt-1">All inter-system messages · Repair · Content · Security · Approvals</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3 h-3 mr-1" />Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', count: messages.length, color: 'text-foreground' },
          { label: 'Active', count: messages.filter(m => !['resolved','failed'].includes(m.status)).length, color: 'text-amber-400' },
          { label: 'Critical', count: messages.filter(m => m.priority === 'critical').length, color: 'text-red-400' },
          { label: 'Awaiting Approval', count: byStatus.awaiting_approval || 0, color: 'text-orange-400' },
        ].map(({ label, count, color }) => (
          <Card key={label}><CardContent className="p-3 text-center">
            <p className={`text-2xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <p className="text-xs text-muted-foreground mr-1 self-center">Status:</p>
          {statuses.map(s => (
            <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" className="h-7 text-xs"
              onClick={() => setStatusFilter(s)}>{s}</Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <p className="text-xs text-muted-foreground mr-1 self-center">Type:</p>
          {types.slice(0, 8).map(t => (
            <Button key={t} variant={typeFilter === t ? 'default' : 'outline'} size="sm" className="h-7 text-xs"
              onClick={() => setTypeFilter(t)}>{t?.replace(/_/g, ' ')}</Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading messages...</p>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">No messages match filter. Run OpenAI assistants to generate messages.</CardContent></Card>
        ) : filtered.map(msg => (
          <Card key={msg.id} className={
            msg.priority === 'critical' && msg.status !== 'resolved' ? 'border-red-500/20' :
            msg.status === 'resolved' ? 'opacity-60 border-border/20' : 'border-border/30'
          }>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Badge className={`${PRIORITY_COLORS[msg.priority] || ''} text-xs`} variant="outline">{msg.priority}</Badge>
                    <Badge className={`${STATUS_COLORS[msg.status] || ''} text-xs`} variant="outline">{msg.status?.replace(/_/g,' ')}</Badge>
                    <Badge className="bg-secondary text-xs text-muted-foreground" variant="outline">{msg.message_type?.replace(/_/g,' ')}</Badge>
                  </div>
                  <p className="text-sm font-semibold">{msg.subject}</p>
                  {msg.summary && <p className="text-xs text-muted-foreground mt-0.5">{msg.summary.substring(0, 150)}</p>}
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {msg.from_system && <span>{msg.from_system} → {msg.to_system}</span>}
                    {msg.cost_estimate > 0 && <span>~${msg.cost_estimate.toFixed(5)}</span>}
                    <span>{new Date(msg.created_date).toLocaleString('en-AU', { timeZone: 'Australia/Sydney', dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {msg.linked_route && (
                    <Link to={msg.linked_route}>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3 h-3" /></Button>
                    </Link>
                  )}
                  {msg.status !== 'resolved' && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-green-400" onClick={() => resolveMutation.mutate(msg.id)}>
                      <CheckCircle2 className="w-3 h-3 mr-1" />Resolve
                    </Button>
                  )}
                  {msg.status !== 'failed' && msg.status !== 'resolved' && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400" onClick={() => failMutation.mutate(msg.id)}>
                      <XCircle className="w-3 h-3 mr-1" />Fail
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}