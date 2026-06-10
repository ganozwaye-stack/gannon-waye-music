import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SCENARIOS = [
  { label: 'Conservative (1 client/mo)', sessions: 1, pricePerSession: 250, monthly: 250, annual: 3000 },
  { label: 'Moderate (4 clients/mo)', sessions: 4, pricePerSession: 300, monthly: 1200, annual: 14400 },
  { label: 'Target (8 clients/mo)', sessions: 8, pricePerSession: 350, monthly: 2800, annual: 33600 },
  { label: 'Stretch (12 clients/mo)', sessions: 12, pricePerSession: 400, monthly: 4800, annual: 57600 },
];

const PROGRAMS = [
  { name: 'Clarity Reset Session', suggested: '$150–$300', tier: 'Entry' },
  { name: '4-Week Mindset Rebuild', suggested: '$800–$1,500', tier: 'Mid' },
  { name: '8-Week Mentorship', suggested: '$2,000–$3,500', tier: 'Core' },
  { name: 'Artist Mentorship', suggested: '$1,500–$3,000', tier: 'Specialty' },
  { name: 'VIP Intensive', suggested: '$2,500–$5,000', tier: 'Premium' },
];

export default function CoachingROI() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Coaching ROI</h1>
          <p className="text-sm text-muted-foreground">Revenue potential and program pricing models</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Suggested Program Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {PROGRAMS.map(p => (
            <div key={p.name} className="flex items-center justify-between border border-border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.tier} tier</p>
              </div>
              <p className="text-sm font-bold gradient-gold-glow">{p.suggested}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" />Revenue Scenarios</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SCENARIOS.map(s => (
              <div key={s.label} className="border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-bold gradient-gold-glow">${s.monthly.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per month</p>
                <p className="text-sm text-foreground/60 mt-1">${s.annual.toLocaleString()} / year</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Combined Music + Coaching Revenue Potential</p>
              <p className="text-xs text-muted-foreground mt-1">At target coaching volume ($2,800/mo) combined with music store revenue, total monthly revenue potential exceeds $5,000/mo. Coaching adds a high-margin, recurring revenue stream that compounds.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}