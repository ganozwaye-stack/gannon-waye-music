import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Flower2, Heart, Mic, ScrollText, Sparkles, Users } from 'lucide-react';

const sections = [
  { icon: Heart, title: 'Tribute vision', status: 'review', text: 'A private planning space for a warm, nostalgic, family centred tribute to Sonia. Built first for Gannon and family review before public release.' },
  { icon: Camera, title: 'Photo library plan', status: 'missing', text: 'Organise real Sonia photos, family photos, children photos, garden photos, and approved archival images. No random generated people.' },
  { icon: Users, title: 'Children and family priority', status: 'missing', text: 'Prioritise Sonia with her children, grandchildren, siblings, and family moments. Structure the page as a tribute from her children who love and adore her.' },
  { icon: Flower2, title: 'Garden scene builder', status: 'missing', text: 'Design a living garden world with plants, breeze, butterflies, coffee, flowers, and memory scenes that feel grounded and gentle.' },
  { icon: Sparkles, title: 'Scroll animation plan', status: 'missing', text: 'Plan where Sonia appears softly as the viewer scrolls, using respectful stylised movement from real photos only after approval.' },
  { icon: ScrollText, title: 'Eulogy and speeches archive', status: 'missing', text: 'Store eulogy, funeral recording, Gannon speech, sibling speeches, and written memories for review and page writing.' },
  { icon: Mic, title: 'Voice archive', status: 'review', text: 'Archive real voice messages and video audio. Synthetic voice remains locked until explicit family approval.' },
];

const statusClasses = {
  ok: 'bg-green-500/10 text-green-400 border-green-500/30',
  review: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  missing: 'bg-secondary text-muted-foreground border-border',
};

export default function MumTributeStudio() {
  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Sonia Living Garden</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Mum Tribute Studio</h1>
        <p className="text-sm text-muted-foreground max-w-3xl">A private design studio for rebuilding Mum’s page properly, with approved family memories, real photos, gentle animation planning, and clear review steps.</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Heart className="h-4 w-4 text-primary" />Design rule</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>This page is tribute planning only. The public version stays closed until the family archive, design, consent, and review steps are complete.</p>
          <p>Use real Sonia photos first. Any stylised animation must remain respectful, clearly approved, and never pretend to replace her.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(item => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{item.title}</span>
                  <Badge variant="outline" className={statusClasses[item.status]}>{item.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.text}</CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
