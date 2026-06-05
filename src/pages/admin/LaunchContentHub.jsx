import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Flame, Megaphone, Zap, Radio, Clock, ShieldAlert, ShieldCheck, 
  AlertTriangle, RefreshCw, Send, Volume2, Video, Key, Calendar, 
  HelpCircle, Link as LinkIcon, AlertCircle, Play, Pause, Save, CheckCircle
} from 'lucide-react';

export default function LaunchContentHub() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('war-room');
  
  // War room panic states
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pauseStore, setPauseStore] = useState(false);
  const [pauseSocials, setPauseSocials] = useState(false);
  const [pauseEmails, setPauseEmails] = useState(false);

  // Live feed setup wizard states
  const [micActive, setMicActive] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [streamTopic, setStreamTopic] = useState('THANKYOU Release Chat & Story Q&A');
  const [manualTimestamps, setManualTimestamps] = useState([]);
  
  // AI Brand Guardian inputs
  const [guardianText, setGuardianText] = useState('');
  const [guardianLink, setGuardianLink] = useState('https://gannonwaye.com/store');
  const [guardianResults, setGuardianResults] = useState(null);

  // Fetch approval queue items
  const { data: queue = [], isLoading: isLoadingQueue } = useQuery({
    queryKey: ['approval-queue'],
    queryFn: () => base44.entities.SocialAsset.filter({ status: 'raw' }),
    initialData: [],
  });

  // Calculate release countdown to June 5, 2026
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const target = new Date('2026-06-05T00:00:00+10:00');
    const update = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setTimeLeft('RELEASE IS LIVE!');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const addClipTimestamp = () => {
    const timestamp = new Date().toLocaleTimeString();
    setManualTimestamps(prev => [...prev, { time: timestamp, topic: streamTopic }]);
    toast({ title: 'Clip Marker Set!', description: `Timestamped at ${timestamp}` });
  };

  // Run AI Brand Guardian check
  const runGuardianCheck = () => {
    const issues = [];
    const text = guardianText;
    
    // Spelling checks
    if (text.toLowerCase().includes('thank you') && !text.includes('THANKYOU')) {
      issues.push('Spelling violation: Brand guide mandates exact capitalised spelling "THANKYOU" for CTA/Titles.');
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
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Launch & Content Hub</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Coordinate content releases, launch checklists, live-stream feeds, and brand governance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5 p-1 h-auto">
          <TabsTrigger value="war-room" className="text-xs py-2"><Flame className="w-3.5 h-3.5 mr-1 text-red-500" /> War Room</TabsTrigger>
          <TabsTrigger value="live-feed" className="text-xs py-2"><Radio className="w-3.5 h-3.5 mr-1 text-primary" /> Live Setup</TabsTrigger>
          <TabsTrigger value="guardian" className="text-xs py-2"><ShieldAlert className="w-3.5 h-3.5 mr-1 text-yellow-400" /> AI Guardian</TabsTrigger>
          <TabsTrigger value="approval-queue" className="text-xs py-2"><Clock className="w-3.5 h-3.5 mr-1 text-blue-400" /> Approval Queue ({queue.length})</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><LinkIcon className="w-3.5 h-3.5 mr-1" /> All Content Tools</TabsTrigger>
        </TabsList>

        {/* ─── TAB: WAR ROOM ─────────────────────────────────────────── */}
        <TabsContent value="war-room" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Countdown & Quick Dashboard */}
            <Card className="lg:col-span-2 border-red-500/30 bg-gradient-to-br from-red-950/20 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">WAR ROOM MODE</Badge>
                  <span className="font-body text-xs text-muted-foreground">Campaign: THANKYOU Launch</span>
                </div>
                <CardTitle className="font-display text-4xl font-bold tracking-tight text-white mt-4">{timeLeft}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Countdown to Official Album & Single Launch (June 5, 2026)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Today's Approved</p>
                    <p className="text-xl font-bold text-green-400 mt-1">4 Posts</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pending Action</p>
                    <p className="text-xl font-bold text-yellow-400 mt-1">{queue.length} Assets</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40 col-span-2 sm:col-span-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Stripe Gateway</p>
                    <p className="text-xl font-bold text-green-400 mt-1 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Live</p>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-4 space-y-2">
                  <h4 className="font-display text-sm font-semibold text-white">Daily approved release schedule:</h4>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-secondary/20 rounded-lg flex items-center justify-between text-xs">
                      <span>09:00 AM - "Grief & Rebuilding" Quote Reel (Instagram)</span>
                      <Badge className="bg-green-500/10 text-green-400">Scheduled</Badge>
                    </div>
                    <div className="p-2.5 bg-secondary/20 rounded-lg flex items-center justify-between text-xs">
                      <span>01:00 PM - Album Art Showcase (TikTok & Threads)</span>
                      <Badge className="bg-green-500/10 text-green-400">Scheduled</Badge>
                    </div>
                    <div className="p-2.5 bg-secondary/20 rounded-lg flex items-center justify-between text-xs">
                      <span>07:00 PM - Portuguese Memorial Song Hook (TikTok LIVE)</span>
                      <Badge className="bg-yellow-500/10 text-yellow-400">Awaiting Live</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Kill Switches */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" /> Emergency Kill Switches
                </CardTitle>
                <CardDescription className="text-xs">Immediately freeze automations or public routes in case of billing anomalies, layout breakage, or server issues.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Staging / Maintenance Mode</Label>
                    <p className="text-[10px] text-muted-foreground">Redirects all public page views to offline maintenance screen.</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Pause Store Checkout</Label>
                    <p className="text-[10px] text-muted-foreground">Disables Stripe checkouts and cart items purchases.</p>
                  </div>
                  <Switch checked={pauseStore} onCheckedChange={setPauseStore} />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/20">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Pause Social Scheduling</Label>
                    <p className="text-[10px] text-muted-foreground">Prevents Metricool or queue runner from posting content.</p>
                  </div>
                  <Switch checked={pauseSocials} onCheckedChange={setPauseSocials} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-white">Pause Automated Emails</Label>
                    <p className="text-[10px] text-muted-foreground">Prevents order receipts, welcome newsletters, or alerts.</p>
                  </div>
                  <Switch checked={pauseEmails} onCheckedChange={setPauseEmails} />
                </div>

                {(maintenanceMode || pauseStore || pauseSocials || pauseEmails) && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
                    <p className="font-body text-xs text-destructive-foreground font-semibold flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Systems are partially restricted.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: LIVE SETUP ─────────────────────────────────────────── */}
        <TabsContent value="live-feed" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-primary" /> LIVE Command & Hardware Routing Checklist
              </CardTitle>
              <CardDescription className="text-xs">Follow this checklist before starting your TikTok LIVE session or streaming on gannonwaye.com.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-semibold text-white">1. Audio Settings (OBS & Virtual Cables)</h4>
                  <div className="p-3 bg-secondary/30 rounded-xl space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span>Logitech Mic & G Hub Noise-Gate active:</span>
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
                    <Input value={streamTopic} onChange={e => setStreamTopic(e.target.value)} className="bg-secondary/40 text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addClipTimestamp} className="flex-1 gradient-gold-button border-0 text-xs">
                      <Volume2 className="w-4 h-4 mr-1" /> Mark Hook Timestamp
                    </Button>
                    <Button variant="outline" className="text-xs border-border/40">
                      <Video className="w-4 h-4 mr-1 text-primary" /> Start Test Mode
                    </Button>
                  </div>
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
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-400" /> AI Brand Guardian Compliance Check
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
                  <p>• Album titles/promos must use exact uppercase spelling: <span className="text-primary font-bold">"THANKYOU"</span></p>
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
              { title: 'Release Sprint Planner', desc: 'Track days leading up to launch.', link: '/admin/release-sprint' },
              { title: 'Social Post Factory', desc: 'Draft and format posts for X, Reels, and TikTok.', link: '/admin/social-post-factory' },
              { title: 'Social Asset Library', desc: 'Manage your videos, footage, and graphics files.', link: '/admin/social-asset-library' },
              { title: 'Metricool Command', desc: 'Sync your social schedule queue.', link: '/admin/metricool-command' },
              { title: 'Metricool Diagnostics', desc: 'Inspect token validation and auth hooks.', link: '/admin/metricool-diagnostics' },
              { title: 'Content Performance', desc: 'Monitor engagement, clicks, and conversion data.', link: '/admin/content-performance' }
            ].map(item => (
              <Card key={item.title} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = item.link}>
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
