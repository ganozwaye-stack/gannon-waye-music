import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Download, Copy, Play, Pause, FileText, 
  Headphones, Clipboard, Scale, Info
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CoachingContentLibrary() {
  const { toast } = useToast();
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const WORKSHEETS = [
    {
      id: 'forgiveness-closure',
      title: 'Resilience Mindset: Forgiveness & Closure Worksheet',
      category: 'Resilience Mindset Mentor',
      inspiration: 'Inspired by "Thank You"',
      description: 'A 5-step structured writing prompt designed to release entitled behavior, define absolute boundaries, and step into self-empowerment.',
      markdown: `# Resilience Mindset: Forgiveness & Closure Worksheet
## Resilience Mentoring - Copyright © 2026 Gannon Waye. All Rights Reserved.

Use this writing prompt to process feelings of entitled or arrogant behavior from others, define absolute boundaries, and reclaim your personal power.

### Step 1: Arrogance & Ego Audit
*Write down a situation where you encountered cold, entitled, or arrogant grace.*
*Describe how this behavior made you feel and what boundaries were crossed.*
*Reflect: "How did I let this situation affect my sense of self-worth?"*

### Step 2: The Broken Spell
*Identify the exact moment the spell was broken. When did you see the truth?*
*Write: "I see clearly now. The illusion of who I wanted you to be is gone. The reality is..."*

### Step 3: Walking Out the Door
*What actions are you taking to walk out that door? This can be physical, emotional, or communication boundaries.*
*Set 3 non-negotiable boundaries for yourself.*

### Step 4: Turning Chaos to Champagne
*How can you turn the hurt or chaos you went through into fuel for your own growth or creative power?*
*Write down 3 things you are celebrating about yourself now that you are free.*

### Step 5: The Ultimate "Thank You"
*Write a final thank you statement. Thank them for showing you who they are, because it allowed you to choose a better way.*
*Finish with: "Thank you for showing me who you are. I see you clearly now. I choose another way. Goodbye."*

---
**LEGAL DISCLAIMER & NOTICE:**
*This worksheet is for educational and personal growth coaching purposes only under the Resilience Mentoring brand. It is not psychological therapy, counseling, or clinical treatment. By using this worksheet, you acknowledge and agree that you are solely responsible for your own emotional well-being.*`
    },
    {
      id: 'lived-experience-recovery',
      title: 'Resilience Lived Experience: Grief Recovery Worksheet',
      category: 'Resilience Lived Experience',
      inspiration: 'Inspired by "Without You Here"',
      description: 'Grief mapping, somatic integration, and authentic storytelling exercises for navigating profound loss and finding the courage to survive.',
      markdown: `# Resilience Lived Experience: Grief Recovery Worksheet
## Resilience Mentoring - Copyright © 2026 Gannon Waye. All Rights Reserved.

This journal prompt helps you navigate profound grief, track where it lives in your body, and connect with the survival strength inside you.

### Step 1: Sitting with the Silence
*Describe the physical feeling of the absence or loss. What does the silence feel like?*
*Allow yourself to write without editing or holding back tears.*

### Step 2: Somatic Grief Mapping
*Close your eyes and take 3 deep breaths. Where in your physical body does the weight of this loss feel most intense (e.g., chest tightness, stomach ache, throat constriction)?*
*Write a short message directly to that physical spot: "I feel you, I am listening..."*

### Step 3: Extracting the Wisdom
*What was the greatest wisdom, heart, or love that this person or experience left inside of you?*
*How can you carry that love forward as a part of your own living identity?*

### Step 4: "You Are Not Finished Yet"
*Write down the words you need to hear to remind you that your story continues.*
*What is one small step you can take today to honor their memory by taking care of yourself?*

---
**LEGAL DISCLAIMER & NOTICE:**
*This worksheet is a peer-to-peer lived experience mentoring tool only. It is not professional crisis counseling or psychiatric therapy. If you are experiencing a mental health emergency or severe distress, please contact Lifeline (13 11 14 in AU, 988 in US) immediately.*`
    },
    {
      id: 'fitness-kinetic-flow',
      title: 'Resilience Fitness: Kinetic Movement & Vitality Checklist',
      category: 'Resilience Fitness',
      inspiration: 'Resilience Fitness PT',
      description: 'A daily habit tracker integrating grounding rituals, somatic checks, and kinetic flows to keep mind and body aligned.',
      markdown: `# Resilience Fitness: Kinetic Movement & Vitality Checklist
## Resilience Fitness - Copyright © 2026 Gannon Waye. All Rights Reserved.

Use this checklist daily to track core wellness and kinetic fitness markers.

- [ ] **Circadian Lock:** Walk outside and look at the morning sky for 5-10 minutes within 1 hour of waking.
- [ ] **Somatic Check-In:** Spend 2 minutes scanning your body for tightness and breathing into those spaces.
- [ ] **Kinetic Flow:** complete 15-30 minutes of natural movement (walking, stretching, mobility flow).
- [ ] **Energy Cleansing:** Take 3 deep diaphragmatic breaths whenever you switch between tasks.
- [ ] **Digital Sunset:** Turn off screens or use blue blockers 2 hours before bed.

---
**LEGAL DISCLAIMER & NOTICE:**
*Resilience Fitness is Gannon Waye\'s physical training brand. The movements and checklists contained herein are educational and intended for general fitness conditioning. They are not medical advice. Always consult a qualified GP or physician before commencing any new exercise, diet, or mobility program, especially if you have pre-existing conditions.*`
    },
    {
      id: 'wealth-consciousness',
      title: 'Resilience Planning: Cashflow & Wealth Architecture Plan',
      category: 'Resilience Planning',
      inspiration: 'Financial alignment',
      description: 'Audit cash outflows, rewrite old narratives around scarcity, and establish automated saving/investing pipelines.',
      markdown: `# Resilience Planning: Cashflow & Wealth Architecture Plan
## Resilience Planning - Copyright © 2026 Gannon Waye. All Rights Reserved.

A practical worksheet to audit financial habits and structure cash flows aligned with value.

### 1. Narrative Rewrite
*Scarcity Belief:* "There is never enough money."
*Abundance Reframe:* "Money is a tool that flows to me as I create value."

### 2. Cash Flow Alignment
*List 3 outgoing expenses that do not add real value to your life:*
1.
2.
3.
*List 3 investments in yourself (education, health, tools) that build long-term value:*
1.
2.
3.

### 3. Automation Setup
- [ ] Savings transfer automated
- [ ] Bill payment automated
- [ ] Investment allocation automated

---
**LEGAL DISCLAIMER & NOTICE:**
*Resilience Planning resources are for educational and budgeting purposes only. Gannon Waye and Resilience Mentoring do not provide licensed financial advisory services, tax advising, or investment brokerage. All financial decisions are made solely at your own discretion.*`
    }
  ];

  const MEDITATIONS = [
    { id: 'grounding-breath', title: 'Grounding & Somatic Release Meditation', duration: '12:30', category: 'Resilience Mindset', file: 'grounding_breath_prod.mp3' },
    { id: 'abundance-flow', title: 'Abundance & Wealth Consciousness Tuning', duration: '15:00', category: 'Resilience Planning', file: 'abundance_flow_prod.mp3' },
    { id: 'grief-integration', title: 'Sorrow to Strength Integration', duration: '18:45', category: 'Resilience Lived Experience', file: 'grief_integration_prod.mp3' }
  ];

  const handleCopyMarkdown = (title, text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Worksheet Copied",
      description: `Markdown content for "${title}" copied to clipboard.`,
    });
  };

  const handleDownloadMock = (title) => {
    toast({
      title: "Download Mocked",
      description: `Downloading PDF for "${title}"... (Staging mock file generated)`,
    });
  };

  const toggleAudio = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      toast({
        title: "Audio Paused",
        description: "Meditation track paused.",
      });
    } else {
      setPlayingAudioId(id);
      toast({
        title: "Audio Playing",
        description: "Playing meditation audio track preview...",
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin/coaching-command">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Resilience Mentoring Resource Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Staging area for client-facing worksheets, journal prompts, checklists, and meditation tracks.</p>
        </div>
      </div>

      {/* Worksheets Section */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2 text-foreground">
          <FileText className="w-5 h-5 text-primary" /> Branded Client Worksheets ({WORKSHEETS.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKSHEETS.map(sheet => (
            <Card key={sheet.id} className="border-border bg-card/40 backdrop-blur-md flex flex-col justify-between hover:border-primary/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">{sheet.category}</Badge>
                  {sheet.inspiration && <span className="text-[10px] text-yellow-500/80 italic">{sheet.inspiration}</span>}
                </div>
                <CardTitle className="text-base font-display">{sheet.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">{sheet.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-3">
                <div className="bg-secondary/40 rounded-lg p-3 max-h-32 overflow-y-auto border border-border/20">
                  <pre className="text-[10px] text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{sheet.markdown}</pre>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="secondary" className="text-xs gap-1.5 flex-1" onClick={() => handleCopyMarkdown(sheet.title, sheet.markdown)}>
                    <Copy className="w-3.5 h-3.5" /> Copy Markdown
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1.5 flex-1" onClick={() => handleDownloadMock(sheet.title)}>
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Audio Meditations Section */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2 text-foreground">
          <Headphones className="w-5 h-5 text-primary" /> Audio Meditations & Tonal Soundscapes ({MEDITATIONS.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEDITATIONS.map(track => (
            <Card key={track.id} className="border-border bg-card/40 backdrop-blur-md flex flex-col justify-between hover:border-primary/30 transition-all">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary text-[10px] hover:bg-primary/30">{track.category}</Badge>
                  <span className="text-xs text-muted-foreground font-mono">{track.duration}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">{track.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{track.file}</p>
                </div>

                {/* Animated visualizer (mock) */}
                <div className="flex items-center gap-1.5 h-8 justify-center bg-secondary/20 rounded-lg px-3 border border-border/10 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-0.5 bg-primary rounded-full transition-all duration-300 ${playingAudioId === track.id ? 'animate-pulse' : 'opacity-40'}`} 
                      style={{ 
                        height: playingAudioId === track.id 
                          ? `${Math.max(10, Math.floor(Math.random() * 28))}px` 
                          : '6px',
                        animationDelay: `${i * 0.05}s`
                      }} 
                    />
                  ))}
                </div>

                <Button 
                  size="sm" 
                  variant={playingAudioId === track.id ? "secondary" : "default"} 
                  className={`w-full gap-1.5 ${playingAudioId !== track.id ? 'gradient-gold-button border-0' : ''}`}
                  onClick={() => toggleAudio(track.id)}
                >
                  {playingAudioId === track.id ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Pause Preview
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 ml-0.5" /> Play Meditation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
