import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Video, BookOpen, MessageSquare, Circle, Copy, ExternalLink, Shield, Printer, CheckSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SCREEN_RECORDING_STEPS = [
  {
    section: 'PART 1 — App Overview (30 seconds)',
    steps: [
      'Open the admin dashboard at gannonwaye.com/admin (not Base44 editor preview)',
      'Hover over the sidebar — show the section headers (Command Centre, Ecommerce, Social, etc.)',
      'Click on Notifications — show the bell badge and notification list',
      'Click on Executive Feed — show the daily intelligence summary',
    ],
  },
  {
    section: 'PART 2 — Research Intelligence (45 seconds)',
    steps: [
      'Navigate to Research Grid (/admin/research-grid)',
      'Click one of the Live Intelligence Scan topic buttons — let it run',
      'While it loads, scroll down to show the knowledge vault entries',
      'Click one research card to show the full detail modal (title, summary, content, actions)',
      'Show the Save to Vault and Create Approval Item buttons',
    ],
  },
  {
    section: 'PART 3 — Agent Registry (30 seconds)',
    steps: [
      'Navigate to Agent Registry (/admin/agent-registry)',
      'Show the grid of agent cards with their status badges',
      'Click one agent card — show the full detail modal',
      'Show: purpose, readiness checklist, risk level, approval level, connected systems',
      'Show the Activate button for an inactive agent',
    ],
  },
  {
    section: 'PART 4 — Autonomous Ops (30 seconds)',
    steps: [
      'Navigate to Autonomous Ops (/admin/autonomous-ops)',
      'Show the Active Automation Loops panel — loops running with intervals',
      'Show the Pending Approvals section',
      'Click one of the trigger buttons to show real-time function triggering',
    ],
  },
  {
    section: 'PART 5 — Ecommerce Command (30 seconds)',
    steps: [
      'Navigate to Ecommerce Command (/admin/ecommerce-command)',
      'Show the revenue summary cards',
      'Navigate to Orders (/admin/orders) — show the order list',
      'Click one order to show the detail view',
    ],
  },
  {
    section: 'PART 6 — Agent Intelligence (30 seconds)',
    steps: [
      'Navigate to Agent Intelligence (/admin/agent-intelligence)',
      'Show the IQ scorecard for each agent',
      'Click a Learning Record to show the full detail modal (what worked, what failed, improvement)',
      'Click an Autonomous Activity item to show the activity detail',
    ],
  },
  {
    section: 'PART 7 — Knowledge Vault (20 seconds)',
    steps: [
      'Navigate to Knowledge Vault (/admin/knowledge-vault)',
      'Show the search + category filter',
      'Click a vault record to show full detail view',
    ],
  },
  {
    section: 'PART 8 — TikTok Creator Workflow (60–90 seconds) ⭐ REQUIRED FOR TIKTOK REVIEW',
    steps: [
      'Step 1: Confirm you are recording gannonwaye.com — NOT the Base44 editor preview URL.',
      'Step 2: Navigate to /admin/tiktok-review or /admin/api-setup to show the TikTok integration section.',
      'Step 3: Show TikTok connection status — connected creator account name, authorised status, TikTok display name if available.',
      'Step 4 (Login Kit): Click Connect TikTok or Reconnect TikTok button. If possible, show the TikTok OAuth authorisation screen. Show the return to https://gannonwaye.com/tiktok-callback. Show connected status inside admin.',
      'Step 5 (Content Posting API / video.upload): Open TikTok content draft area (/admin/social-content). Select or create a video draft. Show video/caption/copy prepared by the system. Show the Approval Queue step. Approve the draft. Click Upload Draft to TikTok. Show successful upload status — "Draft uploaded" or "Awaiting creator review".',
      'Step 6: Show that nothing auto-posts. Show manual approval required. Show creator approval required. Show the Approval Queue. Narrate: "AI prepares drafts but Gannon controls publishing."',
      'Step 7 (Webhook — if kept): Show webhook settings. Show the webhook callback URL. Show webhook test result/status/log. Show a received TikTok event if available.',
      'Step 8: End by showing Business Attention Centre. Show TikTok notification, approval status, uploaded draft status, and source chain.',
    ],
  },
];

const VOICEOVER_SCRIPT = [
  { cue: 'Dashboard', line: "This is the GanozMix AI Operating System. Every section of my business is connected, monitored, and improving automatically." },
  { cue: 'Research Grid scan', line: "Right now it's scanning live market intelligence. This runs every 4 hours automatically, finding opportunities I'd never have time to find manually." },
  { cue: 'Research card click', line: "Every single research finding is clickable, shows the full source, and has actions — I can save it, create an approval task, or archive it in one click." },
  { cue: 'Agent Registry', line: "These are my AI agents. Each one has a specific job. I can see exactly what they do, what risk level they run at, and whether they need my approval before acting." },
  { cue: 'Autonomous Ops loops', line: "7 automation loops running 24/7. Research, trends, executive briefs, site health checks — all running while I focus on music." },
  { cue: 'Learning Record click', line: "The system learns from every output. I can see exactly what worked, what failed, and what it's doing differently next time." },
  { cue: 'Knowledge Vault', line: "Everything the system discovers is stored here. 200+ entries of market intelligence, brand context, and learning records, all searchable and linked." },
  { cue: 'TikTok — connection', line: "The platform connects to my authorised TikTok creator account using Login Kit." },
  { cue: 'TikTok — draft upload', line: "AI helps prepare content ideas, captions, drafts, and workflow recommendations, but nothing is automatically published without my approval. When a TikTok draft is ready, it goes through the Approval Queue first. After I approve it, the system uploads the draft to my authorised TikTok account for final creator review." },
  { cue: 'TikTok — closing', line: "The platform is designed for creator workflow management, not spam automation, not bulk posting, and not third-party account control." },
  { cue: 'End', line: "This is what I built for my music career. And now I'm making it available for other artists and creators who want to run their business like a machine." },
];

const FULL_VOICEOVER = `"This is the Gannon Waye Music AI operating system. The platform connects the official artist website, fan engagement, content workflow, store activity, approvals, and business notifications in one place.

The system helps prepare research and content intelligence for my music business. Research findings are saved, searchable, and connected to approval workflows so they can be reviewed before action is taken.

These are the AI agents that support the workflow. Each agent has a defined role, visible status, risk level, and approval rules. The system is designed to keep actions explainable and controlled.

Automation supports research, planning, notifications, and draft preparation. Important business or publishing actions remain approval-gated so the creator stays in control.

The platform also connects store activity and order management, allowing the business to monitor sales, fulfilment, and customer activity in the same operating system.

The system records agent learning and activity so outputs can be reviewed, audited, and improved over time.

Knowledge and research are stored in a searchable vault so the system can keep context and the creator can trace where recommendations came from.

This is the TikTok creator workflow inside Gannon Waye Music.

The platform connects to my authorised TikTok creator account using Login Kit.

AI helps prepare content ideas, captions, drafts, and workflow recommendations, but nothing is automatically published without my approval.

When a TikTok draft is ready, it goes through the Approval Queue first.

After I approve it, the system uploads the draft to my authorised TikTok account for final creator review.

The platform is designed for creator workflow management, not spam automation, not bulk posting, and not third-party account control.

This platform supports my official artist website, content preparation, TikTok creator workflow, fan engagement, store activity, and approval-based business operations from one connected system."`;

const CODEX_INSTRUCTIONS = `CODEX TASK — PRODUCE TIKTOK DEVELOPER REVIEW SCREEN RECORDING WITH GANNON LIVE

Goal:
Create the TikTok Developer review screen recording for Gannon Waye Music.

Gannon is live and available to watch the process. If login, browser permission, TikTok OAuth, screen-share permission, or any sensitive action is required, pause and ask Gannon in the Codex chat.

Important:
The final video must only show the browser/app being demonstrated.
Do NOT show the Codex chat, ChatGPT prompts, Base44 instructions, task request text, private notes, secrets, or developer instructions in the recording.

Record only the browser window or browser tab showing: https://gannonwaye.com

Preferred capture: browser tab/window only
Not acceptable: entire screen if Codex chat or instructions are visible

Before recording:
1. Open only the browser window/tab needed.
2. Go to: https://gannonwaye.com/admin
3. Confirm the URL is gannonwaye.com, not Base44 preview.
4. Confirm no Codex chat or prompt text is visible in the captured area.
5. Confirm no TikTok client secret is visible.
6. Ask Gannon in Codex chat: "Ready to start recording? Please confirm."
Start recording only after Gannon confirms.

Output required:
- tiktok_developer_demo.mp4
- tiktok_voiceover_script.txt
- tiktok_recording_notes.md

If MP4 cannot be created directly, create tiktok_developer_demo.webm and provide conversion instructions.

Recording notes must include:
- Recording date
- Domain recorded: https://gannonwaye.com
- Products demonstrated: Login Kit, Content Posting API
- Scopes demonstrated: user.info.basic, video.upload
- Products/scopes not demonstrated
- Client secret visible: Yes/No
- Codex chat/prompt visible: Yes/No
- Manual steps Gannon completed
- Issues encountered
- Ready for TikTok upload: Yes/No`;

const BEFORE_CHECKLIST = [
  'Official domain visible: https://gannonwaye.com',
  'NOT recording Base44 editor preview',
  'TikTok client secret hidden from view',
  'API keys hidden from view',
  'No customer private data visible',
  'Recording browser window only (not full screen with Codex chat)',
  'Voiceover script ready / printed',
  'Part 8 TikTok workflow included in plan',
  'Approval Queue shown in recording',
  'Manual creator approval shown',
  'Content Posting API draft upload shown',
  'Login Kit shown',
];

const AFTER_CHECKLIST = [
  'Watch full video before uploading',
  'Confirm no secrets visible',
  'Confirm no Codex chat or prompts visible',
  'Confirm no passwords visible',
  'Confirm TikTok workflow shown in Part 8',
  'Confirm selected scopes match what is shown',
  'Remove unused TikTok scopes/products if not shown',
  'Video under 50MB if possible',
  'Export as MP4 or MOV for TikTok',
  'Upload to TikTok Developer Portal',
];

const TIKTOK_VOICEOVER = `"This is the TikTok creator workflow inside Gannon Waye Music.

The platform connects to my authorised TikTok creator account using Login Kit.

AI helps prepare content ideas, captions, drafts, and workflow recommendations, but nothing is automatically published without my approval.

When a TikTok draft is ready, it goes through the Approval Queue first.

After I approve it, the system uploads the draft to my authorised TikTok account for final creator review.

The platform is designed for creator workflow management, not spam automation, not bulk posting, and not third-party account control."`;

export default function TikTokScreenGuide() {
  const { toast } = useToast();
  const [beforeChecked, setBeforeChecked] = useState({});
  const [afterChecked, setAfterChecked] = useState({});

  const copy = (text, label) => { navigator.clipboard.writeText(text); toast({ title: `${label} copied` }); };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok Screen Recording Guide</h1>
          <p className="text-muted-foreground text-sm mt-1">Dot-point guide for screen recording your AI OS + TikTok integration demo.</p>
        </div>
        <Button variant="outline" className="gap-2 print:hidden" onClick={handlePrint}>
          <Printer className="w-4 h-4" /> Print Recording Guide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Duration', value: '~5 mins', color: 'text-primary' },
          { label: 'Sections to Record', value: SCREEN_RECORDING_STEPS.length, color: 'text-cyan-400' },
          { label: 'Voiceover Cues', value: VOICEOVER_SCRIPT.length, color: 'text-purple-400' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 text-sm">
        <p className="font-semibold text-amber-300 mb-1">📋 Instructions</p>
        <p className="text-foreground/80">Record at <strong>gannonwaye.com</strong> — not the Base44 editor preview. Record WITHOUT audio first. After recording, import into CapCut and add voiceover using the script below. Part 8 is required for TikTok Developer review.</p>
      </div>

      {/* Security reminder */}
      <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-3 flex items-start gap-3">
        <Shield className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <p className="text-red-300/80 text-xs"><strong>Security:</strong> Do NOT show your TikTok client secret in the recording. Only show the Client Key (awwbyibvman8svtq). If secret was exposed, rotate it at developers.tiktok.com.</p>
      </div>

      <div className="space-y-4">
        {SCREEN_RECORDING_STEPS.map((section, i) => (
          <Card key={section.section} className={i === 7 ? 'border-primary/50 bg-primary/5' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge className={`text-xs ${i === 7 ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>{i + 1}</Badge>
                {section.section}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {section.steps.map((step, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Circle className="w-2 h-2 shrink-0 mt-1.5 text-primary fill-primary" />
                  {step}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TikTok-specific voiceover */}
      <Card className="border-primary/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />TikTok Demo Voiceover (Part 8 — Copy This)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-body bg-secondary/50 rounded p-3 leading-relaxed">{TIKTOK_VOICEOVER}</pre>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => { navigator.clipboard.writeText(TIKTOK_VOICEOVER); toast({ title: 'Voiceover copied' }); }}>
            <Copy className="w-3 h-3" /> Copy Voiceover Script
          </Button>
        </CardContent>
      </Card>

      {/* Full voiceover cues */}
      <Card className="border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" />Full Voiceover Cues (All Parts)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {VOICEOVER_SCRIPT.map((s, i) => (
            <div key={i} className="border border-border rounded-lg p-3">
              <Badge variant="outline" className="text-xs mb-2">{s.cue}</Badge>
              <p className="text-sm text-foreground/80 leading-relaxed italic">"{s.line}"</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Study pals */}
      <Card className="border-cyan-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />Your Study Pals — Literature Review Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground/80">Your study pals are accessible via the <strong>Orchestrator Chat</strong>.</p>
          <div className="space-y-2">
            <div className="border border-border rounded-lg p-3">
              <p className="text-sm font-medium">📚 Literature Researcher</p>
              <p className="text-xs text-muted-foreground mt-1">Finds, summarises and analyses academic papers, journals, and research sources.</p>
              <p className="text-xs text-primary mt-1">→ /admin/orchestrator-chat — select "Literature Researcher" agent</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="text-sm font-medium">✍️ Academic Writing Coach</p>
              <p className="text-xs text-muted-foreground mt-1">Helps structure essays, literature reviews, referencing, and academic writing style.</p>
              <p className="text-xs text-primary mt-1">→ /admin/orchestrator-chat — select "Academic Writing Coach" agent</p>
            </div>
          </div>
          <Link to="/admin/orchestrator-chat">
            <Button className="gradient-gold-button border-0 gap-2 mt-2">
              <MessageSquare className="w-4 h-4" /> Go to Orchestrator Chat → Study Pals
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Full voiceover script */}
      <Card className="border-primary/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" /> Full Voiceover Script (All Parts)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-body bg-secondary/50 rounded p-3 leading-relaxed max-h-64 overflow-y-auto">{FULL_VOICEOVER}</pre>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => copy(FULL_VOICEOVER, 'Full voiceover script')}>
            <Copy className="w-3 h-3" /> Copy Full Voiceover
          </Button>
        </CardContent>
      </Card>

      {/* Before recording checklist */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckSquare className="w-4 h-4 text-primary" />Before Recording Checklist</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {BEFORE_CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => setBeforeChecked(p => ({ ...p, [i]: !p[i] }))}>
              <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${beforeChecked[i] ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                {beforeChecked[i] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <p className={`text-sm ${beforeChecked[i] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* After recording checklist */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckSquare className="w-4 h-4 text-green-400" />After Recording Checklist</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {AFTER_CHECKLIST.map((item, i) => (
            <div key={i} className="flex items-start gap-2 cursor-pointer" onClick={() => setAfterChecked(p => ({ ...p, [i]: !p[i] }))}>
              <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${afterChecked[i] ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                {afterChecked[i] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <p className={`text-sm ${afterChecked[i] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Codex recording instructions */}
      <Card className="border-cyan-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" /> Send This To Codex To Record The TikTok Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">Copy this entire block and paste it as a message to Codex/ChatGPT when you are ready to record with Gannon live.</p>
          <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono bg-secondary/50 rounded p-3 leading-relaxed max-h-64 overflow-y-auto">{CODEX_INSTRUCTIONS}</pre>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => copy(CODEX_INSTRUCTIONS, 'Codex recording instructions')}>
            <Copy className="w-3 h-3" /> Copy Codex Instructions
          </Button>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Related Pages</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link to="/admin/tiktok-review"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />TikTok Review</Button></Link>
          <Link to="/admin/tiktok-recording-studio"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Recording Studio</Button></Link>
          <Link to="/admin/social-content"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Social Content</Button></Link>
          <Link to="/admin/approval-queue"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Approval Queue</Button></Link>
          <Link to="/admin/notifications"><Button variant="outline" size="sm" className="gap-1"><ExternalLink className="w-3 h-3" />Notifications</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}