import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import {
  CheckCircle2, XCircle, Archive, ChevronRight, ArrowLeft, Copy, Maximize2,
  AlertTriangle, Clock, Send, Brain, RefreshCw, Clipboard, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const RISK_COLORS = {
  low: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  medium: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  high: 'bg-red-500/10 text-red-400 border-red-500/30',
  critical: 'bg-red-700/20 text-red-300 border-red-500/50',
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400' },
  approved: { label: 'Approved', color: 'bg-green-500/10 text-green-400' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400' },
  edited: { label: 'Edited', color: 'bg-blue-500/10 text-blue-400' },
  scheduled: { label: 'Scheduled', color: 'bg-purple-500/10 text-purple-400' },
  archived: { label: 'Archived', color: 'bg-muted text-muted-foreground' },
  escalated: { label: 'Escalated', color: 'bg-orange-500/10 text-orange-400' },
  in_review: { label: 'In Review', color: 'bg-cyan-500/10 text-cyan-400' },
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_review', label: 'Needs Review' },
  { key: 'approved', label: 'Ready to Publish' },
  { key: 'social', label: 'Social Posts' },
  { key: 'revenue', label: 'Revenue Opps' },
  { key: 'store', label: 'Store Offers' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'research', label: 'Research' },
  { key: 'system', label: 'System Fixes' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'archived', label: 'Archived' },
  { key: 'escalated', label: 'Escalated' },
];

function filterItems(items, tab) {
  switch (tab) {
    case 'all': return items;
    case 'pending': return items.filter(i => i.status === 'pending');
    case 'in_review': return items.filter(i => i.status === 'in_review');
    case 'approved': return items.filter(i => i.status === 'approved' || i.status === 'scheduled');
    case 'social': return items.filter(i =>
      i.tags?.includes('social') || i.action_title?.toLowerCase().includes('post') ||
      i.action_title?.toLowerCase().includes('social') || i.agent_name?.toLowerCase().includes('social'));
    case 'revenue': return items.filter(i =>
      i.tags?.includes('revenue') || i.action_title?.toLowerCase().includes('revenue') ||
      i.action_title?.toLowerCase().includes('bundle') || i.action_title?.toLowerCase().includes('offer') ||
      i.agent_name?.toLowerCase().includes('revenue') || i.agent_name?.toLowerCase().includes('merch'));
    case 'store': return items.filter(i =>
      i.tags?.includes('store') || i.action_title?.toLowerCase().includes('store') ||
      i.action_title?.toLowerCase().includes('merch') || i.action_title?.toLowerCase().includes('product'));
    case 'tiktok': return items.filter(i =>
      i.tags?.includes('tiktok') || i.action_title?.toLowerCase().includes('tiktok') ||
      i.agent_name?.toLowerCase().includes('tiktok') || i.agent_name?.toLowerCase().includes('content'));
    case 'research': return items.filter(i =>
      i.tags?.includes('research') || i.action_title?.toLowerCase().includes('research') ||
      i.action_title?.toLowerCase().includes('trend') || i.action_title?.toLowerCase().includes('insight') ||
      i.agent_name?.toLowerCase().includes('research') || i.agent_name?.toLowerCase().includes('trend'));
    case 'system': return items.filter(i =>
      i.tags?.includes('system') || i.risk_type?.includes('data_deletion') ||
      i.action_title?.toLowerCase().includes('fix') || i.action_title?.toLowerCase().includes('error'));
    case 'rejected': return items.filter(i => i.status === 'rejected');
    case 'scheduled': return items.filter(i => i.status === 'scheduled');
    case 'archived': return items.filter(i => i.status === 'archived');
    case 'escalated': return items.filter(i => i.status === 'escalated');
    default: return items;
  }
}

// Full-screen content viewer
function FullContentViewer({ item, onClose }) {
  const content = item.final_output || item.proposed_output || item.action_description || '';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.action_title?.replace(/\s+/g, '_') || 'approval'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-background z-[60] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <p className="font-semibold text-sm truncate max-w-xs md:max-w-lg">{item.action_title}</p>
          <Badge className={`text-xs ${STATUS_CONFIG[item.status]?.color || ''}`}>{item.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1 text-xs">
            {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload} className="gap-1 text-xs">
            <Download className="w-3 h-3" />Export
          </Button>
        </div>
      </div>

      {/* Full scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8">
        <div className="max-w-4xl mx-auto">
          {isMarkdown(content) ? (
            <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-body">{content}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

function isMarkdown(text) {
  if (!text) return false;
  return /^#{1,6}\s|^\*\*|\*\*$|\n#{1,6}\s|\n\*\*|\[.+\]\(/.test(text);
}

// Detail modal
function ApprovalDetailModal({ item, onClose, onDecide }) {
  const [editNote, setEditNote] = useState(item.decision_note || '');
  const [acting, setActing] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied] = useState(false);

  const content = item.final_output || item.proposed_output || '';
  const preview = content.slice(0, 1200);
  const isTruncated = content.length > 1200;

  const handleDecide = async (status) => {
    setActing(true);
    await onDecide({ id: item.id, status, note: editNote });
    setActing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  if (showFull) {
    return <FullContentViewer item={item} onClose={() => setShowFull(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-3 md:p-6 overflow-y-auto">
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-2xl my-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-3 rounded-t-2xl flex items-center gap-2 z-10">
          <button onClick={onClose} className="p-1.5 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{item.action_title}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button size="sm" variant="ghost" onClick={handleCopy} className="gap-1 text-xs h-7 px-2">
              {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowFull(true)} className="gap-1 text-xs h-7 px-2" title="Full screen">
              <Maximize2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto max-h-[75vh] p-5 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`text-xs ${RISK_COLORS[item.risk_level] || ''}`}>{item.risk_level} risk</Badge>
            <Badge className={`text-xs ${STATUS_CONFIG[item.status]?.color || ''}`}>{item.status}</Badge>
            {item.risk_type?.map(r => (
              <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
            ))}
            {item.tags?.map(t => (
              <Badge key={t} variant="outline" className="text-xs cursor-pointer hover:bg-primary/10">{t}</Badge>
            ))}
          </div>

          {/* Agent & meta */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-secondary/30 rounded-lg p-2">
              <p className="text-muted-foreground">Agent / Source</p>
              <p className="font-medium flex items-center gap-1 mt-0.5"><Brain className="w-3 h-3" />{item.agent_name || '—'}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-2">
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium mt-0.5">{item.created_date ? format(new Date(item.created_date), 'dd MMM yyyy, h:mm a') : '—'}</p>
            </div>
            {item.decided_by && (
              <div className="bg-secondary/30 rounded-lg p-2 col-span-2">
                <p className="text-muted-foreground">Decision by {item.decided_by}</p>
                <p className="font-medium mt-0.5">{item.decided_at ? format(new Date(item.decided_at), 'dd MMM yyyy, h:mm a') : ''}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {item.action_description && (
            <div className="bg-secondary/20 rounded-xl p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">What This Does</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{item.action_description}</p>
            </div>
          )}

          {/* Full proposed output — NO truncation */}
          {content && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-secondary/30 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.final_output ? 'Final Output' : 'Proposed Output / Agent Report'}
                </p>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={handleCopy} className="h-6 px-2 text-xs gap-1">
                    <Clipboard className="w-3 h-3" />Copy
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowFull(true)} className="h-6 px-2 text-xs gap-1">
                    <Maximize2 className="w-3 h-3" />Full Screen
                  </Button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-96 p-4">
                {isMarkdown(content) ? (
                  <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-body">{content}</pre>
                )}
              </div>
              {isTruncated && (
                <div className="px-4 py-2 bg-secondary/10 border-t border-border">
                  <button onClick={() => setShowFull(true)} className="text-xs text-primary hover:underline cursor-pointer">
                    View full output ({content.length.toLocaleString()} characters) → Full Screen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payload preview */}
          {item.payload && Object.keys(item.payload).length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-secondary/30 border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Payload Data</p>
              </div>
              <div className="overflow-y-auto max-h-48 p-4">
                <pre className="text-xs text-foreground/70 whitespace-pre-wrap font-mono">
                  {JSON.stringify(item.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Source chain */}
          <div className="bg-secondary/10 border border-border rounded-xl p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Source Chain</p>
            <p className="text-xs font-mono text-foreground/60 leading-relaxed">
              ApprovalQueue → {item.agent_name || 'Agent'} → AgentTaskLog → KnowledgeVault → Decision → {item.status === 'approved' ? 'Published Action' : 'Archived'}
            </p>
            {!item.agent_name && (
              <p className="text-xs text-muted-foreground italic mt-1.5">This is the deepest available source record. Created by: {item.created_by || 'system'}. No further upstream records linked.</p>
            )}
          </div>

          {/* If approved / rejected */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2">
              <p className="text-green-400 font-medium mb-0.5">If Approved</p>
              <p className="text-muted-foreground">{item.tags?.includes('social') ? 'Moves to scheduling or platform draft prep' : item.tags?.includes('revenue') ? 'Moves to proposal execution or store prep' : 'Approved for the next controlled step'}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
              <p className="text-red-400 font-medium mb-0.5">If Rejected</p>
              <p className="text-muted-foreground">Item archived. Agent notified. No action taken.</p>
            </div>
          </div>

          {/* Decision note input */}
          {(item.status === 'pending' || item.status === 'in_review') && (
            <Textarea
              placeholder="Add a decision note (optional)..."
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              rows={2}
              className="text-sm"
            />
          )}

          {/* Decision note display */}
          {item.decision_note && item.status !== 'pending' && (
            <div className="bg-secondary/20 rounded-lg p-3 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Decision Note</p>
              <p className="text-foreground/80">{item.decision_note}</p>
            </div>
          )}
        </div>

        {/* Sticky footer */}
        {(item.status === 'pending' || item.status === 'in_review') && (
          <div className="sticky bottom-0 bg-card border-t border-border px-5 py-3 rounded-b-2xl flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white gap-1"
              onClick={() => handleDecide('approved')}
              disabled={acting}
            >
              <CheckCircle2 className="w-3 h-3" />Approve Next Step
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1"
              onClick={() => handleDecide('rejected')}
              disabled={acting}
            >
              <XCircle className="w-3 h-3" />Reject
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => handleDecide('in_review')}
              disabled={acting}
            >
              <Send className="w-3 h-3" />Request Revision
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-muted-foreground"
              onClick={() => handleDecide('archived')}
              disabled={acting}
            >
              <Archive className="w-3 h-3" />Archive
            </Button>
            {item.escalate_to_professional && (
              <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-400 gap-1">
                <AlertTriangle className="w-3 h-3" />Escalate
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApprovalQueue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);

  const activeTab = searchParams.get('tab') || 'pending';
  const setTab = (key) => setSearchParams({ tab: key });

  const { data: allItems = [], refetch } = useQuery({
    queryKey: ['approval-queue-all'],
    queryFn: () => base44.entities.ApprovalQueue.list('-created_date', 200),
  });

  const decide = useMutation({
    mutationFn: async ({ id, status, note }) => {
      const item = allItems.find(i => i.id === id);

      if (status === 'approved' && item?.payload) {
        try {
          const payload = item.payload;
          const entityType = payload.entity || payload.entityType;
          const action = payload.action || payload.action_type;
          const recordId = payload.recordId || payload.id;

          if (entityType && base44.entities[entityType]) {
            const cleanData = payload.data ? { ...payload.data } : { ...payload };
            delete cleanData.entity;
            delete cleanData.entityType;
            delete cleanData.action;
            delete cleanData.action_type;
            delete cleanData.recordId;
            delete cleanData.id;

            if (action === 'create' || action === 'create_product' || action === 'create_record' || !action) {
              await base44.entities[entityType].create(cleanData);
            } else if (action === 'update' && recordId) {
              await base44.entities[entityType].update(recordId, cleanData);
            } else if (action === 'delete' && recordId) {
              await base44.entities[entityType].delete(recordId);
            }
          }
        } catch (err) {
          console.error('[Dispatcher] Payload execution failed:', err);
          throw new Error('Approved, but failed to execute database action: ' + err.message);
        }
      }

      // Propagate status update to linked ContentCalendarPost
      try {
        const posts = await base44.entities.ContentCalendarPost.filter({ approval_id: id });
        for (const post of posts) {
          const targetStatus = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending_approval';
          await base44.entities.ContentCalendarPost.update(post.id, { status: targetStatus });
        }
      } catch (err) {
        console.error('[Dispatcher] Failed to sync ContentCalendarPost status:', err);
      }

      // Propagate status update to linked PurchaseOrder
      try {
        const pos = await base44.entities.PurchaseOrder.filter({ approval_id: id });
        for (const po of pos) {
          const targetStatus = status === 'approved' ? 'approved' : status === 'rejected' ? 'cancelled' : 'pending_approval';
          await base44.entities.PurchaseOrder.update(po.id, { status: targetStatus });
        }
      } catch (err) {
        console.error('[Dispatcher] Failed to sync PurchaseOrder status:', err);
      }

      return base44.entities.ApprovalQueue.update(id, {
        status,
        decision_note: note,
        decided_by: 'Gannon Waye',
        decided_at: new Date().toISOString(),
      });
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['approval-queue-all'] });
      qc.invalidateQueries({ queryKey: ['sprint-posts'] });
      qc.invalidateQueries({ queryKey: ['sprint-approvals'] });
      toast.success(`Approval status updated to: ${vars.status}`);
      setSelected(null);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to process decision');
    }
  });

  const filteredItems = filterItems(allItems, activeTab);
  const pendingCount = allItems.filter(i => i.status === 'pending').length;

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-secondary/50 rounded-lg cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold gradient-gold-text flex items-center gap-3">
              Approval Queue
              {pendingCount > 0 && <Badge className="bg-yellow-500 text-black text-sm">{pendingCount} pending</Badge>}
            </h1>
            <p className="text-muted-foreground text-sm">Actions requiring your decision — nothing publishes without approval</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1 text-xs">
          <RefreshCw className="w-3 h-3" />Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-1.5 min-w-max pb-1">
          {TABS.map(tab => {
            const count = filterItems(allItems, tab.key).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer border
                  ${isActive
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary/40'
                  }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-secondary text-secondary-foreground'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm font-medium">
              No items in "{TABS.find(t => t.key === activeTab)?.label || activeTab}"
            </p>
            <p className="text-xs text-muted-foreground mt-1">Items will appear here when agents generate proposals requiring approval.</p>
          </div>
        ) : filteredItems.map(item => (
          <ApprovalRow
            key={item.id}
            item={item}
            onSelect={() => setSelected(item)}
          />
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <ApprovalDetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onDecide={(vars) => decide.mutateAsync(vars)}
        />
      )}
    </div>
  );
}

function ApprovalRow({ item, onSelect }) {
  const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const content = item.final_output || item.proposed_output || item.action_description || '';
  const preview = content.slice(0, 180).trim();

  return (
    <div
      onClick={onSelect}
      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer group transition-all
        hover:border-primary/40 hover:bg-secondary/20
        ${item.status === 'pending' ? 'border-yellow-500/30 bg-card' : 'border-border bg-card/70'}`}
    >
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <Badge className={`text-xs ${RISK_COLORS[item.risk_level] || ''}`}>{item.risk_level} risk</Badge>
          <Badge className={`text-xs ${statusConf.color}`}>{statusConf.label}</Badge>
          {item.risk_type?.slice(0, 2).map(r => (
            <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
          ))}
        </div>
        {/* Title */}
        <p className="text-sm font-semibold group-hover:text-primary transition-colors leading-tight">{item.action_title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{item.agent_name}</p>
        {/* Preview — never hides, just shows excerpt */}
        {preview && (
          <p className="text-xs text-muted-foreground/70 mt-1.5 leading-relaxed">
            {preview}{content.length > 180 ? <span className="text-primary/60"> … click to read full output</span> : ''}
          </p>
        )}
        {item.created_date && (
          <p className="text-xs text-muted-foreground mt-1.5">{format(new Date(item.created_date), 'dd MMM yyyy, h:mm a')}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.status === 'pending' && (
          <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
