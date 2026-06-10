import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Lock, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RESOURCES = [
  { title: 'Week 1: Clarity Framework', type: 'Workbook', status: 'Draft', program: '4-Week Rebuild' },
  { title: 'Self-Leadership Assessment', type: 'Assessment', status: 'Draft', program: 'All Programs' },
  { title: 'Emotional Regulation Guide', type: 'Guide', status: 'Draft', program: '8-Week Mentorship' },
  { title: 'Daily Reflection Journal Template', type: 'Template', status: 'Draft', program: 'All Programs' },
  { title: 'Identity Mapping Exercise', type: 'Exercise', status: 'Draft', program: '8-Week Mentorship' },
  { title: 'Creative Block Breakthrough', type: 'Guide', status: 'Draft', program: 'Artist Mentorship' },
  { title: 'Post-Session Integration Sheet', type: 'Template', status: 'Draft', program: 'All Programs' },
];

export default function CoachingContentLibrary() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button></Link>
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Content Library</h1>
          <p className="text-sm text-muted-foreground">Private resources and reflection tools — not published</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 text-xs text-yellow-300/80">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        All resources are private drafts. Nothing is accessible to clients until launch gates are passed.
      </div>

      <div className="space-y-2">
        {RESOURCES.map(r => (
          <Card key={r.title} className="hover:border-primary/40 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                    <Badge className="bg-secondary text-muted-foreground text-[10px]">{r.program}</Badge>
                  </div>
                </div>
              </div>
              <Badge className="bg-secondary text-muted-foreground text-[10px] shrink-0">{r.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" className="w-full gap-2"><Plus className="w-4 h-4" />Add Resource (Draft)</Button>
    </div>
  );
}