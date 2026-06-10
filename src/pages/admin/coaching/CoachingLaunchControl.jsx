import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle2, Circle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GATES = [
  { label: 'Design approved by Gannon', desc: 'Review all pages, layouts, and branding for the coaching section', link: '/admin/coaching-programs' },
  { label: 'Legal wording reviewed by professional', desc: 'Engage a qualified legal professional to review all coaching documents', link: '/admin/coaching-legal' },
  { label: 'All documents approved', desc: 'Every legal document signed off internally before going live', link: '/admin/coaching-legal' },
  { label: 'Client dashboard tested', desc: 'Run full test of client-facing dashboard with a test account', link: '/admin/client-management' },
  { label: 'Payment flow tested (no live charges yet)', desc: 'Complete a Stripe test checkout for each coaching program', link: '/admin/stripe-command-centre' },
  { label: 'Resources reviewed by Gannon', desc: 'All content library materials personally approved', link: '/admin/coaching-content-library' },
  { label: 'Meditations reviewed by Gannon', desc: 'All meditation tracks personally listened to and approved', link: '/admin/meditation-library' },
  { label: 'Music site still working after integration', desc: 'Full regression test of music site to confirm no coaching integration breaks it', link: '/admin/site-health' },
  { label: 'Gannon clicks final launch approval', desc: 'The final confirmation — only Gannon can do this', link: null, isFinal: true },
];

export default function CoachingLaunchControl() {
  const [checked, setChecked] = useState({});
  const passed = Object.values(checked).filter(Boolean).length;
  const allPassed = passed === GATES.length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Launch Control</h1>
          <p className="text-sm text-muted-foreground">All 9 gates must pass before coaching goes live</p>
        </div>
      </div>

      <Card className={allPassed ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className={`font-bold text-base ${allPassed ? 'text-green-400' : 'text-red-400'}`}>
              {allPassed ? '🟢 ALL GATES PASSED — Launch ready' : `🔒 ${passed}/${GATES.length} gates passed`}
            </p>
            <Badge className={allPassed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>{passed}/{GATES.length}</Badge>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(passed / GATES.length) * 100}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {GATES.map((gate, i) => {
          const done = !!checked[i];
          return (
            <Card key={i} className={`transition-colors ${done ? 'border-green-500/30 bg-green-500/5' : 'hover:border-primary/30'}`}>
              <CardContent className="p-4 flex items-start gap-4">
                <button onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))} className="shrink-0 mt-0.5">
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                    : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  }
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${done ? 'text-green-400' : 'text-foreground'}`}>{gate.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{gate.desc}</p>
                  {gate.link && (
                    <Link to={gate.link} className="text-xs text-primary/70 hover:text-primary mt-1 inline-block transition-colors">
                      → Go to page
                    </Link>
                  )}
                </div>
                {gate.isFinal && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] shrink-0">Final Step</Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button disabled={!allPassed} className={`w-full ${allPassed ? 'gradient-gold-button' : 'opacity-40 cursor-not-allowed'}`} size="lg">
        {allPassed ? '🚀 ACTIVATE COACHING LIVE MODE' : `🔒 Locked — ${GATES.length - passed} gates remaining`}
      </Button>

      <div className="flex items-start gap-3 bg-secondary/20 border border-border rounded-xl p-4">
        <Shield className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">Activating coaching live mode will make coaching pages publicly visible and enable payment processing. This action is logged and can be reversed by Gannon only.</p>
      </div>
    </div>
  );
}