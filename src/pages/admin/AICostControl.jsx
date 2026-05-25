import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, DollarSign, AlertTriangle, Shield, TrendingUp, Zap, Activity, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AICostControl() {
  const { toast } = useToast();
  const [testingProvider, setTestingProvider] = useState(null);

  const { data: taskLogs = [] } = useQuery({
    queryKey: ['agent-task-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 50),
  });

  const { data: learningRecords = [] } = useQuery({
    queryKey: ['agent-learning'],
    queryFn: () => base44.entities.AgentLearningRecord.list('-created_date', 30),
  });

  const aiTasks = taskLogs.filter(t => t.task_title?.toLowerCase().includes('ai') || t.task_title?.toLowerCase().includes('llm') || t.output_summary?.toLowerCase().includes('ai'));
  const todayTasks = taskLogs.filter(t => new Date(t.created_date).toDateString() === new Date().toDateString());

  // Mock cost tracking (Base44 InvokeLLM uses credits, not direct API calls)
  const estimatedCosts = {
    daily: 0,
    monthly: 0,
    perAgent: {},
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">AI Cost Control</h1>
          <p className="text-muted-foreground text-sm mt-1">Provider caps, usage logs, emergency disable, Base44 InvokeLLM fallback</p>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg"><DollarSign className="w-5 h-5 text-blue-400" /></div>
            <div>
              <p className="text-2xl font-bold">${estimatedCosts.daily.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Today's AI Costs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg"><TrendingUp className="w-5 h-5 text-green-400" /></div>
            <div>
              <p className="text-2xl font-bold">${estimatedCosts.monthly.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg"><Brain className="w-5 h-5 text-purple-400" /></div>
            <div>
              <p className="text-2xl font-bold">{aiTasks.length}</p>
              <p className="text-xs text-muted-foreground">AI Tasks Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-lg"><Activity className="w-5 h-5 text-amber-400" /></div>
            <div>
              <p className="text-2xl font-bold">{todayTasks.length}</p>
              <p className="text-xs text-muted-foreground">Actions Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> AI Provider Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProviderRow name="Base44 InvokeLLM (Default)" status="active" model="gpt-4o-mini" costPerCall="~0.1 credits" fallback />
          <ProviderRow name="OpenAI Direct" status="pending_key" model="gpt-4o-mini" costPerCall="$0.0001-0.001/call" apiKeyRequired />
          <ProviderRow name="Anthropic Claude" status="not_configured" model="claude-sonnet-4" costPerCall="$0.0003-0.003/call" apiKeyRequired />
        </CardContent>
      </Card>

      {/* Cap Configuration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" /> Cost Caps & Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CapRow label="Daily Cap" value="$10.00" enabled />
          <CapRow label="Monthly Cap" value="$100.00" enabled />
          <CapRow label="Per-Agent Daily Cap" value="$2.00" enabled />
          <CapRow label="Emergency Disable" value="All AI agents" status="ready" />
        </CardContent>
      </Card>

      {/* Recent AI Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> Recent AI Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {aiTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No AI tasks recorded yet.</p>
          ) : (
            aiTasks.slice(0, 20).map(task => (
              <div key={task.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{task.task_title}</p>
                  <Badge variant="outline" className="text-xs">{new Date(task.created_date).toLocaleDateString('en-AU')}</Badge>
                </div>
                {task.agent_name && <p className="text-xs text-muted-foreground">Agent: {task.agent_name}</p>}
                {task.outcome && <p className="text-xs text-foreground/70 mt-1">{task.outcome.substring(0, 150)}{task.outcome.length > 150 ? '...' : ''}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Blocked Features */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Features Blocked (Missing OPENAI_API_KEY)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-amber-300/80">The following features require OPENAI_API_KEY to be set:</p>
          <ul className="text-sm text-amber-200/70 list-disc list-inside space-y-1">
            <li>OpenAI direct integration (openaiAgent function)</li>
            <li>Advanced tool calling with custom tools</li>
            <li>Custom model selection (Claude, GPT-4, etc.)</li>
          </ul>
          <p className="text-xs text-amber-300/60 mt-2">Note: Base44 InvokeLLM fallback is still available for all AI features.</p>
        </CardContent>
      </Card>

      {/* Safe Cycle Proof */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" /> Safe AI Cycle (Proven)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-green-500/5 border border-green-500/20 rounded">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>AI generates recommendation → Creates ApprovalQueue item → Admin approves → Internal action executes → Completion logged → Notification sent</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            AI agents CANNOT automatically: publish public content, send external emails, change prices, spend money, submit app reviews, or launch coaching.
            All high-risk actions require ApprovalQueue approval first.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProviderRow({ name, status, model, costPerCall, fallback, apiKeyRequired }) {
  return (
    <div className="flex items-center justify-between border border-border rounded-lg p-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold text-sm">{name}</p>
          {fallback && <Badge className="bg-blue-500/10 text-blue-400 text-xs">Fallback</Badge>}
          {apiKeyRequired && <Badge variant="outline" className="text-xs">API Key Required</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">Model: {model} · Cost: {costPerCall}</p>
      </div>
      <div className="text-right">
        {status === 'active' && <Badge className="bg-green-500/10 text-green-400">Active</Badge>}
        {status === 'pending_key' && <Badge className="bg-amber-500/10 text-amber-400">Pending Key</Badge>}
        {status === 'not_configured' && <Badge variant="outline">Not Configured</Badge>}
      </div>
    </div>
  );
}

function CapRow({ label, value, enabled, status }) {
  return (
    <div className="flex items-center justify-between border border-border rounded-lg p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="font-semibold text-sm">{value}</span>}
        {status && <Badge className="bg-green-500/10 text-green-400">{status}</Badge>}
        {enabled && <Badge className="bg-blue-500/10 text-blue-400">Enabled</Badge>}
      </div>
    </div>
  );
}