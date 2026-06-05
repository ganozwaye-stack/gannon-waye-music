import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const ONBOARDING_PHASES = [
  {
    phase: 'Phase 1 — Discovery (Week 1)',
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-400',
    steps: [
      'Kick-off call: understand client goals, platforms, team size',
      'Audit existing tools, social handles, payment setups',
      'Map their content calendar and release schedule',
      'Identify top 3 revenue opportunities for their profile',
      'Define approval rules (what needs human review)',
      'Set risk levels for each agent type',
    ],
  },
  {
    phase: 'Phase 2 — Setup (Week 2)',
    color: 'border-purple-500/30 bg-purple-500/5',
    badge: 'bg-purple-500/10 text-purple-400',
    steps: [
      'Create client workspace and admin login',
      'Configure Site Settings with their brand info',
      'Set up Agent Registry with their specific agent lineup',
      'Connect Stripe, Gmail, Slack, Google Sheets',
      'Configure shipping rates and promo codes',
      'Brief Orchestrator with client-specific instructions',
      'Load Knowledge Vault with brand context and goals',
    ],
  },
  {
    phase: 'Phase 3 — Training (Week 3)',
    color: 'border-amber-500/30 bg-amber-500/5',
    badge: 'bg-amber-500/10 text-amber-400',
    steps: [
      'Walk client through Notifications dashboard',
      'Train them on ApprovalQueue (what to approve, what to reject)',
      'Show Agent Registry — how to activate/pause agents',
      'Demo Research Grid live scan',
      'Show Executive Feed and how to act on it',
      'Set up their daily 5-minute review routine',
      'Record onboarding video for their reference',
    ],
  },
  {
    phase: 'Phase 4 — Go Live (Week 4)',
    color: 'border-green-500/30 bg-green-500/5',
    badge: 'bg-green-500/10 text-green-400',
    steps: [
      'Enable all scheduled automations',
      'Activate research + trend loops',
      'Run first Executive Morning Brief',
      'Complete Go-Live Checklist',
      'Confirm store/checkout works end to end',
      'First approval queue items reviewed together',
      'Handover document delivered',
    ],
  },
];

const HANDOVER_CHECKLIST = [
  'Site Settings complete with all brand info',
  'Agent Registry populated and statuses confirmed',
  'Knowledge Vault seeded with brand context',
  'At least one Orchestrator conversation completed',
  'ApprovalQueue workflow explained and understood',
  'Notifications dashboard reviewed',
  'Stripe connected and test order placed',
  'Gmail/Slack alerts confirmed working',
  'Shipping rates confirmed',
  'Promo codes set up',
  'Go-Live Checklist passed',
  'Client understands their daily review routine',
  'Support process explained',
  'Monthly monitoring schedule confirmed',
];

export default function ClientOnboarding() {
  const [openPhase, setOpenPhase] = useState(0);
  const [checked, setChecked] = useState({});

  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Client Onboarding</h1>
        <p className="text-muted-foreground text-sm mt-1">4-week onboarding workflow for new AI OS clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Phases', value: 4, color: 'text-blue-400' },
          { label: 'Total Steps', value: ONBOARDING_PHASES.reduce((a, p) => a + p.steps.length, 0), color: 'text-purple-400' },
          { label: 'Handover Items', value: HANDOVER_CHECKLIST.length, color: 'text-green-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {ONBOARDING_PHASES.map((phase, i) => (
          <Card key={phase.phase} className={`border ${phase.color}`}>
            <button className="w-full text-left p-4 flex items-center justify-between" onClick={() => setOpenPhase(openPhase === i ? -1 : i)}>
              <div className="flex items-center gap-3">
                <Badge className={`text-xs ${phase.badge}`}>Week {i + 1}</Badge>
                <span className="text-sm font-medium">{phase.phase}</span>
              </div>
              {openPhase === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openPhase === i && (
              <CardContent className="pt-0 pb-4 space-y-1.5">
                {phase.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                    <ArrowRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                    {step}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />Handover Checklist
            <Badge className="ml-auto bg-green-500/10 text-green-400 text-xs">{checkedCount}/{HANDOVER_CHECKLIST.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {HANDOVER_CHECKLIST.map((item, i) => (
            <button key={i} onClick={() => toggle(`item-${i}`)} className="w-full flex items-center gap-2.5 text-sm text-left p-2 rounded hover:bg-secondary/30 transition-colors">
              {checked[`item-${i}`]
                ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />}
              <span className={checked[`item-${i}`] ? 'line-through text-muted-foreground' : 'text-foreground/80'}>{item}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}