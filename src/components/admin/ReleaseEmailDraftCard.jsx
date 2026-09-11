import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Pencil, Send, XCircle, Users, Loader2 } from 'lucide-react';

const STATUS_TONE = {
  draft: 'border-primary/40 text-primary',
  approved: 'border-emerald-500/40 text-emerald-400',
  sent: 'border-border/40 text-muted-foreground',
  rejected: 'border-destructive/40 text-destructive',
};

export default function ReleaseEmailDraftCard({ draft }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [subject, setSubject] = useState(draft.subject);
  const [bodyText, setBodyText] = useState(draft.body_text);
  const [busy, setBusy] = useState('');
  const refresh = () => qc.invalidateQueries({ queryKey: ['releaseEmailDrafts'] });

  const handleSaveEdit = async () => {
    setBusy('edit');
    try {
      await base44.entities.ReleaseEmailDraft.update(draft.id, { subject, body_text: bodyText });
      toast({ title: 'Draft updated' });
      setEditOpen(false);
      refresh();
    } catch (error) {
      toast({ title: 'Could not save the draft', description: error.message, variant: 'destructive' });
    } finally {
      setBusy('');
    }
  };

  const handleApproveAndSend = async () => {
    setBusy('send');
    try {
      await base44.entities.ReleaseEmailDraft.update(draft.id, { approval_status: 'approved' });
      const res = await base44.functions.invoke('sendReleaseEmailDraft', { draft_id: draft.id });
      const result = res?.data || res || {};
      if (result.skipped) {
        toast({ title: 'No send needed', description: result.reason });
      } else {
        toast({ title: `Sent to ${result.sent_count} fans` });
      }
      refresh();
    } catch (error) {
      toast({ title: 'Send failed', description: error?.response?.data?.error || error.message, variant: 'destructive' });
      refresh();
    } finally {
      setBusy('');
    }
  };

  const handleReject = async () => {
    setBusy('reject');
    try {
      await base44.entities.ReleaseEmailDraft.update(draft.id, { approval_status: 'rejected' });
      toast({ title: 'Draft rejected' });
      refresh();
    } catch (error) {
      toast({ title: 'Could not reject the draft', description: error.message, variant: 'destructive' });
    } finally {
      setBusy('');
    }
  };

  const isSent = draft.approval_status === 'sent';
  const isRejected = draft.approval_status === 'rejected';
  const statusLabel = String(draft.status || '').replace(/_/g, ' ');

  return (
    <div className="rounded-2xl border border-border/50 p-5"
      style={{ background: 'linear-gradient(135deg, rgba(8,8,14,0.55), rgba(8,8,14,0.3))' }}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-body text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded-full border border-primary/30 text-primary">
              {statusLabel}
            </span>
            <span className={`font-body text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded-full border ${STATUS_TONE[draft.approval_status] || STATUS_TONE.draft}`}>
              {draft.approval_status}
            </span>
            {isSent && draft.sent_at && (
              <span className="font-body text-[9px] text-muted-foreground">
                {new Date(draft.sent_at).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            )}
          </div>
          <h3 className="font-body text-lg gradient-gold-text truncate">{draft.release_title || 'Release'}</h3>
          <p className="font-body text-sm text-foreground/80 mt-1">{draft.subject}</p>
          <p className="font-body text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            {isSent
              ? `${draft.sent_count || 0} of ${draft.recipient_count || 0} fans emailed`
              : `${draft.recipient_count || 0} fans will receive this`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}
            className="rounded-full font-body text-[10px] tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
            <Eye className="w-3.5 h-3.5 mr-1" /> Preview
          </Button>
          {!isSent && (
            <Button type="button" variant="outline" size="sm" onClick={() => { setSubject(draft.subject); setBodyText(draft.body_text); setEditOpen(true); }}
              className="rounded-full font-body text-[10px] tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          )}
          {!isSent && !isRejected && (
            <Button type="button" size="sm" disabled={!!busy} onClick={handleApproveAndSend}
              className="rounded-full font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0">
              {busy === 'send' ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />}
              Approve & Send
            </Button>
          )}
          {!isSent && !isRejected && draft.approval_status !== 'draft' && (
            <Button type="button" variant="outline" size="sm" disabled={!!busy} onClick={handleReject}
              className="rounded-full font-body text-[10px] tracking-wider uppercase border-destructive/30 text-destructive hover:bg-destructive/10">
              {busy === 'reject' ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
              Reject
            </Button>
          )}
        </div>
      </div>

      {/* Preview: exactly what fans will see */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-border/60 p-0">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="font-body text-base gradient-gold-text">{draft.subject}</DialogTitle>
          </DialogHeader>
          <iframe
            title="Email preview"
            srcDoc={draft.body_html}
            sandbox=""
            className="w-full flex-1 min-h-[420px] bg-[#0a0a0e]"
          />
        </DialogContent>
      </Dialog>

      {/* Edit: subject and plain-text body. The premium HTML carries the artwork. */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl bg-card border-border/60">
          <DialogHeader>
            <DialogTitle className="font-body text-base gradient-gold-text">Edit the email</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
            <div>
              <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1 block">Subject</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="bg-background font-body text-sm" />
            </div>
            <div>
              <label className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1 block">Plain-text body</label>
              <Textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={10} className="bg-background font-body text-sm" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(false)}
                className="rounded-full font-body text-[10px] tracking-wider uppercase">
                Cancel
              </Button>
              <Button type="submit" disabled={busy === 'edit'}
                className="rounded-full font-body text-[10px] tracking-wider uppercase gradient-gold-button border-0">
                {busy === 'edit' ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : null} Save changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}