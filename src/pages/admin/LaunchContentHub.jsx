import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Flame, Radio, Clock, ShieldAlert, ShieldCheck,
  RefreshCw, Send, Volume2, Link as LinkIcon, CheckCircle,
  ArrowRight, CalendarClock, Zap
} from 'lucide-react';

export default function LaunchContentHub() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('war-room');

  // Live feed setup wizard states
  const [micActive, setMicActive] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [manualTimestamps, setManualTimestamps] = useState([]);

  // AI Brand Guardian inputs
  const [guardianText, setGuardianText] = useState('');
  const [guardianLink, setGuardianLink] = useState('https://gannonwaye.com/store');
  const [guardianResults, setGuardianResults] = useState(null);

  // Approval queue items (raw social assets)
  const { data: queue = [], isLoading: isLoadingQueue } = useQuery({
    queryKey: ['approval-queue'],
    queryFn: () => base44.entities.SocialAsset.filter({ status: 'raw' }),
    initialData: [],
  });

  // Live records only — the war room never shows mock numbers.
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

  // Countdown to the next scheduled release date
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

  const defaultStreamTopic = nextRelease ? `${nextRelease.title} — Release Chat & Story Q&A` : 'Release Chat & Story Q&A';
  const [streamTopic, setStreamTopic] = useState('');

  const addClipTimestamp = () => {
    const timestamp = new Date().toLocaleTimeString();
    const topic = streamTopic || defaultStreamTopic;
    setManualTimestamps(prev => [...prev, { time: timestamp, topic }]);
    toast({ title: 'Clip Marker Set!', description: `Timestamped at ${timestamp}` });
  };

  // Run AI Brand Guardian check
  const runGuardianCheck = () => {
    const issues = [];
    const text = guardianText;

    // Spelling checks
    if (text.toLowerCase().includes('thank you') && text.toLowerCase().includes('thankyou single')) {
      issues.push('Spelling violation: the single is titled "Thankyou" (one word).');
    }

    // Prohibited legal assertions
    if (text.toLowerCase().includes('tax-deductible') || text.toLowerCase().includes('tax deductible')) {
      issues.push('Legal Violation: Prohibited assertion "tax-deductible" detected for support tiers.');
    }
    if (text.toLowerCase().includes('therapy') || text.toLowerCase().includes('cures grief')) {
      issues.push('Legal Violation: Content contains mental health/therapy claims; prohibited.');
    }
    if (text.toLowerCase().includes('guaranteed income') || text.toLowerCase().includes('passive income')) {
      issues.push('Legal Violation: Contains unverified dropshipping/financial guarantees.');
    }

    // CTA Link checks
    if (!guardianLink.startsWith('https://gannonwaye.com/')) {
      issues.push('Link Error: External URL detected. All call-to-actions must lead back to the official gannonwaye.com site.');
    }

    if (issues.length > 0) {
      setGuardianResults({ status: 'flagged', issues });
      toast({ title: 'AI Brand Guardian Flagged Issues!', variant: 'destructive' });
    } else {
      setGuardianResults({ status: 'approved', issues: [] });
      toast({ title: 'AI Brand Guardian: Content Approved ✓' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Release Sprint Command</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Launch &amp; Content Hub</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Coordinate content releases, launch checklists, live-stream feeds, and brand governance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5 p-1 h-auto">
          <TabsTrigger value="war-room" className="text-xs py-2"><Flame className="w-3.5 h-3.5 mr-1 text-primary" /> War Room</TabsTrigger>
          <TabsTrigger value="live-feed" className="text-xs py-2"><Radio className="w-3.5 h-3.5 mr-1 text-primary" /> Live Setup</TabsTrigger>
          <TabsTrigger value="guardian" className="text-xs py-2"><ShieldAlert className="w-3.5 h-3.5 mr-1 text-primary" /> AI Guardian</TabsTrigger>
          <TabsTrigger value="approval-queue" className="text-xs py-2"><Clock className="w-3.5 h-3.5 mr-1 text-primary" /> Approval Queue ({queue.length})</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><LinkIcon className="w-3.5 h-3.5 mr-1" /> All Content Tools</TabsTrigger>
        </TabsList>

        {/* ─── TAB: WAR ROOM ─────────────────────────────────────────── */}
        <TabsContent value="war-room" className="space-y-6">
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
        </TabsContent>

        {/* ─── TAB: LIVE SETUP ─────────────────────────────────────────── */}
        <TabsContent value="live-feed" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" /> LIVE Command &amp; Hardware Routing Checklist
              </CardTitle>
              <CardDescription className="text-xs">Follow this checklist before starting your TikTok LIVE session or streaming on gannonwaye.com.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-semibold text-white">1. Audio Settings (OBS &amp; Virtual Cables)</h4>
                  <div className="p-3 bg-secondary/30 rounded-xl space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Logitech Mic &amp; G Hub Noise-Gate active:</span>
                      <Switch checked={micActive} onCheckedChange={setMicActive} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>OBS Virtual Mix Out (Backing tracks + Vocals):</span>
                      <Switch checked={obsConnected} onCheckedChange={setObsConnected} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TikTok LIVE Studio Audio Input routed:</span>
                      <Switch checked={tiktokConnected} onCheckedChange={setTiktokConnected} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display text-sm font-semibold text-white">2. Stream Meta Details</h4>
                  <div className="space-y-2">
                    <Label className="text-xs">Stream Topic / Run of Show Header</Label>
                    <Input
                      value={streamTopic || defaultStreamTopic}
                      onChange={e => setStreamTopic(e.target.value)}
                      className="bg-secondary/40 text-xs"
                    />
                  </div>
                  <Button onClick={addClipTimestamp} className="w-full gradient-gold-button border-0 text-xs">
                    <Volume2 className="w-4 h-4 mr-1" /> Mark Hook Timestamp
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-display text-sm font-semibold text-white">LIVE Session Hook Markers</h4>
                <div className="bg-secondary/20 border border-border/30 rounded-xl p-3 h-48 overflow-y-auto space-y-2 text-xs">
                  {manualTimestamps.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-center">
                      <p>Click "Mark Hook Timestamp" during the live stream to tag segments for editor export.</p>
                    </div>
                  ) : (
                    manualTimestamps.map((item, i) => (
                      <div key={i} className="p-2 bg-secondary/40 rounded border border-border/20 flex items-center justify-between">
                        <span>Tag {i + 1}: {item.topic}</span>
                        <span className="font-mono text-[10px] text-primary">{item.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: AI GUARDIAN ────────────────────────────────────────── */}
        <TabsContent value="guardian" className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-primary" /> AI Brand Guardian Compliance Check
              </CardTitle>
              <CardDescription className="text-xs">Validate your social captions, hooks, and album launch posts before sending them to the Metricool scheduling queue.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-white">Caption / Hook Content Text</Label>
                  <Textarea
                    value={guardianText}
                    onChange={e => setGuardianText(e.target.value)}
                    placeholder="Paste draft post copy here..."
                    rows={6}
                    className="bg-secondary/40 text-sm border-border/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-white">Call-To-Action Link</Label>
                  <Input
                    value={guardianLink}
                    onChange={e => setGuardianLink(e.target.value)}
                    placeholder="https://gannonwaye.com/..."
                    className="bg-secondary/40 text-xs border-border/40"
                  />
                </div>

                <Button onClick={runGuardianCheck} className="w-full gradient-gold-button border-0 text-xs">
                  Validate Brand Compliance
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-display text-sm font-semibold text-white">Compliance Results</h4>
                {guardianResults ? (
                  <div className={`p-4 rounded-xl border ${guardianResults.status === 'approved' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} space-y-3`}>
                    <div className="flex items-center gap-2">
                      {guardianResults.status === 'approved' ? (
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                      )}
                      <span className={`font-semibold capitalize text-sm ${guardianResults.status === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                        Content {guardianResults.status}
                      </span>
                    </div>

                    {guardianResults.issues.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1.5 text-xs text-red-300">
                        {guardianResults.issues.map((iss, i) => (
                          <li key={i}>{iss}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-green-300">No spelling mistakes, prohibited financial guarantees, or missing CTAs found. Ready to release!</p>
                    )}
                  </div>
                ) : (
                  <div className="h-48 border border-dashed border-border/30 rounded-xl flex items-center justify-center text-muted-foreground text-xs text-center p-4">
                    <p>Enter text and links on the left and click validate to run compliance checks.</p>
                  </div>
                )}

                <div className="p-3 bg-secondary/20 rounded-xl space-y-2 text-[10px] text-muted-foreground border border-border/20">
                  <p className="font-bold text-white uppercase tracking-wider">Brand Guardian Rules:</p>
                  <p>• The debut single is titled <span className="text-primary font-bold">"Thankyou"</span> (one word).</p>
                  <p>• Avoid references to "tax-deductibility" on fan support contributions.</p>
                  <p>• No claims referencing clinical therapy on the memorial AI reflective guide.</p>
                  <p>• No passive income/dropshipping guarantees.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: APPROVAL QUEUE ────────────────────────────────────── */}
        <TabsContent value="approval-queue" className="space-y-6">
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
                          onClick={() => {
                            base44.entities.SocialAsset.update(item.id, { status: 'ready' })
                              .then(() => {
                                qc.invalidateQueries(['approval-queue']);
                                toast({ title: 'Approved!' });
                              });
                          }}
                          className="h-8 text-[10px] bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            base44.entities.SocialAsset.update(item.id, { status: 'archived' })
                              .then(() => {
                                qc.invalidateQueries(['approval-queue']);
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
        </TabsContent>

        {/* ─── TAB: QUICK LINKS ────────────────────────────────────────── */}
        <TabsContent value="quick-links" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Release Promo Command', desc: 'Track days leading up to launch.', link: '/admin/release-promo-command' },
              { title: 'Social Post Factory', desc: 'Draft and format posts for X, Reels, and TikTok.', link: '/admin/social-post-factory' },
              { title: 'Social Asset Library', desc: 'Manage your videos, footage, and graphics files.', link: '/admin/social-asset-library' },
              { title: 'Metricool Command', desc: 'Sync your social schedule queue.', link: '/admin/metricool-command' },
              { title: 'Metricool Diagnostics', desc: 'Inspect token validation and auth hooks.', link: '/admin/metricool-diagnostics' },
              { title: 'Content Performance', desc: 'Monitor engagement, clicks, and conversion data.', link: '/admin/content-performance' },
            ].map(item => (
              <Card
                key={item.title}
                className="hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => navigate(item.link)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                    {item.title} <Send className="w-3.5 h-3.5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}