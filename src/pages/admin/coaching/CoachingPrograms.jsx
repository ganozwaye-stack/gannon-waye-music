import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Edit2, Plus, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PROGRAMS = [
  {
    name: 'Clarity Reset Session',
    type: 'Single Session',
    price: null,
    status: 'Draft',
    desc: '1:1 session to cut through noise and get clear on the next move.',
    duration: '60–90 mins',
    format: 'Video call or in-person',
    outcomes: ['Clear on immediate next steps', 'Identify the core block', 'Actionable plan within 48hrs'],
  },
  {
    name: '4-Week Mindset Rebuild',
    type: 'Short Program',
    price: null,
    status: 'Draft',
    desc: 'Four structured weeks of emotional resilience and self-leadership.',
    duration: '4 weeks',
    format: 'Weekly 60-min sessions + support',
    outcomes: ['Emotional regulation tools', 'Self-leadership framework', 'Resilience practices'],
  },
  {
    name: '8-Week Emotional Rebuilding Mentorship',
    type: 'Core Program',
    price: null,
    status: 'Draft',
    desc: 'Deep-dive mentorship through identity, confidence, and creative reawakening.',
    duration: '8 weeks',
    format: 'Bi-weekly sessions + workbooks',
    outcomes: ['Identity clarity', 'Confidence foundation', 'Creative unblocking'],
  },
  {
    name: 'Artist / Creator Mindset Mentorship',
    type: 'Specialty',
    price: null,
    status: 'Draft',
    desc: 'Built for artists navigating visibility, rejection, and creative blocks.',
    duration: 'Flexible',
    format: 'Custom structure',
    outcomes: ['Navigate public visibility', 'Handle rejection', 'Sustain creative output'],
  },
  {
    name: 'VIP Intensive',
    type: 'Premium',
    price: null,
    status: 'Draft',
    desc: 'Immersive half-day or full-day intensive for rapid clarity and direction.',
    duration: 'Half-day or full-day',
    format: 'Intensive in-person or video',
    outcomes: ['Rapid clarity', 'Strategic direction', 'Momentum plan'],
  },
];

export default function CoachingPrograms() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Programs (Staging)</h1>
          <p className="text-sm text-muted-foreground">Draft coaching programs — private, not published</p>
        </div>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-xs text-yellow-300/80">
        🔒 All programs are in DRAFT status. No prices set. Nothing is visible to the public until launch gates are passed.
      </div>

      <div className="space-y-3">
        {PROGRAMS.map((p, i) => (
          <Card key={p.name} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setExpanded(expanded === i ? null : i)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <Badge variant="outline" className="text-[10px]">{p.type}</Badge>
                      <Badge className="bg-secondary text-muted-foreground text-[10px]">{p.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground/60">
                      <span>⏱ {p.duration}</span>
                      <span>📍 {p.format}</span>
                      <span className="text-primary/50">Price: TBD</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 mt-1 ${expanded === i ? 'rotate-90' : ''}`} />
              </div>

              {expanded === i && (
                <div className="mt-4 pl-8 border-t border-border/30 pt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground/70 mb-2">Expected Outcomes</p>
                    <ul className="space-y-1">
                      {p.outcomes.map(o => (
                        <li key={o} className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-green-400">✓</span>{o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <Edit2 className="w-3 h-3" />Edit Program
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">Set Price</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="gap-2 w-full">
        <Plus className="w-4 h-4" />Add New Program (Draft)
      </Button>
    </div>
  );
}