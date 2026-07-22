import React, { useState } from 'react';
import { AlertTriangle, Copy, CheckCircle2, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { base44 } from '@/api/base44Client';

const TERMINATION_LETTER = `Subject: Termination of Involvement with GanozMix Direct

Victor,

This letter confirms that, effective immediately, any involvement, access, collaboration, representation, or association you may have had with GanozMix Direct is terminated.

You are not authorised to access, represent, act on behalf of, make decisions for, use accounts connected to, communicate as, or otherwise hold yourself out as being involved with GanozMix Direct.

Any access credentials, materials, files, business information, or account permissions connected to GanozMix Direct must no longer be used. If you are in possession of any business materials or access, you are required to return, delete, or confirm removal of them as appropriate.

This notice is provided for clarity and record-keeping. No further involvement with GanozMix Direct is authorised unless confirmed in writing by Gannon Waye.

Regards,
Gannon Waye
GanozMix Direct / Gannon Waye Music`;

export default function LegalDrafts() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [logged, setLogged] = useState(false);

  const copyLetter = () => {
    navigator.clipboard.writeText(TERMINATION_LETTER);
    setCopied(true);
    toast({ title: 'Letter copied to clipboard', description: 'Review carefully before sending.' });
    setTimeout(() => setCopied(false), 3000);
  };

  const logAudit = async () => {
    await base44.entities.AuditLog?.create?.({
      action: 'legal_draft_accessed',
      subject: 'Victor de Mauro termination letter draft',
      performed_by: 'admin',
      notes: 'Termination letter draft accessed for review. Status: draft_pending_gannon_approval. NOT SENT.',
    }).catch(() => {});
    setLogged(true);
    toast({ title: 'Audit log entry created', description: 'Access recorded.' });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-3xl text-foreground">Legal Drafts</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Draft legal communications. <strong className="text-yellow-400">Do not send without Gannon's explicit approval.</strong>
        </p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-4">
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-red-300 leading-relaxed">
          All documents in this section are DRAFTS ONLY. No letter, notice, or communication has been sent. Nothing here is legally binding until reviewed by Gannon and sent through appropriate channels. Seek legal advice if required before sending.
        </p>
      </div>

      {/* Letter card */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-display text-sm text-foreground">Termination of Involvement — Victor de Mauro</p>
              <p className="font-body text-xs text-muted-foreground">GanozMix Direct</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 text-[10px]">
              DRAFT — NOT SENT
            </Badge>
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        <div className="p-6">
          <pre className="font-body text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed bg-secondary/20 rounded-xl p-5 border border-border/30">
            {TERMINATION_LETTER}
          </pre>

          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={copyLetter} className="rounded-full text-xs gap-1.5">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Letter'}
            </Button>
            <Button variant="ghost" size="sm" onClick={logAudit} disabled={logged} className="rounded-full text-xs gap-1.5 text-muted-foreground">
              {logged ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <FileText className="w-3.5 h-3.5" />}
              {logged ? 'Audit Logged' : 'Log Access'}
            </Button>
          </div>

          <div className="mt-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <p className="font-body text-xs text-yellow-300 font-medium mb-1">Actions required before sending:</p>
            <ul className="space-y-1">
              {[
                'Review letter with Gannon for accuracy',
                'Confirm correct email address for Victor',
                'Consider having a lawyer review if any financial/IP matters are involved',
                'Only send after Gannon explicitly approves — mark status as "approved_to_send" first',
                'Send via email with read receipt if possible',
                'Store sent copy in this admin section',
              ].map((item, i) => (
                <li key={i} className="font-body text-xs text-yellow-300/80 flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Victor removal checklist */}
      <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-base text-foreground">Victor de Mauro — GanozMix Direct Removal Checklist</h2>
        <p className="font-body text-xs text-muted-foreground">
          Audit trail for removal actions. Tick off as completed.
        </p>
        <div className="space-y-2">
          {[
            { text: 'Searched GanozMix Direct for Victor de Mauro references', done: true },
            { text: 'No active admin/user records found in database for Victor de Mauro', done: true },
            { text: 'No public page references to Victor de Mauro found', done: true },
            { text: 'Termination letter drafted — status: DRAFT, NOT SENT', done: true },
            { text: 'Audit log entry created in system', done: false },
            { text: 'Manually revoke external platform access (Gannon to action)', done: false },
            { text: 'Termination letter sent (Gannon approval required)', done: false },
            { text: 'Confirmation of receipt obtained', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {item.done
                ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                : <div className="w-4 h-4 rounded-full border border-border/40 shrink-0 mt-0.5" />}
              <p className={`font-body text-xs ${item.done ? 'text-muted-foreground' : 'text-foreground'}`}>{item.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-secondary/20 rounded-xl p-3 mt-2">
          <p className="font-body text-[10px] text-muted-foreground">
            <strong className="text-foreground">Audit Note:</strong> Victor de Mauro was searched across all GanozMix Direct entities. No financial, order, or audit records were found linked to this individual. No hard deletion required. Draft letter stored for Gannon's approval before any communication is sent.
          </p>
        </div>
      </div>

      <p className="text-center font-body text-xs text-muted-foreground/40 pb-8">
        Legal Drafts · Admin Only · {new Date().toLocaleDateString('en-AU')}
      </p>
    </div>
  );
}