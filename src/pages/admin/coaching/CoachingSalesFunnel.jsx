import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FUNNEL_STAGES = [
  { stage: 'Awareness', desc: 'Music fans discover coaching via Instagram, TikTok, or website', tools: ['Instagram Story CTAs', 'Bio link', 'Website coaching page'], status: 'Not live', prospects: 0 },
  { stage: 'Interest', desc: 'Visitor lands on coaching page and reads about programs', tools: ['Coaching landing page', 'Program overview', 'Gannon\'s story'], status: 'Not live', prospects: 0 },
  { stage: 'Enquiry', desc: 'Potential client submits an enquiry or books a discovery call', tools: ['Contact form', 'Discovery call booking', 'Email capture'], status: 'Not live', prospects: 0 },
  { stage: 'Discovery Call', desc: '30-min free call to assess fit and present programs', tools: ['Session scheduler', 'Intake questionnaire', 'Program PDF'], status: 'Not live', prospects: 0 },
  { stage: 'Proposal', desc: 'Tailored program proposal sent to prospect', tools: ['Program options', 'Pricing sheet', 'Testimonials'], status: 'Not live', prospects: 0 },
  { stage: 'Onboarding', desc: 'Client signs agreement, pays, and receives welcome package', tools: ['DocuSign/agreements', 'Payment (Stripe)', 'Welcome email'], status: 'Not live', prospects: 0 },
  { stage: 'Active Client', desc: 'Client is in an active program', tools: ['Session scheduler', 'Client dashboard', 'Resources library'], status: 'Not live', prospects: 0 },
];

export default function CoachingSalesFunnel() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Sales Funnel (Draft)</h1>
          <p className="text-sm text-muted-foreground">Funnel stages — not live</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300/80">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        This funnel is planned but not active. No traffic, no clients, no conversions yet.
      </div>

      <div className="space-y-3">
        {FUNNEL_STAGES.map((stage, i) => (
          <Card key={stage.stage} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{stage.stage}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{stage.prospects} prospects</span>
                      <Badge className="bg-secondary text-muted-foreground text-[10px]">{stage.status}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stage.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {stage.tools.map(t => (
                      <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}