import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Lock, Plus, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const MEDITATIONS = [
  { title: 'Morning Clarity Breath', duration: '8 min', type: 'Breathwork', status: 'Draft', program: 'All Programs' },
  { title: 'Releasing Anxiety Body Scan', duration: '15 min', type: 'Body Scan', status: 'Draft', program: '8-Week Mentorship' },
  { title: 'Creative Unblocking Visualisation', duration: '12 min', type: 'Visualisation', status: 'Draft', program: 'Artist Mentorship' },
  { title: 'Evening Integration Practice', duration: '10 min', type: 'Reflection', status: 'Draft', program: 'All Programs' },
  { title: 'Confidence Activation', duration: '7 min', type: 'Affirmation', status: 'Draft', program: 'All Programs' },
  { title: 'Grief & Healing Space', duration: '20 min', type: 'Guided', status: 'Draft', program: '8-Week Mentorship' },
];

export default function MeditationLibrary() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Meditation Library</h1>
          <p className="text-sm text-muted-foreground">Private meditations — not published to clients</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300/80">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        All meditations must be reviewed and approved by Gannon before being published. These are drafts only.
      </div>

      <div className="space-y-2">
        {MEDITATIONS.map(m => (
          <Card key={m.title} className="hover:border-primary/40 transition-colors">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{m.title}</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{m.type}</Badge>
                    <Badge variant="outline" className="text-[10px]">⏱ {m.duration}</Badge>
                    <Badge className="bg-secondary text-muted-foreground text-[10px]">{m.program}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className="bg-secondary text-muted-foreground text-[10px]">{m.status}</Badge>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-primary">
                  <Play className="w-3 h-3" />Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" />Add Meditation (Draft)</Button>
    </div>
  );
}