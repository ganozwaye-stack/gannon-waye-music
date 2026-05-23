import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Video, Square, Pause, Play, Download, Copy, CheckCircle2,
  XCircle, AlertTriangle, ChevronLeft, ChevronRight, Shield, ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GUIDE_STEPS = [
  {
    part: 'Part 1',
    title: 'App Overview',
    duration: '30 sec',
    instruction: 'Show gannonwaye.com admin dashboard. Show sidebar sections, Notifications, Executive Feed.',
    navPath: '/admin',
    navLabel: 'Open Dashboard',
  },
  {
    part: 'Part 2',
    title: 'Research Intelligence',
    duration: '45 sec',
    instruction: 'Go to Research Grid. Click a Live Intelligence Scan button. Click one result card to show full detail.',
    navPath: '/admin/research-grid',
    navLabel: 'Open Research Grid',
  },
  {
    part: 'Part 3',
    title: 'Agent Registry',
    duration: '30 sec',
    instruction: 'Show agent cards. Click one agent to show detail modal — purpose, risk level, readiness checklist.',
    navPath: '/admin/agent-registry',
    navLabel: 'Open Agent Registry',
  },
  {
    part: 'Part 4',
    title: 'Autonomous Ops',
    duration: '30 sec',
    instruction: 'Show automation loops, pending approvals. Click a trigger button to show real-time triggering.',
    navPath: '/admin/autonomous-ops',
    navLabel: 'Open Autonomous Ops',
  },
  {
    part: 'Part 5',
    title: 'Ecommerce Command',
    duration: '30 sec',
    instruction: 'Show revenue summary cards and orders list. Click one order for detail view.',
    navPath: '/admin/ecommerce-command',
    navLabel: 'Open Ecommerce',
  },
  {
    part: 'Part 6',
    title: 'Agent Intelligence',
    duration: '30 sec',
    instruction: 'Show IQ scorecards. Click a Learning Record — show what worked, what failed, improvement.',
    navPath: '/admin/agent-intelligence',
    navLabel: 'Open Agent Intelligence',
  },
  {
    part: 'Part 7',
    title: 'Knowledge Vault',
    duration: '20 sec',
    instruction: 'Show search and category filter. Click one vault record to show full detail.',
    navPath: '/admin/knowledge-vault',
    navLabel: 'Open Knowledge Vault',
  },
  {
    part: 'Part 8 ⭐',
    title: 'TikTok Creator Workflow',
    duration: '60–90 sec',
    instruction: 'Show TikTok connection status and connected creator account. Show Login Kit flow — click Connect TikTok, show OAuth screen, show return to /tiktok-callback. Open Social Content — show draft with caption. Show Approval Queue. Approve the draft. Click Upload Draft to TikTok. Show "Draft uploaded" / "Awaiting creator review". Show that nothing auto-posts — narrate creator approval required. End by showing Business Attention Centre with TikTok notification.',
    navPath: '/admin/tiktok-review',
    navLabel: 'Open TikTok Review',
    important: true,
  },
];

const READINESS = [
  { label: 'Recording at gannonwaye.com (not Base44 preview)', ok: true },
  { label: 'Privacy Policy live', ok: true, url: 'https://gannonwaye.com/privacy-policy' },
  { label: 'Terms of Service live', ok: true, url: 'https://gannonwaye.com/terms-of-service' },
  { label: 'Redirect URI configured in TikTok portal', ok: false, action: 'Add https://gannonwaye.com/tiktok-callback' },
  { label: 'TikTok callback route exists', ok: true },
  { label: 'Website verification file deployed', ok: true },
  { label: 'DNS TXT record added', ok: false, action: 'Add to domain registrar DNS' },
  { label: 'Login Kit product selected', ok: true },
  { label: 'Content Posting API product selected', ok: true },
  { label: 'user.info.basic scope selected', ok: true },
  { label: 'video.upload scope selected', ok: true },
  { label: 'Share Kit REMOVED (not implemented)', ok: false, action: 'Remove from TikTok portal before submission' },
  { label: 'user.info.stats REMOVED (not implemented)', ok: false, action: 'Remove scope before submission' },
  { label: 'video.list REMOVED (not implemented)', ok: false, action: 'Remove scope before submission' },
  { label: 'video.publish REMOVED (not implemented)', ok: false, action: 'Remove scope before submission' },
  { label: 'Client secret NOT visible on screen', ok: false, action: 'Confirm before recording' },
];

const VOICEOVER = `"This is the TikTok creator workflow inside Gannon Waye Music.

The platform connects to my authorised TikTok creator account using Login Kit.

AI helps prepare content ideas, captions, drafts, and workflow recommendations, but nothing is automatically published without my approval.

When a TikTok draft is ready, it goes through the Approval Queue first.

After I approve it, the system uploads the draft to my authorised TikTok account for final creator review.

The platform is designed for creator workflow management, not spam automation, not bulk posting, and not third-party account control."`;

export default function TikTokRecordingStudio() {
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [step, setStep] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [unsupported, setUnsupported] = useState(false);
  const [checkedReady, setCheckedReady] = useState({});

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setUnsupported(true);
    }
    return () => clearInterval(timerRef.current);
  }, []);

  const startRecording = async () => {
    chunksRef.current = [];
    setRecordedBlob(null);
    setRecordedUrl(null);
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('video/mp4') ? 'video/mp4' : 'video/webm' });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const mime = mr.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mime });
        setRecordedBlob({ blob, mime });
        setRecordedUrl(URL.createObjectURL(blob));
        setRecording(false);
        setPaused(false);
        clearInterval(timerRef.current);
      };
      mr.start(1000);
      mediaRef.current = mr;
      setRecording(true);
      setPaused(false);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      toast({ title: 'Recording started' });
    } catch (err) {
      if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
        toast({ title: 'Permission denied or unsupported', variant: 'destructive' });
      }
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop();
      clearInterval(timerRef.current);
    }
  };

  const togglePause = () => {
    if (!mediaRef.current) return;
    if (paused) {
      mediaRef.current.resume();
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      setPaused(false);
    } else {
      mediaRef.current.pause();
      clearInterval(timerRef.current);
      setPaused(true);
    }
  };

  const downloadRecording = () => {
    if (!recordedUrl || !recordedBlob) return;
    const ext = recordedBlob.mime.includes('mp4') ? 'mp4' : 'webm';
    const a = document.createElement('a');
    a.href = recordedUrl;
    a.download = `tiktok-demo-${Date.now()}.${ext}`;
    a.click();
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const readyCount = READINESS.filter((r, i) => r.ok || checkedReady[i]).length;
  const currentStep = GUIDE_STEPS[step];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok Recording Studio</h1>
        <p className="text-muted-foreground text-sm mt-1">Guided screen recording helper for TikTok Developer review demo video</p>
      </div>

      {/* Unsupported */}
      {unsupported && (
        <div className="border border-orange-500/40 bg-orange-500/8 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-orange-300 font-semibold">
            <AlertTriangle className="w-4 h-4" /> Browser screen recording not supported here
          </div>
          <p className="text-sm text-foreground/80">Use one of these instead and follow the guide below:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {['QuickTime (Mac)', 'OBS Studio', 'Loom (Chrome ext)', 'Windows built-in (Win+G)'].map(t => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-3 flex items-start gap-3">
        <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="text-red-300/80 text-xs"><strong>Security reminder:</strong> Do NOT show your TikTok client secret on screen. If it appears anywhere, stop recording and rotate the secret at developers.tiktok.com before resubmitting.</p>
      </div>

      {/* Readiness */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Pre-Recording Readiness</span>
            <Badge className={readyCount >= READINESS.length * 0.8 ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
              {readyCount}/{READINESS.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {READINESS.map((r, i) => (
            <div key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => setCheckedReady(p => ({ ...p, [i]: !p[i] }))}>
              {(r.ok || checkedReady[i])
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-xs ${(r.ok || checkedReady[i]) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{r.label}</p>
                {r.action && !r.ok && !checkedReady[i] && <p className="text-xs text-orange-300">{r.action}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recording Controls */}
      {!unsupported && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2"><CardTitle>Recording Controls</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {!recording ? (
                <Button className="gradient-gold-button border-0 gap-2" onClick={startRecording}>
                  <Video className="w-4 h-4" /> Start Recording
                </Button>
              ) : (
                <>
                  <Button variant="destructive" className="gap-2" onClick={stopRecording}>
                    <Square className="w-4 h-4" /> Stop Recording
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={togglePause}>
                    {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {paused ? 'Resume' : 'Pause'}
                  </Button>
                </>
              )}
              {recording && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-lg text-red-400">{fmtTime(elapsed)}</span>
                  {paused && <Badge variant="outline" className="text-yellow-300">Paused</Badge>}
                </div>
              )}
            </div>
            {elapsed > 240 && recording && (
              <p className="text-xs text-yellow-300">⚠ Recording is over 4 minutes. TikTok demo videos should be 2–5 minutes.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step guide */}
      <Card className={currentStep.important ? 'border-primary/50' : ''}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Badge className={currentStep.important ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}>{currentStep.part}</Badge>
              {currentStep.title}
              <Badge variant="outline" className="text-xs">{currentStep.duration}</Badge>
            </CardTitle>
            <span className="text-xs text-muted-foreground">{step + 1} / {GUIDE_STEPS.length}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground/80 leading-relaxed">{currentStep.instruction}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <a href={currentStep.navPath} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <ExternalLink className="w-3 h-3" /> {currentStep.navLabel}
              </Button>
            </a>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
              <ChevronLeft className="w-3 h-3" /> Prev
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setStep(s => Math.min(GUIDE_STEPS.length - 1, s + 1))} disabled={step === GUIDE_STEPS.length - 1}>
              Next <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="flex gap-1.5 flex-wrap">
        {GUIDE_STEPS.map((g, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`px-3 py-1 rounded-full text-xs transition-all border ${i === step ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
            {g.part}
          </button>
        ))}
      </div>

      {/* Voiceover */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">TikTok Voiceover Script (Part 8)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-body bg-secondary/50 rounded p-3 leading-relaxed">{VOICEOVER}</pre>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => { navigator.clipboard.writeText(VOICEOVER); toast({ title: 'Voiceover copied' }); }}>
            <Copy className="w-3 h-3" /> Copy Script
          </Button>
        </CardContent>
      </Card>

      {/* Recording Output */}
      {recordedUrl && recordedBlob && (
        <Card className="border-green-500/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-green-300">✓ Recording Complete</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <video src={recordedUrl} controls className="w-full rounded-lg max-h-64 bg-black" />
            <div className="flex items-center gap-3 flex-wrap">
              <Button className="gradient-gold-button border-0 gap-2" onClick={downloadRecording}>
                <Download className="w-4 h-4" /> Download Recording
              </Button>
              <div>
                <p className="text-xs text-muted-foreground">Duration: {fmtTime(elapsed)}</p>
                <p className="text-xs text-muted-foreground">Format: {recordedBlob.mime}</p>
              </div>
            </div>
            {recordedBlob.mime.includes('webm') && (
              <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-3 text-xs text-yellow-300">
                <p className="font-semibold mb-1">⚠ Format Note</p>
                <p>Your browser saved this as WEBM. Convert to MP4 before uploading to TikTok if required.</p>
                <p className="mt-1 text-muted-foreground">Use: CapCut, HandBrake, CloudConvert, or QuickTime (File → Export → MP4)</p>
              </div>
            )}
            <div className="border border-border rounded-lg p-3 text-xs space-y-1">
              <p className="font-semibold">Next Steps</p>
              <p className="text-muted-foreground">1. Import into CapCut and add voiceover using the script above</p>
              <p className="text-muted-foreground">2. Export as MP4, max 50MB</p>
              <p className="text-muted-foreground">3. Upload to TikTok Developer Portal → App Review → Demo Video</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Related links */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Related Pages</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link to="/admin/tiktok-review"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />TikTok Review</Button></Link>
          <Link to="/admin/tiktok-screen-guide"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Screen Guide</Button></Link>
          <Link to="/admin/approval-queue"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Approval Queue</Button></Link>
          <Link to="/admin/notifications"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Notifications</Button></Link>
          <Link to="/admin/social-content"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Social Content</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}