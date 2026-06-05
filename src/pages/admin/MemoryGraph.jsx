import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Network, Loader2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const NODE_TYPES = ['person', 'document', 'campaign', 'product', 'idea', 'risk', 'legal', 'revenue_opportunity', 'creative_project', 'other'];

const TYPE_CONFIG = {
  person: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', emoji: '👤' },
  document: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', emoji: '📄' },
  campaign: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', emoji: '📣' },
  product: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', emoji: '📦' },
  idea: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', emoji: '💡' },
  risk: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', emoji: '⚠️' },
  legal: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', emoji: '⚖️' },
  revenue_opportunity: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', emoji: '💰' },
  creative_project: { color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30', emoji: '🎨' },
  other: { color: 'text-muted-foreground', bg: 'bg-secondary', border: 'border-border', emoji: '🔗' },
};

export default function MemoryGraph() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({ title: '', node_type: 'idea', summary: '', source: '', sensitivity_level: 'internal', importance_score: 5, created_by_agent: '', tags: '' });

  const { data: nodes = [], isLoading } = useQuery({
    queryKey: ['memory-graph'],
    queryFn: () => base44.entities.MemoryGraphNode.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.MemoryGraphNode.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['memory-graph'] }); setShowForm(false); toast({ title: 'Node added to memory graph' }); },
  });

  const filtered = nodes.filter(n => {
    const matchType = filterType === 'all' || n.node_type === filterType;
    const matchSearch = !search || n.title?.toLowerCase().includes(search.toLowerCase()) || n.summary?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const grouped = NODE_TYPES.reduce((acc, type) => {
    acc[type] = filtered.filter(n => n.node_type === type);
    return acc;
  }, {});

  const typeCounts = NODE_TYPES.reduce((acc, type) => {
    acc[type] = nodes.filter(n => n.node_type === type).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Memory Graph</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Connected knowledge nodes — people, ideas, risks, opportunities, projects</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gradient-gold-button border-0"><Plus className="w-4 h-4 mr-1" />Add Node</Button>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — Memory nodes are informational only. No automated actions are taken from this graph without approval.</p>
      </div>

      {/* Type filter tiles */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
        <button onClick={() => setFilterType('all')} className={`border rounded-lg p-2 text-center transition-all ${filterType === 'all' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/40'}`}>
          <p className="text-xs font-bold text-foreground">{nodes.length}</p>
          <p className="text-[9px] text-muted-foreground">All</p>
        </button>
        {NODE_TYPES.map(type => {
          const cfg = TYPE_CONFIG[type];
          return (
            <button key={type} onClick={() => setFilterType(filterType === type ? 'all' : type)}
              className={`border rounded-lg p-2 text-center transition-all ${filterType === type ? `${cfg.border} ${cfg.bg}` : 'border-border hover:border-primary/40'}`}>
              <p className="text-sm">{cfg.emoji}</p>
              <p className={`text-xs font-bold ${typeCounts[type] > 0 ? cfg.color : 'text-muted-foreground'}`}>{typeCounts[type]}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search memory nodes..." className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Network className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No memory nodes yet. Start adding knowledge, people, ideas, and connections.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {NODE_TYPES.map(type => {
            const typeNodes = grouped[type];
            if (!typeNodes || typeNodes.length === 0) return null;
            const cfg = TYPE_CONFIG[type];
            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cfg.emoji}</span>
                  <p className={`font-medium text-sm capitalize ${cfg.color}`}>{type.replace(/_/g, ' ')} ({typeNodes.length})</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {typeNodes.map(node => (
                    <Card key={node.id} className={`border ${cfg.border} hover:shadow-md transition-all`}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm leading-tight">{node.title}</p>
                          {node.importance_score && <Badge variant="outline" className="text-xs shrink-0">{node.importance_score}/10</Badge>}
                        </div>
                        {node.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{node.summary}</p>}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {node.sensitivity_level && <Badge variant="outline" className="text-[9px]">{node.sensitivity_level}</Badge>}
                          {node.tags?.slice(0, 2).map(tag => <Badge key={tag} variant="outline" className="text-[9px]">#{tag}</Badge>)}
                        </div>
                        {node.created_by_agent && <p className="text-[9px] text-muted-foreground mt-1">by {node.created_by_agent}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Memory Node</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Node title" /></div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={form.node_type} onValueChange={v => setForm(f => ({ ...f, node_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{NODE_TYPES.map(t => <SelectItem key={t} value={t}><span className="mr-2">{TYPE_CONFIG[t].emoji}</span>{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Summary</Label><Input value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="Brief description" /></div>
            <div><Label className="text-xs">Source</Label><Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Where did this come from?" /></div>
            <div><Label className="text-xs">Tags (comma separated)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" /></div>
            <Button className="w-full gradient-gold-button border-0" disabled={!form.title || createMutation.isPending}
              onClick={() => createMutation.mutate({ ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [], importance_score: Number(form.importance_score) })}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Add Node
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}