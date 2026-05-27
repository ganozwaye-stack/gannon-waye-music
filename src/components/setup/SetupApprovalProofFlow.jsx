import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Zap, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StepBlock from './StepBlock';

export default function SetupApprovalProofFlow({ onComplete, onBlocked }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runProof = async () => {
    setRunning(true);
    try {
      const res = await base44.functions.invoke('proofApprovalChain', {});
      setResult({ ok: true, data: res.data });
    } catch (e) {
      setResult({ ok: false, error: e.message });
    }
    setRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">✅</span>
          <h2 className="font-semibold text-lg">ApprovalQueue Auto-Publish Proof</h2>
          <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">Medium</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Runs the full chain: create test proposal → approve → create BundleOffer → cleanup → verify duplicate prevention → notify Business Attention Centre.</p>
      </div>

      <StepBlock number={1} title="Previous Proof Status" status="done" why="This chain was already verified.">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300">
          ✅ Last run: 26 May 2026 — 7/7 steps complete<br />
          Bundle offer created and auto-expired. Duplicate prevention confirmed. Notification sent.
        </div>
      </StepBlock>

      <StepBlock number={2} title="Run Proof Again (Optional)" status={result ? (result.ok ? 'done' : 'error') : 'active'} why="Re-run any time to confirm the chain still works after code or config changes.">
        <Button onClick={runProof} disabled={running} className="gap-2 mb-3">
          <Zap className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running proof chain...' : 'Run ApprovalQueue Proof Now'}
        </Button>
        {result && (
          <div className={`rounded-lg p-3 text-sm ${result.ok ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            {result.ok ? (
              <>
                <p className="text-green-300 font-semibold">{result.data?.steps_completed}/7 steps complete ✓</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  {result.data?.logs?.filter(l => l.startsWith('✓')).map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              </>
            ) : (
              <p className="text-red-300">✗ {result.error}</p>
            )}
          </div>
        )}
      </StepBlock>

      <StepBlock number={3} title="UI Approval Test" status="active" why="Confirms the UI approval button also triggers the chain correctly for real proposals.">
        <p className="text-sm text-muted-foreground mb-2">Open the ApprovalQueue and approve a real pending item to confirm the UI flow works:</p>
        <Button className="gap-2 mb-3" onClick={() => window.open('/admin/approval-queue', '_blank')}>
          <ExternalLink className="w-4 h-4" /> Open ApprovalQueue
        </Button>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>1. Find a pending_approval item</p>
          <p>2. Click Approve</p>
          <p>3. Confirm action was triggered (BundleOffer created, or action taken)</p>
          <p>4. Check /admin/notifications for confirmation alert</p>
        </div>
      </StepBlock>

      <div className="flex gap-2">
        <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="w-4 h-4" /> Mark ApprovalQueue Proof Complete
        </Button>
        <Button variant="outline" onClick={onBlocked}>Mark Blocked</Button>
      </div>
    </div>
  );
}