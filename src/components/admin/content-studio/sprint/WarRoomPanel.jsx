import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  RefreshCw, CheckCircle, ArrowRight, CalendarClock, Zap
} from 'lucide-react';

// Lifted from src/pages/admin/LaunchContentHub.jsx — the War Room (release
// countdown + live pipeline) and the pending approval queue over raw SocialAssets.
export default function WarRoomPanel() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: queue = [], isLoading: isLoadingQueue } = useQuery({
    queryKey: ['approval-queue'],
    queryFn: () => base44.entities.SocialAsset.filter({ status: 'raw' }),
    initialData: [],
  });

  const { data: releases = [], isLoading: isLoadingReleases } = useQuery({
    queryKey: ['launch-hub-releases'],
    queryFn: () => base44.entities.Release.list(),
  });
  const { data: contentRecords = [], isLoading: isLoadingContent } = useQuery({
    queryKey: ['launch-hub-content'],
    queryFn: () => base44.entities.ContentStudioRecord.list('-created_date', 100),
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcomingReleases = releases
    .filter(r => r.release_date && r.status !== 'released')
    .map(r => ({ ...r, target: new Date(`${r.release_date}T00:00:00`) }))
    .filter(r => r.target >= startOfToday)
    .sort((a, b) => a.target - b.target);

  const nextRelease = upcomingReleases[0] || releases.find(r => r.is_current_single) || null;
  const hasUpcoming = upcomingReleases.length > 0;

  const pendingReviewCount = contentRecords.filter(c => c.approval_status === 'needs_review').length;
  const scheduledPosts = contentRecords
    .filter(c => c.scheduled_date && c.posted_status !== 'posted' && new Date(c.scheduled_date) > new Date())
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));
  const nextPosts = scheduledPosts.slice(0, 4);

  const [timeLeft, setTimeLeft] = useState('');
  const countdownTarget = upcomingReleases[0] || null;
  useEffect(() => {
    if (!countdownTarget) { setTimeLeft(''); return; }
    const target = countdownTarget.target;
    const update = () => {
      const diff = target - new Date();
      if (diff <= 0) { setTimeLeft('RELEASE IS LIVE!'); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [countdownTarget?.release_date]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next release countdown & live pipeline */}
        <Card className="lg:col-span-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/20 text-primary border border-primary/30">{hasUpcoming ? 'NEXT RELEASE' : 'CURRENT SINGLE'}</Badge>
              <span className="font-body text-xs text-muted-foreground">
                Campaign: {nextRelease ? nextRelease.title : 'No campaign set'}
              </span>
            </div>
            <CardTitle className="font-display text-4xl font-bold tracking-tight text-white mt-4">
              {isLoadingReleases
                ? 'Loading…'
                : hasUpcoming
                  ? timeLeft
                  : nextRelease
                    ? `${nextRelease.title} is out now`
                    : 'No upcoming release'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {nextRelease
                ? `${nextRelease.title} · ${String(nextRelease.status || '').replace(/_/g, ' ')}${nextRelease.release_date ? ` · due ${nextRelease.release_date}` : ''}`
                : 'Open the New Release Studio to schedule your next launch.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/admin/approval-queue" className="block p-3 bg-secondary/30 rounded-xl border border-border/40 hover:border-primary/40 transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Awaiting Approval</p>
                <p className="text-xl font-bold text-primary mt-1">{isLoadingContent ? '…' : pendingReviewCount} items</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">Approval Queue <ArrowRight className="w-3 h-3" /></p>
              </Link>
              <Link to="/admin/social-schedule-queue" className="block p-3 bg-secondary/30 rounded-xl border border-border/40 hover:border-primary/40 transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Scheduled Posts</p>
                <p className="text-xl font-bold text-primary mt-1">{isLoadingContent ? '…' : scheduledPosts.length} queued</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">Schedule Queue <ArrowRight className="w-3 h-3" /></p>
              </Link>
              <Link to="/admin/releases" className="block p-3 bg-secondary/30 rounded-xl border border-border/40 hover:border-primary/40 transition-colors">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Release Pipeline</p>
                <p className="text-xl font-bold text-primary mt-1">{isLoadingReleases ? '…' : releases.length} releases</p>
                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">Manage Releases <ArrowRight className="w-3 h-3" /></p>
              </Link>
            </div>

            <div className="border-t border-border/30 pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-semibold text-white">Next scheduled content:</h4>
                <Link to="/admin/content-studio" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Content Studio <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {isLoadingContent ? (
                <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
              ) : nextPosts.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-border/30 rounded-xl">
                  <CalendarClock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-60" />
                  <p className="font-body text-xs text-muted-foreground">Nothing scheduled yet.</p>
                  <Link to="/admin/content-studio" className="font-body text-xs text-primary hover:underline mt-1 inline-block">
                    Draft your next post in the Content Studio →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {nextPosts.map(post => (
                    <Link
                      key={post.id}
                      to="/admin/content-studio"
                      className="block p-2.5 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="truncate font-medium text-foreground">
                          {post.title || String(post.content_type || '').replace(/_/g, ' ')}
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          <Badge className="bg-primary/10 text-primary text-[10px]">{post.platform || 'all'}</Badge>
                          <span className="text-muted-foreground">
                            {new Date(post.scheduled_date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Launch quick actions */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="font-display text-lg text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Launch Quick Actions
            </CardTitle>
            <CardDescription className="text-xs">Jump straight to the tools that move the next release forward.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: 'New Release Studio', desc: 'Submit a new release in one press', path: '/admin/new-release-studio' },
              { label: 'Release Email Studio', desc: 'Approve the waiting fan email', path: '/admin/release-email-studio' },
              { label: 'Release Promo Command', desc: 'Run the 6-day promo campaign', path: '/admin/release-promo-command' },
              { label: 'Releases', desc: 'Approve and publish releases', path: '/admin/releases' },
            ].map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-between p-2.5 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-body text-xs font-medium text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Pending approval queue over raw SocialAssets */}
      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg text-white">Pending Approval Queue</CardTitle>
          <CardDescription className="text-xs">Social posts, reels, TikTok reviews, and campaigns awaiting manual sign-off.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingQueue ? (
            <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
          ) : queue.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/30 rounded-xl">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2 opacity-60" />
              <p className="text-xs text-muted-foreground">All content is approved or cleared. No pending actions.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map(item => (
                <div key={item.id} className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.notes}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => {
                        base44.entities.SocialAsset.update(item.id, { status: 'ready' })
                          .then(() => {
                            qc.invalidateQueries({ queryKey: ['approval-queue'] });
                            toast({ title: 'Approved!' });
                          });
                      }}
                      className="h-8 text-[10px] bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        base44.entities.SocialAsset.update(item.id, { status: 'archived' })
                          .then(() => {
                            qc.invalidateQueries({ queryKey: ['approval-queue'] });
                            toast({ title: 'Rejected / Archived' });
                          });
                      }}
                      className="h-8 text-[10px] text-red-400 hover:bg-red-500/10"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}