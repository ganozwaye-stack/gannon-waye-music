import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Video, BookOpen, MessageSquare, Circle, ArrowRight } from 'lucide-react';

const SCREEN_RECORDING_STEPS = [
  {
    section: 'PART 1 — App Overview (30 seconds)',
    steps: [
      'Open the admin dashboard at /admin',
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
      'Show the Active Automation Loops panel — 7 running loops with intervals',
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
];

const VOICEOVER_SCRIPT = [
  { cue: 'Dashboard', line: "This is the GanozMix AI Operating System. Every section of my business is connected, monitored, and improving automatically." },
  { cue: 'Research Grid scan', line: "Right now it's scanning live market intelligence. This runs every 4 hours automatically, finding opportunities I'd never have time to find manually." },
  { cue: 'Research card click', line: "Every single research finding is clickable, shows the full source, and has actions — I can save it, create an approval task, or archive it in one click." },
  { cue: 'Agent Registry', line: "These are my AI agents. Each one has a specific job. I can see exactly what they do, what risk level they run at, and whether they need my approval before acting." },
  { cue: 'Autonomous Ops loops', line: "7 automation loops running 24/7. Research, trends, executive briefs, site health checks — all running while I focus on music." },
  { cue: 'Learning Record click', line: "The system learns from every output. I can see exactly what worked, what failed, and what it's doing differently next time." },
  { cue: 'Knowledge Vault', line: "Everything the system discovers is stored here. 200+ entries of market intelligence, brand context, and learning records, all searchable and linked." },
  { cue: 'End', line: "This is what I built for my music career. And now I'm making it available for other artists and creators who want to run their business like a machine." },
];

export default function TikTokScreenGuide() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">TikTok Screen Recording Guide</h1>
        <p className="text-muted-foreground text-sm mt-1">Dot-point guide for screen recording your AI OS demo. Voice over after recording.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: 'Total Duration', value: '~3.5 mins', color: 'text-primary' },
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
        <p className="text-foreground/80">Record the screen WITHOUT audio. Do each section in one clean take. After recording, import into CapCut and record your voiceover using the script below as a guide. Keep each section snappy.</p>
      </div>

      <div className="space-y-4">
        {SCREEN_RECORDING_STEPS.map((section, i) => (
          <Card key={section.section}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary text-xs">{i + 1}</Badge>
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

      <Card className="border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-400" />Voiceover Script (After Recording)
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

      <Card className="border-cyan-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />Your Study Pals — Literature Review Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground/80">Your study pals (Literature Researcher and Academic Writing Coach agents) are accessible via the <strong>Orchestrator Chat</strong>. Here's how to find them:</p>
          <div className="space-y-2">
            <div className="border border-border rounded-lg p-3">
              <p className="text-sm font-medium">📚 Literature Researcher</p>
              <p className="text-xs text-muted-foreground mt-1">Finds, summarises and analyses academic papers, journals, and research sources. Can search PubMed, Google Scholar topics, and synthesise findings.</p>
              <p className="text-xs text-primary mt-1">→ Start a conversation at /admin/orchestrator-chat — select "Literature Researcher" agent</p>
            </div>
            <div className="border border-border rounded-lg p-3">
              <p className="text-sm font-medium">✍️ Academic Writing Coach</p>
              <p className="text-xs text-muted-foreground mt-1">Helps structure essays, literature reviews, referencing, argument building and academic writing style. Use for your actual writing tasks.</p>
              <p className="text-xs text-primary mt-1">→ Start a conversation at /admin/orchestrator-chat — select "Academic Writing Coach" agent</p>
            </div>
          </div>
          <Link to="/admin/orchestrator-chat">
            <Button className="gradient-gold-button border-0 gap-2 mt-2">
              <MessageSquare className="w-4 h-4" /> Go to Orchestrator Chat → Study Pals
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}