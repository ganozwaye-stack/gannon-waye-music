import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  CheckCircle2, XCircle, Edit, Clock, Zap,
  DollarSign, ChevronRight, Loader2, RefreshCw, Eye,
  Package, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  pending_approval: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  published: 'bg-cyan-500/20 text-cyan-400',
  expired: 'bg-slate-500/20 text-slate-400',
  draft: 'bg-muted text-muted-foreground',
  editing: 'bg-orange-500/20 text-orange-400',
};

function ProposalDetailModal({ proposal, onClose, onAction }) {
  const [note, setNote] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [edits, setEdits] = useState(/** @type {Record<string, any>} */ ({}));
  const [acting, setActing] = useState(false);

  const handleAction = async (action) => {
    setActing(true);
    await onAction(proposal.id, action, note, editMode ? edits : {});
    setActing(false);
    onClose();
  };

  const isPending = proposal.status === 'pending_approval';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {proposal.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Status + scores */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`text-xs ${STATUS_COLORS[proposal.status]}`}>{proposal.status?.replace(/_/g, ' ')}</Badge>
            <Badge className="text-xs bg-orange-500/10 text-orange-400">Risk: {proposal.risk_level}</Badge>
            {proposal.confidence_score && <Badge className="text-xs bg-blue-500/10 text-blue-400">Confidence: {proposal.confidence_score}/10</Badge>}
            {proposal.profit_potential_score && <Badge className="text-xs bg-green-500/10 text-green-400">Profit: {proposal.profit_potential_score}/10</Badge>}
            {proposal.urgency_score && <Badge className="text-xs bg-purple-500/10 text-purple-400">Urgency: {proposal.urgency_score}/10</Badge>}
          </div>

          {/* Why */}
          <Section label="Why This Opportunity" content={proposal.reason} />

          {/* Pricing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PriceCard label="Original Price" value={`$${proposal.original_combined_price}`} />
            <PriceCard label="Bundle Price" value={`$${proposal.proposed_bundle_price}`} highlight />
            <PriceCard label="Discount" value={`${proposal.discount_percent}%`} />
            <PriceCard label="Est. Revenue" value={proposal.estimated_revenue_impact} />
          </div>

          {/* Products */}
          {proposal.products_involved?.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Products Involved</p>
              <div className="flex flex-wrap gap-2">
                {proposal.products_involved.map(p => (
                  <div key={p} className="flex items-center gap-1.5 bg-secondary/40 rounded-lg px-3 py-1.5">
                    <Package className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium">{p}</span>
                    {proposal.product_prices?.[p] && <span className="text-xs text-muted-foreground">${proposal.product_prices[p]}</span>}
                  </div>
                ))}
              </div>
              {proposal.stock_notes && <p className="text-xs text-muted-foreground mt-1">📦 {proposal.stock_notes}</p>}
            </div>
          )}

          {/* Campaign details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Duration</p>
              <p className="text-sm font-medium">{proposal.campaign_duration_hours}h campaign</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Expiry Rule</p>
              <p className="text-sm font-medium">{proposal.expiry_rule}</p>
            </div>
          </div>

          {/* Customer-facing content */}
          <div className="border border-primary/20 bg-primary/3 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Customer-Facing Content (Draft)</p>
            {editMode ? (
              <div className="space-y-2">
                <Input
                  value={edits.customer_facing_headline ?? proposal.customer_facing_headline ?? ''}
                  onChange={e => setEdits(p => ({ ...p, customer_facing_headline: e.target.value }))}
                  placeholder="Headline"
                  className="text-sm"
                />
                <Textarea
                  value={edits.customer_facing_copy ?? proposal.customer_facing_copy ?? ''}
                  onChange={e => setEdits(p => ({ ...p, customer_facing_copy: e.target.value }))}
                  rows={3}
                  className="text-sm"
                  placeholder="Offer copy"
                />
                <Input
                  type="number"
                  value={edits.discount_percent ?? proposal.discount_percent ?? ''}
                  onChange={e => setEdits(p => ({ ...p, discount_percent: parseFloat(e.target.value) }))}
                  placeholder="Discount %"
                  className="text-sm"
                />
                <Input
                  type="number"
                  value={edits.campaign_duration_hours ?? proposal.campaign_duration_hours ?? ''}
                  onChange={e => setEdits(p => ({ ...p, campaign_duration_hours: parseFloat(e.target.value) }))}
                  placeholder="Duration (hours)"
                  className="text-sm"
                />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">"{proposal.customer_facing_headline}"</p>
                <p className="text-sm text-foreground/80">{proposal.customer_facing_copy}</p>
              </>
            )}
          </div>

          {proposal.website_banner_draft && <Section label="Website Banner Draft" content={proposal.website_banner_draft} mono />}
          {proposal.email_draft && <Section label="Email Draft" content={proposal.email_draft} />}
          {proposal.social_post_draft && <Section label="Social Post Draft" content={proposal.social_post_draft} />}

          {/* Source chain */}
          {proposal.source_chain && (
            <div className="bg-secondary/20 rounded-lg p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source Chain</p>
              <p className="text-xs text-foreground/70 font-mono">{proposal.source_chain}</p>
            </div>
          )}

          {/* If approved / rejected */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {proposal.if_approved_action && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-400 mb-1">✅ If Approved</p>
                <p className="text-xs text-foreground/70">{proposal.if_approved_action}</p>
              </div>
            )}
            {proposal.if_rejected_action && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-400 mb-1">❌ If Rejected</p>
                <p className="text-xs text-foreground/70">{proposal.if_rejected_action}</p>
              </div>
            )}
          </div>

          {/* Decision note */}
          {isPending && (
            <Textarea
              placeholder="Add a note before approving or rejecting (optional)..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="text-sm"
            />
          )}

          {/* Action buttons */}
          {isPending && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-1"
                onClick={() => handleAction('approve')}
                disabled={acting}
              >
                {acting ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve & Publish
              </Button>
              <Button variant="destructive" className="gap-1" onClick={() => handleAction('reject')} disabled={acting}>
                <XCircle className="w-4 h-4" /> Reject
              </Button>
              <Button variant="outline" className="gap-1" onClick={() => setEditMode(!editMode)}>
                <Edit className="w-3 h-3" /> {editMode ? 'Cancel Edit' : 'Edit Offer'}
              </Button>
            </div>
          )}

          {proposal.decision_note && (
            <p className="text-xs text-muted-foreground border-t border-border pt-2">
              Decision Note: {proposal.decision_note}
              {proposal.decided_by && ` — ${proposal.decided_by}`}
              {proposal.decided_at && ` at ${format(new Date(proposal.decided_at), 'dd MMM yyyy, h:mm a')}`}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Created by {proposal.agent_name} · {proposal.created_date ? format(new Date(proposal.created_date), 'dd MMM yyyy, h:mm a') : ''}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, content, mono = false }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm text-foreground/80 bg-secondary/30 rounded-lg p-3 ${mono ? 'font-mono text-xs' : ''}`}>{content}</p>
    </div>
  );
}

function PriceCard({ label, value, highlight = false }) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/30'}`}>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-base font-bold ${highlight ? 'text-primary' : ''}`}>{value}</p>
    </div>
  );
}

export default function RevenueActions() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(/** @type {any} */ (null));
  const [scanning, setScanning] = useState(false);
  const [tab, setTab] = useState('pending');

  const { data: proposals = [], isLoading, refetch } = useQuery({
    queryKey: ['agent-proposals'],
    queryFn: () => base44.entities.AgentActionProposal.list('-created_date', 100),
    refetchInterval: 30000,
  });

  const { data: bundles = [] } = useQuery({
    queryKey: ['bundle-offers'],
    queryFn: () => base44.entities.BundleOffer.list('-created_date', 50),
  });

  const handleAction = async (id, action, note, edits) => {
    try {
      await base44.functions.invoke('publishApprovedProposal', {
        proposal_id: id,
        action,
        decision_note: note,
        edits,
      });
      toast.success(action === 'approve' ? '✅ Offer published to Store!' : '❌ Proposal rejected');
      qc.invalidateQueries({ queryKey: ['agent-proposals'] });
      qc.invalidateQueries({ queryKey: ['bundle-offers'] });
      qc.invalidateQueries({ queryKey: ['admin-notifications'] });
      refetch();
    } catch (err) {
      toast.error('Action failed: ' + err.message);
    }
  };

  const triggerScan = async () => {
    setScanning(true);
    try {
      const res = await base44.functions.invoke('agentProposalScanner', {});
      toast.success(res.data?.message || 'Scan complete');
      refetch();
      qc.invalidateQueries({ queryKey: ['admin-notifications'] });
    } catch {
      toast.error('Scan failed');
    }
    setScanning(false);
  };

  const pending = proposals.filter(p => p.status === 'pending_approval');
  const published = proposals.filter(p => p.status === 'published');
  const rejected = proposals.filter(p => p.status === 'rejected');
  const activeBundles = bundles.filter(b => b.status === 'active');

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-secondary/40 rounded transition-colors">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Revenue Actions</h1>
            {pending.length > 0 && <Badge className="bg-yellow-500/20 text-yellow-400 text-sm animate-pulse">{pending.length} awaiting approval</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">Agent-prepared proposals — approve to publish, reject to block</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={triggerScan} disabled={scanning} className="gap-2 text-xs">
            {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Scan for Opportunities
          </Button>
          <Link to="/admin/approval-queue">
            <Button variant="outline" className="gap-2 text-xs"><Eye className="w-3 h-3" />Approval Queue</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Awaiting Approval" value={pending.length} color="text-yellow-400" bg="bg-yellow-500/10" urgent={pending.length > 0} />
        <StatCard label="Live Bundles" value={activeBundles.length} color="text-green-400" bg="bg-green-500/10" />
        <StatCard label="Published" value={published.length} color="text-cyan-400" bg="bg-cyan-500/10" />
        <StatCard label="Rejected" value={rejected.length} color="text-red-400" bg="bg-red-500/10" />
      </div>

      {/* Pending — most prominent */}
      {pending.length > 0 && (
        <Card className="border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-400">
              <Clock className="w-4 h-4" />Waiting for Your Approval ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pending.map(p => (
              <ProposalCard key={p.id} proposal={p} onClick={() => setSelected(p)} urgent />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs for all */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({proposals.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({published.length})</TabsTrigger>
          <TabsTrigger value="bundles">Active Bundles ({activeBundles.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-2">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : proposals.map(p => (
            <ProposalCard key={p.id} proposal={p} onClick={() => setSelected(p)} />
          ))}
          {proposals.length === 0 && <EmptyState label="No proposals yet. Click 'Scan for Opportunities' to let agents analyse your store." />}
        </TabsContent>

        <TabsContent value="published" className="mt-4 space-y-2">
          {published.map(p => <ProposalCard key={p.id} proposal={p} onClick={() => setSelected(p)} />)}
          {published.length === 0 && <EmptyState label="No published proposals yet." />}
        </TabsContent>

        <TabsContent value="bundles" className="mt-4 space-y-2">
          {activeBundles.map(b => <BundleCard key={b.id} bundle={b} />)}
          {activeBundles.length === 0 && <EmptyState label="No active bundles. Approve a proposal to create one." />}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-2">
          {rejected.map(p => <ProposalCard key={p.id} proposal={p} onClick={() => setSelected(p)} />)}
          {rejected.length === 0 && <EmptyState label="No rejected proposals." />}
        </TabsContent>
      </Tabs>

      {selected && (
        <ProposalDetailModal
          proposal={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}

function ProposalCard({ proposal: p, onClick, urgent = false }) {
  return (
    <button onClick={onClick} className={`w-full text-left border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/20 transition-all group ${urgent ? 'border-yellow-500/30 bg-yellow-500/3' : 'border-border'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <Badge className={`text-xs ${STATUS_COLORS[p.status]}`}>{p.status?.replace(/_/g, ' ')}</Badge>
            <Badge className="text-xs bg-secondary text-secondary-foreground">{p.proposal_type?.replace(/_/g, ' ')}</Badge>
            {p.risk_level && <Badge className="text-xs bg-orange-500/10 text-orange-400">{p.risk_level} risk</Badge>}
          </div>
          <p className="font-semibold text-sm">{p.title}</p>
          {p.estimated_revenue_impact && <p className="text-xs text-green-400 mt-0.5">💰 {p.estimated_revenue_impact}</p>}
          {p.products_involved?.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">{p.products_involved.join(' + ')}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {p.discount_percent && <span className="text-sm font-bold text-primary">{p.discount_percent}% off</span>}
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        {p.agent_name} · {p.created_date ? format(new Date(p.created_date), 'dd MMM, h:mm a') : ''}
      </p>
    </button>
  );
}

function BundleCard({ bundle: b }) {
  const isExpiringSoon = b.end_date && new Date(b.end_date) < new Date(Date.now() + 12 * 60 * 60 * 1000);
  return (
    <Card className={`border ${isExpiringSoon ? 'border-orange-500/30' : 'border-green-500/20'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <Badge className="text-xs bg-green-500/20 text-green-400">LIVE</Badge>
              {isExpiringSoon && <Badge className="text-xs bg-orange-500/20 text-orange-400 animate-pulse">Expiring Soon</Badge>}
            </div>
            <p className="font-semibold text-sm">{b.bundle_name}</p>
            <p className="text-xs text-muted-foreground">{b.products_included?.join(' + ')}</p>
            <p className="text-xs text-green-400 mt-0.5">
              ${b.bundle_price} ({b.discount_percent}% off · was ${b.original_combined_price})
            </p>
            {b.end_date && <p className="text-xs text-muted-foreground mt-0.5">Ends: {format(new Date(b.end_date), 'dd MMM, h:mm a')}</p>}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-400">{b.orders_generated || 0}</p>
            <p className="text-xs text-muted-foreground">orders</p>
            {b.revenue_generated > 0 && <p className="text-xs text-primary">${b.revenue_generated}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, color, bg, urgent = false }) {
  return (
    <Card className={urgent && value > 0 ? 'border-yellow-500/30' : ''}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} p-2 rounded-lg shrink-0`}><DollarSign className={`w-4 h-4 ${color}`} /></div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ label }) {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-xl">
      <Zap className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
