import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Video, Image, MessageSquare, ShoppingBag, Music, Heart, TrendingUp, CheckCircle2, Clock, AlertTriangle, ExternalLink, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS = 10;
const TARGET_DATE = new Date('2026-06-05'); // June 5, 2026 release

export default function ReleasePromoCommand() {
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate 10-day campaign plan
  const campaignPlan = Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(TARGET_DATE);
    date.setDate(date.getDate() - (DAYS - i));
    return {
      day: i + 1,
      date: date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }),
      videos: 3,
      stories: 5,
      communityCTA: 1,
      merchCTA: 1,
      status: i < 2 ? 'in_progress' : 'pending',
    };
  });

  const totalContent = {
    videos: campaignPlan.reduce((acc, d) => acc + d.videos, 0),
    stories: campaignPlan.reduce((acc, d) => acc + d.stories, 0),
    communityCTAs: campaignPlan.reduce((acc, d) => acc + d.communityCTA, 0),
    merchCTAs: campaignPlan.reduce((acc, d) => acc + d.merchCTA, 0),
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Release Promo Command</h1>
          <p className="text-muted-foreground text-sm mt-1">10-day campaign to June 5, 2026 release — "Thank You" single launch</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Create ApprovalQueue Item</Button>
      </div>

      {/* Campaign Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Total Videos" value={totalContent.videos} icon={Video} color="text-red-400" bg="bg-red-500/10" />
        <SummaryCard label="Total Stories" value={totalContent.stories} icon={Image} color="text-blue-400" bg="bg-blue-500/10" />
        <SummaryCard label="Community CTAs" value={totalContent.communityCTAs} icon={Heart} color="text-green-400" bg="bg-green-500/10" />
        <SummaryCard label="Merch CTAs" value={totalContent.merchCTAs} icon={ShoppingBag} color="text-amber-400" bg="bg-amber-500/10" />
      </div>

      {/* Campaign Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> 10-Day Campaign Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {campaignPlan.map(day => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day)}
              className="w-full text-left border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-secondary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={day.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-secondary text-muted-foreground'}>
                    Day {day.day}
                  </Badge>
                  <span className="font-semibold text-sm">{day.date}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {day.videos}</span>
                  <span className="flex items-center gap-1"><Image className="w-3 h-3" /> {day.stories}</span>
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {day.communityCTA}</span>
                  <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {day.merchCTA}</span>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Content Templates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Content Templates (Draft - Approval Required)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <TemplateRow type="Video Hook" count={30} desc="3 short videos/day × 10 days" status="draft" />
          <TemplateRow type="Story Template" count={50} desc="5 stories/day × 10 days" status="draft" />
          <TemplateRow type="Community CTA" count={10} desc="1 CTA/day × 10 days" status="draft" />
          <TemplateRow type="Merch/Music CTA" count={10} desc="1 CTA/day × 10 days" status="draft" />
        </CardContent>
      </Card>

      {/* Approval Status */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-green-400">
            <CheckCircle2 className="w-4 h-4" /> Approval Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✓ All content drafts are created in ApprovalQueue before posting</p>
          <p>✓ No external posts without admin approval</p>
          <p>✓ OAuth/app review required for TikTok/Instagram auto-posting</p>
          <p className="text-xs text-muted-foreground mt-2">
            Source chain: ReleasePromoCommand → ApprovalQueue → Admin Approval → Social Poster → Platform API
          </p>
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color, bg }) {
  if (!Icon) return null;
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`${bg} p-2 rounded-lg shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TemplateRow({ type, count, desc, status }) {
  return (
    <div className="flex items-center justify-between border border-border rounded-lg p-3">
      <div>
        <p className="font-semibold text-sm">{type}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={status === 'draft' ? 'outline' : 'default'}>{status}</Badge>
        <span className="text-sm font-mono">{count}</span>
      </div>
    </div>
  );
}

function DayDetailModal({ day, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-display font-bold">Day {day.day} — {day.date}</h2>
        <div className="grid grid-cols-2 gap-3">
          <DetailRow label="Videos" value={day.videos} icon={Video} />
          <DetailRow label="Stories" value={day.stories} icon={Image} />
          <DetailRow label="Community CTA" value={day.communityCTA} icon={Heart} />
          <DetailRow label="Merch CTA" value={day.merchCTA} icon={ShoppingBag} />
        </div>
        <div className="space-y-2 pt-2 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Tasks</p>
          <ul className="text-sm space-y-1">
            <li>• Record 3 short videos (hook, behind-scenes, fan CTA)</li>
            <li>• Post 5 stories (countdown, lyrics, merch, poll, thank you)</li>
            <li>• Community CTA: "Share your favorite lyric"</li>
            <li>• Merch CTA: "Thank You CD + Hoodie bundle"</li>
          </ul>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1">Create ApprovalQueue Items</Button>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Release: June 5, 2026 · Recording: June 4, 2026
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon: Icon }) {
  if (!Icon) return null;
  return (
    <div className="border border-border rounded-lg p-3 flex items-center gap-3">
      <Icon className="w-4 h-4 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}