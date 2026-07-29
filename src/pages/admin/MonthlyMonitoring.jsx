// @ts-nocheck
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Activity, AlertTriangle, Zap, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const MONTHLY_CHECKLIST = [
  { category: 'System Health', items: ['Check System Health dashboard', 'Review failed automations', 'Verify all API credentials active', 'Check for broken links', 'Confirm payment flow working'] },
  { category: 'Agent Activity', items: ['Review Agent Task Log (last 30 days)', 'Check Agent Learning Records', 'Identify idle agents and activate if needed', 'Review ApprovalQueue history'] },
  { category: 'Revenue', items: ['Review Financial Dashboard', 'Check Stripe Live Report', 'Review order fulfillment rate', 'Identify top products', 'Check promo code usage'] },
  { category: 'Growth', items: ['Review Research Grid for new opportunities', 'Check Trend Monitor for current trends', 'Review Creator Insights', 'Check Growth Engine metrics'] },
  { category: 'Community', items: ['Review flagged community posts', 'Check fan media submissions', 'Review subscriber growth', 'Check engagement metrics'] },
  { category: 'Content', items: ['Review scheduled content in Approval Queue', 'Check Social Monitor for engagement', 'Review Content Dashboard', 'Update Knowledge Vault with new info'] },
  { category: 'Recommendations', items: ['Generate Executive Morning Brief', 'Review Ideas Engine output', 'Present top 3 opportunities to client', 'Document completed improvements'] },
];

export default function MonthlyMonitoring() {
  const [checked, setChecked] = useState({});
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState('');

  const { data: logs = [] } = useQuery({
    queryKey: ['monthly-logs'],
    queryFn: () => base44.entities.AgentTaskLog.list('-created_date', 100),
  });
  const { data: alerts = [] } = useQuery({
    queryKey: ['monthly-alerts'],
    queryFn: () => base44.entities.AdminNotification.filter({ is_read: false }, '-created_date', 50),
  });
  const { data: learnings = [] } = useQuery({
    queryKey: ['monthly-learnings'],
    queryFn: () => base44.entities.AgentLearningRecord.list('-created_date', 20),
  });

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const totalItems = MONTHLY_CHECKLIST.reduce((a, c) => a + c.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const generateReport = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a monthly monitoring report for the GanozMix AI Operating System.

Recent Activity:
- Agent task logs (last 100): ${logs.length} actions
- Unread notifications: ${alerts.length}
- Learning records: ${learnings.length}
- Checklist completion: ${checkedCount}/${totalItems} items

Generate a concise monthly report with:
1. System health summary
2. Agent activity highlights  
3. Top opportunities identified this month
4. Issues resolved / outstanding
5. Recommendations for next month
6. Key metrics trend (up/down/stable)

Keep it professional, specific, and actionable.`,
      });
      setReport(result);
      toast.success('Monthly report generated');
    } catch {
      toast.error('Failed to generate report');
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Monthly Monitoring</h1>
          <p className="text-muted-foreground text-sm mt-1">Monthly management checklist and reporting workflow</p>
        </div>
        <Button onClick={generateReport} disabled={generating} className="gradient-gold-button border-0 gap-2">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Generate Monthly Report
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Agent Actions', value: logs.length, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Unread Alerts', value: alerts.length, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Learning Records', value: learnings.length, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Checklist', value: `${checkedCount}/${totalItems}`, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${s.bg} p-2 rounded-lg`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {report && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2"><CardTitle className="text-base">Generated Monthly Report</CardTitle></CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none text-sm whitespace-pre-wrap">{report}</div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {MONTHLY_CHECKLIST.map(cat => (
          <Card key={cat.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{cat.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {cat.items.map((item, i) => {
                const key = `${cat.category}-${i}`;
                return (
                  <button key={key} onClick={() => toggle(key)} className="w-full flex items-center gap-2.5 text-sm text-left p-2 rounded hover:bg-secondary/30 transition-colors">
                    {checked[key]
                      ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <span className={checked[key] ? 'line-through text-muted-foreground' : 'text-foreground/80'}>{item}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}