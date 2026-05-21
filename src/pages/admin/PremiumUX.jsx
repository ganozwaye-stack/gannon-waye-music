import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Loader2, Star, Sparkles, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PRIORITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  high:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  medium:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  low:      { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
};

const STATUS_CONFIG = {
  open:        { color: 'text-red-400', bg: 'bg-red-500/10' },
  in_progress: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  resolved:    { color: 'text-green-400', bg: 'bg-green-500/10' },
  deferred:    { color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

const AUDIT_CATEGORIES = [
  'Basic looking screens',
  'Weak layouts',
  'Missing motion',
  'Poor conversion flow',
  'Dead ends',
  'Confusing copy',
  'Weak CTAs',
  'Weak luxury feel',
  'Missing trust signals',
  'Missing onboarding clarity',
  'Mobile experience issues',
];

const AUDIT_PROMPT = `You are a world-class premium UX auditor for luxury digital experiences. Audit this music artist platform (Gannon Waye):

PUBLIC PAGES: Home, Music, Store (merch + CD), Community (fan posts), Videos, Contact, Bookings, Mastering tool, Impact, About, FAQ, Lyrics
ADMIN PAGES: Command Centre, Executive Feed, Agent Intelligence, Ecommerce Command, Financial Dashboard, Approval Queue, Risk Alerts, Knowledge Vault, Ideas Engine, Blueprint Builder

AUDIT CATEGORIES TO COVER:
1. Basic looking screens
2. Weak layouts
3. Missing motion / animation
4. Poor conversion flow
5. Dead ends (no next step)
6. Confusing copy
7. Weak CTAs
8. Weak luxury feel
9. Missing trust signals
10. Missing onboarding clarity
11. Mobile experience issues

Generate 15–20 specific audit items. For EACH item output a JSON object with these exact fields:
{
  "issue": "Short issue name",
  "page_or_area": "Exact page or section",
  "category": "One of the 11 categories above",
  "why_it_matters": "Business/UX impact in 1–2 sentences",
  "premium_fix": "Specific, actionable cinematic/luxury fix in 1–2 sentences",
  "priority": "critical|high|medium|low",
  "estimated_impact": "e.g. +15% conversion, +trust, -bounce rate",
  "requires_approval": false
}

Output ONLY a valid JSON array of these objects, nothing else. No markdown, no preamble.`;

export default function PremiumUX() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Store audit items as KnowledgeVault entries tagged 'ux-audit-item'
  const { data: vaultItems = [], isLoading } = useQuery({
    queryKey: ['ux-audit-items'],
    queryFn: async () => {
      const items = await base44.entities.KnowledgeVault.list('-created_date', 200);
      return items.filter(i => i.tags?.includes('ux-audit-item'));
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.KnowledgeVault.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ux-audit-items'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.KnowledgeVault.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ux-audit-items'] }),
  });

  // Parse audit item from KnowledgeVault content field
  const parseItem = (vault) => {
    try { return JSON.parse(vault.content); } catch { return null; }
  };

  const auditItems = vaultItems.map(v => ({ ...parseItem(v), _id: v.id, _status: v.summary || 'open' })).filter(Boolean);

  const filtered = auditItems.filter(item => {
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item._status !== filterStatus) return false;
    return true;
  });

  const runAudit = async () => {
    setGenerating(true);
    try {
      const raw = await base44.integrations.Core.InvokeLLM({
        prompt: AUDIT_PROMPT,
        model: 'claude_sonnet_4_6',
      });

      let items;
      try {
        // Strip any possible markdown code fences
        const cleaned = raw.replace(/```json|```/g, '').trim();
        items = JSON.parse(cleaned);
      } catch {
        throw new Error('AI returned invalid JSON — try again');
      }

      if (!Array.isArray(items)) throw new Error('Expected JSON array');

      // Clear old items first, then save new ones
      for (const existing of vaultItems) {
        await base44.entities.KnowledgeVault.delete(existing.id);
      }

      for (const item of items) {
        await createMutation.mutateAsync({
          title: `UX Audit: ${item.issue}`,
          category: 'research',
          content: JSON.stringify(item),
          summary: 'open',
          source: 'Premium UX Audit Agent',
          tags: ['ux-audit-item', item.priority, item.category?.toLowerCase().replace(/\s+/g, '-')],
          access_level: 'admin_only',
        });
      }

      toast({ title: `Audit complete — ${items.length} issues found` });
      queryClient.invalidateQueries({ queryKey: ['ux-audit-items'] });
    } catch (err) {
      toast({ title: 'Audit failed', description: err?.message, variant: 'destructive' });
    }
    setGenerating(false);
  };

  const setStatus = async (item, status) => {
    const vault = vaultItems.find(v => v.id === item._id);
    if (!vault) return;
    await updateMutation.mutateAsync({ id: item._id, data: { summary: status } });
  };

  const stats = {
    total: auditItems.length,
    critical: auditItems.filter(i => i.priority === 'critical').length,
    high: auditItems.filter(i => i.priority === 'high').length,
    open: auditItems.filter(i => i._status === 'open').length,
    resolved: auditItems.filter(i => i._status === 'resolved').length,
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Premium UX Audit</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Structured audit of every major page and dashboard for luxury quality, conversion, and clarity</p>
        </div>
        <Button onClick={runAudit} disabled={generating} className="gradient-gold-button border-0">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running Audit...</> : <><Sparkles className="w-4 h-4 mr-2" />Run Full Audit</>}
        </Button>
      </div>

      {/* Safety banner */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Do-Not-Spend-Or-Lose Rule: ACTIVE</strong> — All fixes are suggestions only. Anything touching public pricing, payment flows, or legal content requires ApprovalQueue before implementation.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Issues', value: stats.total, color: 'text-foreground' },
          { label: 'Critical', value: stats.critical, color: 'text-red-400' },
          { label: 'High', value: stats.high, color: 'text-orange-400' },
          { label: 'Open', value: stats.open, color: 'text-yellow-400' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      {auditItems.length > 0 && (
        <div className="flex gap-3 flex-wrap items-center">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {['critical', 'high', 'medium', 'low'].map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {['open', 'in_progress', 'resolved', 'deferred'].map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-52 h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {AUDIT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} shown</span>
        </div>
      )}

      {/* Audit items list */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : auditItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <Star className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">No audit items yet.</p>
          <p className="text-sm text-muted-foreground mb-4">Click "Run Full Audit" to generate a structured premium UX review.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-xl mx-auto">
            {AUDIT_CATEGORIES.slice(0, 8).map(c => (
              <div key={c} className="border border-border rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">{c}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const pri = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.low;
            const sta = STATUS_CONFIG[item._status] || STATUS_CONFIG.open;
            return (
              <Card key={item._id || idx} className={`border ${pri.border} hover:shadow-md transition-all`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Priority indicator */}
                    <div className={`${pri.bg} p-2 rounded-lg border ${pri.border} shrink-0 mt-0.5`}>
                      {item.priority === 'critical' || item.priority === 'high'
                        ? <AlertTriangle className={`w-4 h-4 ${pri.color}`} />
                        : <Star className={`w-4 h-4 ${pri.color}`} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <p className="font-medium text-sm text-foreground">{item.issue}</p>
                        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                          <Badge className={`text-[10px] border ${pri.border} ${pri.bg} ${pri.color}`}>{item.priority}</Badge>
                          <Badge className={`text-[10px] ${sta.bg} ${sta.color}`}>{item._status?.replace('_', ' ')}</Badge>
                          {item.requires_approval && <Badge className="text-[10px] bg-yellow-500/10 text-yellow-400">Needs Approval</Badge>}
                        </div>
                      </div>

                      {/* Page + Category */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-primary font-medium">{item.page_or_area}</span>
                        {item.category && <Badge variant="outline" className="text-[10px]">{item.category}</Badge>}
                      </div>

                      {/* Why it matters */}
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-secondary/30 rounded-lg p-2 border border-border/30">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Why It Matters</p>
                          <p className="text-xs text-foreground/80">{item.why_it_matters}</p>
                        </div>
                        <div className="bg-primary/5 rounded-lg p-2 border border-primary/20">
                          <p className="text-[10px] text-primary uppercase tracking-wider mb-1">Premium Fix</p>
                          <p className="text-xs text-foreground/80">{item.premium_fix}</p>
                        </div>
                        <div className="bg-green-500/5 rounded-lg p-2 border border-green-500/20">
                          <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1">Estimated Impact</p>
                          <p className="text-xs text-foreground/80">{item.estimated_impact}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {item._status === 'open' && (
                          <>
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setStatus(item, 'in_progress')}>Mark In Progress</Button>
                            <Button size="sm" variant="ghost" className="text-xs h-7 text-green-400" onClick={() => setStatus(item, 'resolved')}><CheckCircle2 className="w-3 h-3 mr-1" />Resolve</Button>
                            <Button size="sm" variant="ghost" className="text-xs h-7 text-muted-foreground" onClick={() => setStatus(item, 'deferred')}>Defer</Button>
                          </>
                        )}
                        {item._status === 'in_progress' && (
                          <Button size="sm" variant="ghost" className="text-xs h-7 text-green-400" onClick={() => setStatus(item, 'resolved')}><CheckCircle2 className="w-3 h-3 mr-1" />Mark Resolved</Button>
                        )}
                        {(item._status === 'resolved' || item._status === 'deferred') && (
                          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setStatus(item, 'open')}><RefreshCw className="w-3 h-3 mr-1" />Reopen</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Design direction reference */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2"><Star className="w-4 h-4 text-primary" />Design Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
            {['Cinematic', 'Editorial', 'Luxury Dark', 'Apple Clarity', 'Smooth Motion'].map(d => (
              <div key={d} className="border border-primary/20 bg-primary/5 rounded-lg p-2 text-center">
                <p className="text-xs text-primary font-medium">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">All fixes should achieve Krea/Magnific-level polish. No clutter. Every element intentional.</p>
        </CardContent>
      </Card>
    </div>
  );
}