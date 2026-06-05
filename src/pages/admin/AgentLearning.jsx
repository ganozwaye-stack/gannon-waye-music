import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Brain, Loader2, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

const LESSON_TYPES = ['successful_idea', 'failed_idea', 'approved_output', 'rejected_output', 'workflow_improvement', 'better_prompt', 'customer_experience', 'risk_detection', 'other'];

const TYPE_COLORS = {
  successful_idea: 'bg-green-500/10 text-green-400',
  failed_idea: 'bg-red-500/10 text-red-400',
  approved_output: 'bg-blue-500/10 text-blue-400',
  rejected_output: 'bg-orange-500/10 text-orange-400',
  workflow_improvement: 'bg-purple-500/10 text-purple-400',
  better_prompt: 'bg-cyan-500/10 text-cyan-400',
  customer_experience: 'bg-pink-500/10 text-pink-400',
  risk_detection: 'bg-yellow-500/10 text-yellow-400',
  other: 'bg-slate-500/10 text-slate-400',
};

export default function AgentLearning() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [generatedInsights, setGeneratedInsights] = useState('');
  const [form, setForm] = useState({ agent_name: '', lesson_type: 'successful_idea', what_worked: '', what_failed: '', improvement: '', source: '', confidence_score: 7, impact_score: 7 });

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['agent-learning'],
    queryFn: () => base44.entities.AgentLearningRecord.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AgentLearningRecord.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['agent-learning'] }); setShowForm(false); toast({ title: 'Learning record saved' }); },
  });

  const generateReview = async () => {
    setGenerating(true);
    try {
      const recentLogs = await base44.entities.AgentTaskLog.list('-created_date', 20);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the Gannon Core Agent Learning System. Review the following recent agent task logs and generate improvement recommendations.

Recent agent actions:
${recentLogs.map(l => `- ${l.agent_name}: ${l.task_title} | outcome: ${l.outcome || 'no outcome logged'} | auto: ${l.was_automatic}`).join('\n')}

Generate:
1. Top 3 things that are working well (what_worked)
2. Top 3 areas that need improvement (what_failed)
3. Top 5 specific improvements to implement (workflow, prompts, approval rules, automation opportunities)
4. Priority next steps

Format clearly. Focus on actionable, specific improvements. Avoid vague suggestions.`,
      });
      setGeneratedInsights(result);
    } catch (err) {
      toast({ title: 'Generation failed', variant: 'destructive' });
    }
    setGenerating(false);
  };

  const stats = {
    total: records.length,
    worked: records.filter(r => r.lesson_type === 'successful_idea' || r.lesson_type === 'approved_output').length,
    failed: records.filter(r => r.lesson_type === 'failed_idea' || r.lesson_type === 'rejected_output').length,
    improvements: records.filter(r => r.lesson_type === 'workflow_improvement' || r.lesson_type === 'better_prompt').length,
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Agent Learning Engine</h1>
          <p className="text-muted-foreground text-sm mt-1 font-body">Continuous improvement loop — agents learn from every output</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReview} disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Zap className="w-4 h-4 mr-1" />}
            Auto-Review
          </Button>
          <Button onClick={() => setShowForm(true)} className="gradient-gold-button border-0"><Plus className="w-4 h-4 mr-1" />Log Lesson</Button>
        </div>
      </div>

      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 flex items-center gap-3">
        <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
        <p className="text-yellow-300 text-xs"><strong>Learning Rule:</strong> All improvement suggestions go to ApprovalQueue if they affect money, legal, public content, pricing, or payment settings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Records', value: stats.total, color: 'text-foreground' },
          { label: 'What Worked', value: stats.worked, color: 'text-green-400' },
          { label: 'What Failed', value: stats.failed, color: 'text-red-400' },
          { label: 'Improvements', value: stats.improvements, color: 'text-purple-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {generatedInsights && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Brain className="w-4 h-4 text-primary" />AI-Generated Learning Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{generatedInsights}</ReactMarkdown>
            </div>
            <Button size="sm" className="mt-3" onClick={() => {
              createMutation.mutate({ agent_name: 'Auto-Review System', lesson_type: 'workflow_improvement', improvement: generatedInsights, source: 'Agent Task Log Analysis', confidence_score: 8, impact_score: 8 });
              setGeneratedInsights('');
            }}>Save to Learning Records</Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />Loading...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">No learning records yet.</p>
          <p className="text-sm text-muted-foreground">Use "Auto-Review" to generate the first batch, or log lessons manually.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(r => (
            <Card key={r.id} className="cursor-pointer hover:border-primary/40 transition-all group" onClick={() => setSelectedRecord(r)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{r.agent_name}</p>
                      <Badge className={`text-xs ${TYPE_COLORS[r.lesson_type] || ''}`}>{r.lesson_type?.replace(/_/g, ' ')}</Badge>
                    </div>
                    {r.what_worked && <p className="text-xs text-green-400 mt-1">✓ {r.what_worked.slice(0, 100)}{r.what_worked.length > 100 ? '...' : ''}</p>}
                    {r.what_failed && <p className="text-xs text-red-400 mt-0.5">✗ {r.what_failed.slice(0, 100)}{r.what_failed.length > 100 ? '...' : ''}</p>}
                    {r.improvement && <p className="text-xs text-muted-foreground mt-0.5">→ {r.improvement.slice(0, 100)}{r.improvement.length > 100 ? '...' : ''}</p>}
                  </div>
                  <div className="text-right shrink-0 text-xs text-muted-foreground">
                    {r.confidence_score && <p>Conf: {r.confidence_score}/10</p>}
                    {r.impact_score && <p>Impact: {r.impact_score}/10</p>}
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">Click to view →</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedRecord && (
        <Dialog open onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{selectedRecord.agent_name} — Learning Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge className={`text-xs ${TYPE_COLORS[selectedRecord.lesson_type] || ''}`}>{selectedRecord.lesson_type?.replace(/_/g, ' ')}</Badge>
                {selectedRecord.confidence_score && <Badge className="text-xs bg-green-500/10 text-green-400">Confidence: {selectedRecord.confidence_score}/10</Badge>}
                {selectedRecord.impact_score && <Badge className="text-xs bg-blue-500/10 text-blue-400">Impact: {selectedRecord.impact_score}/10</Badge>}
              </div>
              {selectedRecord.what_worked && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-1">✓ What Worked</p>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-green-500/5 border border-green-500/20 rounded-lg p-3">{selectedRecord.what_worked}</p>
                </div>
              )}
              {selectedRecord.what_failed && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-1">✗ What Failed</p>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-red-500/5 border border-red-500/20 rounded-lg p-3">{selectedRecord.what_failed}</p>
                </div>
              )}
              {selectedRecord.improvement && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">→ Improvement</p>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-primary/5 border border-primary/20 rounded-lg p-3">{selectedRecord.improvement}</p>
                </div>
              )}
              {selectedRecord.source && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                  <p className="text-sm text-foreground/70">{selectedRecord.source}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground border-t border-border pt-3">
                Recorded: {new Date(selectedRecord.created_date).toLocaleString('en-AU')}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Learning Record</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Agent Name *</Label><Input value={form.agent_name} onChange={e => setForm(f => ({ ...f, agent_name: e.target.value }))} placeholder="e.g. Ideas Agent" /></div>
            <div>
              <Label className="text-xs">Lesson Type</Label>
              <Select value={form.lesson_type} onValueChange={v => setForm(f => ({ ...f, lesson_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{LESSON_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">What Worked</Label><Input value={form.what_worked} onChange={e => setForm(f => ({ ...f, what_worked: e.target.value }))} /></div>
            <div><Label className="text-xs">What Failed</Label><Input value={form.what_failed} onChange={e => setForm(f => ({ ...f, what_failed: e.target.value }))} /></div>
            <div><Label className="text-xs">Improvement / Next Action</Label><Input value={form.improvement} onChange={e => setForm(f => ({ ...f, improvement: e.target.value }))} /></div>
            <div><Label className="text-xs">Source</Label><Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="e.g. task log, approval review" /></div>
            <Button className="w-full gradient-gold-button border-0" onClick={() => createMutation.mutate(form)} disabled={!form.agent_name || createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Save Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}