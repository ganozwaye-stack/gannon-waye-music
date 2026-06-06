import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, AlertTriangle, Check, Info, FileText, Scale } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CoachingLegal() {
  const { toast } = useToast();

  const [documentStates, setDocumentStates] = useState({
    'service-agreement': 'Needs Professional Review',
    'client-waiver': 'Needs Professional Review',
    'crisis-disclaimer': 'Approved Internally',
    'scope-of-practice': 'Approved Internally',
  });

  const DOCUMENTS = {
    'service-agreement': {
      title: 'Resilience Mentoring Service Agreement',
      desc: 'Defines booking guidelines, cancellation boundaries, subscription terms, and clear scope limits.',
      text: `RESILIENCE MENTORING - CLIENT SERVICE AGREEMENT
Copyright © 2026 Gannon Waye. All Rights Reserved.
--------------------------------------------------
This Agreement is entered into by Gannon Waye ("Mentor") trading under Resilience Mentoring, and the client.

1. SCOPE OF SERVICES: The Mentor provides coaching and guidance under the sub-brands Resilience Mindset, Resilience Fitness, and Resilience Planning. The client understands that coaching is an educational, goal-setting, and accountability relationship. It is not psychotherapeutic treatment, clinical counseling, medical advising, or professional financial advising.

2. CANCELLATION & FEES: Sessions must be cancelled at least 24 hours in advance. Failure to cancel within this timeframe results in billing at the full rate. All subscription plans are billed monthly in advance.

3. CONFIDENTIALITY: All discussions, worksheets, and card readings are held in strict confidence, except where disclosure is required by law (e.g., immediate threat of harm to self or others).`
    },
    'client-waiver': {
      title: 'Resilience Fitness & Mentoring Liability Waiver',
      desc: 'Protects Gannon Waye and Resilience Fitness from injury liability during kinetic movements or holistic training.',
      text: `RESILIENCE FITNESS & MENTORING - ASSUMPTION OF RISK & LIABILITY WAIVER
Copyright © 2026 Gannon Waye. All Rights Reserved.
--------------------------------------------------
PLEASE READ THIS CAREFULLY. BY ENROLLING IN THESE PROGRAMS, YOU WAIVE CERTAIN LEGAL RIGHTS.

1. PHYSICAL ACTIVITY RISK: Resilience Fitness programs include kinetic movement flows, mobility conditioning, and nutritional protocols. The client acknowledges that physical exercise involves inherent risk of injury. The client certifies that they are physically fit and have consulted a general practitioner (GP) before starting.

2. HOLD HARMLESS & RELEASE: The client agrees to release, waive, and forever discharge Gannon Waye, Resilience Mentoring, Resilience Fitness, and Gannon Waye Music from any and all claims, liabilities, or injuries arising directly or indirectly from participation.

3. NO FINANCIAL OR MEDICAL WARRANTY: All budgeting exercises (Resilience Planning) and intuitive spread logs (Resilience Intuitive Guidance) are educational. The mentor makes no warranties regarding specific financial gains, physical changes, or medical outcomes.`
    },
    'crisis-disclaimer': {
      title: 'Resilience Mentoring Crisis Disclaimer',
      desc: 'Mandatory emergency warning text displayed to clients before onboarding and inside the dashboard.',
      text: `CRISIS AND EMERGENCY RESOURCES DISCLAIMER
-----------------------------------------
Resilience Mentoring is a development coaching practice. It is not an emergency hotline or psychological crisis clinic. If you are experiencing thoughts of self-harm, a mental health emergency, or severe psychological distress, please contact dedicated crisis lines immediately:

- AUSTRALIA: Call 13 11 14 (Lifeline) or 000 for emergency services.
- UNITED STATES: Call or Text 988 (Suicide & Crisis Lifeline) or 911.
- UNITED KINGDOM: Call 111 or Samaritans at 116 123.

By signing this disclaimer, you acknowledge that Gannon Waye cannot respond to clinical mental health crises and agree to contact emergency support services if a crisis arises.`
    },
    'scope-of-practice': {
      title: 'Resilience Mentoring Scope of Practice',
      desc: 'Clear statement establishing that coaching is strictly non-medical, non-clinical, and non-financial.',
      text: `COACHING SCOPE OF PRACTICE STATEMENT
-------------------------------------
Gannon Waye is a holistic mentor and lived-experience coach. He holds expertise based on personal survival, PT conditioning (Resilience Fitness), and wellness habits.

He is NOT a licensed psychotherapist, clinical psychologist, medical doctor, or registered financial planner. 

His programs and worksheets do NOT:
- Diagnose or treat mental illness, clinical trauma, or chronic depression.
- Prescribe medical treatments, drugs, or diet therapies.
- Offer regulated financial advice or investment recommendations.

If the client requires clinical therapy, medical diagnosis, or registered financial planning, the mentor will assist in suggesting they seek qualified professional care.`
    }
  };

  const handleToggleState = (key) => {
    const currentState = documentStates[key];
    const nextState = currentState === 'Needs Professional Review' 
      ? 'Approved Internally' 
      : 'Needs Professional Review';
    
    setDocumentStates({
      ...documentStates,
      [key]: nextState
    });

    toast({
      title: "Document Status Updated",
      description: `Status of "${DOCUMENTS[key].title}" set to "${nextState}".`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Legal & Compliance Console</h1>
          <p className="text-sm text-muted-foreground mt-1">Staging and approval checkouts for Resilience Mentoring disclaimers, contracts, and waivers.</p>
        </div>
      </div>

      {/* Warnings & Scope of Practice guidelines */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
          <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
          <CardTitle className="text-sm text-red-200">Legal Shield Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-red-200/80 leading-relaxed space-y-2">
          <p>
            To protect your business from liability, each client **must sign the Service Agreement and Liability Waiver** before starting any mentoring or Resilience Fitness PT program. All public copy should stick strictly to the guidelines below:
          </p>
          <div className="grid grid-cols-2 gap-4 bg-black/30 p-3 rounded-lg border border-red-500/10">
            <div>
              <span className="font-bold text-red-300 block mb-1">PROHIBITED TERMS (AVOID LIABILITY)</span>
              <span className="line-through">therapy, cure, diagnosis, trauma counseling, financial advisory, medical treatment</span>
            </div>
            <div>
              <span className="font-bold text-green-300 block mb-1">PERMITTED TERMS (SAFE BOARDS)</span>
              <span>resilience mentoring, physical conditioning, fitness flow, budget planning, intuition exercises</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staged Documents List */}
      <div className="space-y-6">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2 text-foreground">
          <Scale className="w-5 h-5 text-primary" /> Staged legal Documents ({Object.keys(DOCUMENTS).length})
        </h2>

        {Object.entries(DOCUMENTS).map(([key, doc]) => {
          const status = documentStates[key];
          const isApproved = status === 'Approved Internally';
          return (
            <Card key={key} className="border-border bg-card/60 backdrop-blur-md">
              <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> {doc.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">{doc.desc}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${isApproved ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                    {status}
                  </Badge>
                  <Button size="xs" variant="outline" className="text-[10px] h-7" onClick={() => handleToggleState(key)}>
                    Change Status
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/40 rounded-lg p-4 font-mono text-xs border border-border/20 max-h-48 overflow-y-auto leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {doc.text}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
