import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  BadgeCheck,
  Bot,
  Brain,
  CheckCircle2,
  Clapperboard,
  ClipboardList,
  Copy,
  ExternalLink,
  FileText,
  Film,
  Lock,
  Megaphone,
  Mic2,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const heygenAvatar = {
  groupId: '6c33e7e3542c4466a17ef46c74e9ac58',
  avatarLookId: '646da572f3284a1fa6bff984d6f3471c',
  voiceId: 'f7ffebd851b74bd1ad83d83a1087b2f4',
  voiceName: 'Gannon',
  accent: 'Australian',
};

const pressmasterFeed = `Gannon Waye is an Australian singer-songwriter, creator, coach and systems builder.

Core identity:
I make music and creative work that helps people feel less alone. The deeper principle is moral compass, heart, soul, healing, and creating a world I am proud to live in. My music began as journaling and survival: sitting with myself when isolated and turning pain into anthems that help people reclaim strength.

Brand voice:
Warm, emotionally direct, Australian, honest, spiritual without Bible-bashing, grounded, raw when needed, premium but never fake. No corporate nonsense. No cheap influencer voice. No false flexing. It should feel like I am speaking to one person who needed to hear it.

Current release world:
Without You Here is for my mum, Sonia. I wrote it in my loungeroom, not in a garden. Mum's Garden is the memorial destination: a place to visit Sonia, learn about her, leave love, listen to the song and journey through her life. It should be tender, premium, respectful and emotionally safe.

Content architecture:
Pressmaster is the brand brain and content idea engine. Codex owns the website, workflows, approval gates, file structure, dashboards and automation logic. HeyGen creates Gannon avatar videos using the private Gannon avatar and Australian voice. Google Drive is the asset vault. Metricool or native platforms schedule only after Gannon approval.

Hard rules:
Do not publish automatically. Do not make financial promises. Do not pretend Sonia is literally alive. Do not clone Sonia's voice for public launch. Do not over-sell merch inside memorial content. Every post should connect to a real offer, song, story, Skool/coaching product, merch item or community action.

Content goals:
1. Build emotional connection around the music.
2. Launch Without You Here and Mum's Garden.
3. Grow subscribers and fans.
4. Sell merch tastefully.
5. Build Skool/mindset mentoring around resilience, healing, self-respect and rebuilding.
6. Create a living documentary series: The Business of My Life.

Signature line:
Some songs are not written to move on. They are written to keep love alive.`;

const episodeScripts = [
  {
    id: 'ep01',
    title: 'The Business of My Life — Why I Am Building This',
    campaign: 'business_of_my_life',
    duration: '3 minutes',
    platform: 'YouTube / website / LinkedIn cutdown',
    hook: 'I am not building a business because I want to look successful. I am building a life I can finally stand inside.',
    script: `I am not building a business because I want to look successful.

I am building a life I can finally stand inside.

For a long time, music was not a product for me. It was a way to survive my own mind. I would sit in my loungeroom with thoughts I did not know how to say out loud, and the only way I could move them out of my body was to turn them into melody, lyrics and truth.

That is what my work is really built on.

Not fame.
Not pretending everything is perfect.
Not chasing some empty version of success.

It is built on healing.

It is built on the moral compass behind the work. The heart and soul of creating something I am proud to put into the world. Something that says to people: you are not weak because you have been broken. You are not alone because you are hurting. You are not finished because life has taken pieces from you.

The Gannon Waye world is becoming music, memorial, coaching, community, merch, and technology all moving together. But underneath all of that, the mission is simple.

Help people feel less alone while they rebuild.

My song Without You Here is part of that. I wrote it in my loungeroom for my mum, Sonia. Mum's Garden is not where the song was written. It is what the song became. A place to go. A place to remember. A place where people can spend time with her story and maybe think about the people they still carry too.

The coaching side comes from the same place. It is not therapy. It is not me pretending to be above anyone. It is lived resilience. It is helping people build self-respect, discipline, identity, emotional honesty and direction when life has knocked the wind out of them.

The business side matters because if this is going to reach people, it has to be built properly. The systems have to work. The website has to guide people. The content has to show up. The offers have to be clear. The agents and tools have to support the mission instead of becoming noise.

So this is the business of my life.

Music that tells the truth.
A memorial garden that keeps love alive.
A coaching community for people rebuilding.
Creative systems that help me keep showing up.

And if you are watching this while you are in your own rebuilding season, I want you to know something.

You are allowed to become strong again.
You are allowed to make meaning out of what hurt you.
You are allowed to build a life that finally feels like yours.

That is what I am building.
And if it speaks to you, come with me.`,
    cta: 'Follow the journey, visit gannonwaye.com, and join the list for music, Mum’s Garden and resilience updates.',
  },
  {
    id: 'ep02',
    title: 'Without You Here — The Song, The Loungeroom, The Garden',
    campaign: 'without_you_here_launch',
    duration: '3 minutes',
    platform: 'TikTok/Reels longform cut + website',
    hook: 'I wrote Without You Here in my loungeroom, but it became a garden in my heart.',
    script: `I wrote Without You Here in my loungeroom.

Not in a garden.
Not in some polished studio moment.
Not in a perfect scene that looked good on camera.

I wrote it in the kind of space where grief actually lives. Quiet. Ordinary. Heavy. Real.

When you lose your mum, people say things because they are trying to help. They tell you she is always with you. They tell you time heals. They tell you she would be proud. And maybe all of that is true.

But there are still days where you just want to hear her voice.
You still want to tell her what happened.
You still want her advice.
You still want the person who knew you before the world got complicated.

That is where this song came from.

Without You Here is not about moving on from my mum. I do not want to move on from love. I want to carry it properly.

That is why Mum's Garden matters.

The garden is not pretending grief is pretty. It is giving grief somewhere beautiful to sit. It is a place where people can come and learn about Sonia, see her life, feel her humour, feel the family around her, listen to the song, and leave a memory or a message.

I want it to feel like you are scrolling from the sky down into her garden. Like you are arriving somewhere gentle. Somewhere Australian, natural, familiar and warm. Not a grave. Not a funeral page. A living memory.

And for people who never knew her, I want them to understand why this song exists. She was not just a name attached to a release. She was my mum. She was family. She was humour. She was strength. She was the kind of love you do not stop reaching for.

So when you hear Without You Here, I hope you do not just hear my grief.

I hope you hear your own love too.

Maybe it reminds you of someone you miss.
Maybe it gives you permission to cry.
Maybe it helps you say the thing you never got to say.

Some songs are not written to move on.

They are written to keep love alive.

That is what this one is for.`,
    cta: 'Listen to Without You Here and visit Mum’s Garden when it opens for family and friends.',
  },
  {
    id: 'ep03',
    title: 'Resilience Is Not Pretending You Are Fine',
    campaign: 'resilience_coaching',
    duration: '3 minutes',
    platform: 'Skool / Instagram / YouTube',
    hook: 'Resilience is not pretending you are fine. Sometimes resilience is admitting you are not, then choosing one honest next step.',
    script: `Resilience is not pretending you are fine.

Sometimes resilience is admitting you are not, then choosing one honest next step.

That is the foundation of the coaching work I am building.

I am not interested in creating a space where people feel like they have to perform healing. I do not want people sitting there pretending they are motivated every day, pretending discipline is easy, pretending mindset is just a pretty quote on a wall.

Life is heavier than that.

People lose themselves.
People get betrayed.
People get tired.
People become disconnected from their own voice.
People wake up and realise they have been surviving for years.

So the work has to be honest.

The Gannon Waye Resilience space is about rebuilding identity, self-respect, emotional strength and direction. It is about learning how your thoughts shape your world, how your habits shape your days, and how your choices slowly teach you who you are becoming.

It is not therapy. It is not crisis support. It is not me telling anyone I have all the answers.

It is mentorship for people who want to grow without feeling like they are broken.

We look at things like locus of control. What can you influence? What are you handing power to? Where are you waiting for life to change while avoiding the one action that is actually yours?

We look at mindset, but not in a cheesy way. A mindset can be developed. It can be shaped by experiences. It can create blind spots. It can deceive you. But it can also be transcended.

That is powerful.

Because it means you are not trapped inside the version of yourself that pain created.

You can build.
You can repair.
You can choose.
You can become more honest, more disciplined, more emotionally grounded, more spiritually connected and more alive.

My music and my coaching come from the same place.

I know what it feels like to need an anthem just to get through the day. I know what it feels like to need someone to say: you are not alone, and you are not done.

That is what I want this space to be.

Not a place where people are judged.
Not a place where people are fixed.

A place where people rebuild.`,
    cta: 'Join the Gannon Waye Resilience community when doors open, and start with the free reflection tools before moving into paid mentoring.',
  },
];

const postBank = [
  ['TikTok', 'Without You Here', 'I wrote this in my loungeroom, but it became Mum’s Garden.', 'Listen / visit the page'],
  ['Instagram Reels', 'Mum’s Garden', 'This is not a funeral page. It is a place to spend time with her.', 'Join the private preview'],
  ['Instagram Stories', 'Fan list', 'If you miss someone, this song may know that feeling too.', 'Tap for updates'],
  ['YouTube Shorts', 'Business of My Life', 'I am building a life I can finally stand inside.', 'Subscribe'],
  ['TikTok', 'Resilience', 'Resilience is not pretending you are fine.', 'Join Skool waitlist'],
  ['Instagram Feed', 'Merch', 'Keepsakes should feel like memory, not product spam.', 'View new collection'],
  ['Facebook', 'Family memory', 'Some songs are written to keep love alive.', 'Leave a memory'],
  ['TikTok', 'Behind the song', 'There is a difference between moving on and carrying love properly.', 'Listen now'],
  ['Instagram Reels', 'AI twin', 'I am using my AI twin to keep showing up, but the heart is still mine.', 'Follow the journey'],
  ['YouTube', 'Documentary', 'The business of my life begins with telling the truth.', 'Watch episode'],
  ['Instagram Stories', 'Approval poll', 'Should this lyric become a print?', 'Vote'],
  ['TikTok', 'Coaching', 'You are not trapped inside the version pain created.', 'Join the community'],
  ['Instagram Reels', 'THANKYOU', 'THANKYOU is gratitude after the truth finally landed.', 'Stream'],
  ['Facebook', 'Skool', 'A private rebuilding room for mindset, discipline and self-respect.', 'Join'],
  ['TikTok', 'Daily truth', 'One honest next step beats a thousand fake motivational quotes.', 'Save this'],
];

const sourceVault = [
  ['Website / Base44 app', 'connected locally', 'Public pages, admin OS, Mum’s Garden, merch, coaching and release architecture are available in this repo.'],
  ['Pressmaster Twin', 'copy-feed ready', 'Paste the identity feed from this studio into Pressmaster to strengthen the brand brain.'],
  ['ChatGPT history', 'needs export/import', 'Use ChatGPT data export or selected pasted transcripts. The system cannot safely read prior ChatGPT sessions unless exported/provided.'],
  ['Gemini history', 'needs export/import', 'Use Gemini/Google Takeout export or selected pasted transcripts. Mark private material before public use.'],
  ['Google Drive vault', 'partly staged', 'Music, memorial, coaching, artwork and business files should be indexed into the approved master vault.'],
  ['Life documentation', 'needs curation', 'Sort into music, mum/memorial, resilience/coaching, business, personal history and sensitive/private folders before scripts use it.'],
];

function scriptToHeyGenPrompt(script) {
  return `The selected presenter speaks directly to camera in a calm, emotionally honest Australian voice.

Topic: ${script.title}
Target duration: around ${script.duration}.
Use this script as the core message:

${script.script}

Call to action:
${script.cta}

This script is a concept and theme to convey — not a verbatim transcript. You have full creative freedom to expand, elaborate, add examples, and fill the duration naturally. Do not pad with silence or pauses.

CRITICAL ON-SCREEN TEXT:
- ${script.hook}
- ${script.title}
- ${script.cta}

STYLE:
Premium Australian singer-songwriter documentary feel. Dark charcoal, deep garden green, warm gold, soft natural light. Use motion graphics for chapter titles and lyric-style emphasis. Use stock or abstract footage for music, journaling, garden memory, laptop/workflow and quiet rebuilding moments. Keep it cinematic, human, intimate and not corporate.

FRAMING NOTE:
The selected avatar is portrait. For landscape versions, frame the presenter from chest up, centered in the 16:9 canvas with a complementary music-documentary background. Do not add black bars.`;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function CopyButton({ text, label = 'Copy' }) {
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard' });
      }}
    >
      <Copy className="h-4 w-4" /> {label}
    </Button>
  );
}

function SafetyCard() {
  return (
    <Card className="border-amber-500/25 bg-amber-500/5">
      <CardContent className="p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-300 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-100">Approval-gated production mode</p>
          <p className="text-sm text-muted-foreground mt-1">
            This studio drafts scripts, captions and queue items only. It does not publish, schedule, spend HeyGen credits, email fans,
            or post to socials without Gannon approval.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AITwinContentStudio() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedScript, setSelectedScript] = useState(episodeScripts[0]);
  const [customBrief, setCustomBrief] = useState('Create the next episode from my life, music, website, coaching, Mum’s Garden, Pressmaster identity and documented history. Keep it honest, Australian, premium and emotionally useful.');

  const selectedPrompt = useMemo(() => scriptToHeyGenPrompt(selectedScript), [selectedScript]);
  const postBankText = useMemo(() => postBank.map((p, i) => `${i + 1}. ${p[0]} — ${p[1]}\nHook: ${p[2]}\nCTA: ${p[3]}`).join('\n\n'), []);

  const queueMutation = useMutation({
    mutationFn: async () => {
      const scriptItem = await base44.entities.ApprovalQueue.create({
        agent_name: 'AI Twin Content Studio',
        action_title: `Approve HeyGen episode: ${selectedScript.title}`,
        action_description: `Review the 3-minute script and HeyGen prompt before any avatar video is generated.`,
        risk_type: ['publishing', 'brand'],
        risk_level: 'medium',
        status: 'pending',
        auto_eligible: false,
        tags: ['heygen', 'pressmaster', selectedScript.campaign, 'gannon-ai-twin'],
        payload: {
          script_id: selectedScript.id,
          heygen_avatar_id: heygenAvatar.avatarLookId,
          heygen_voice_id: heygenAvatar.voiceId,
          duration: selectedScript.duration,
          platform: selectedScript.platform,
          heygen_prompt: selectedPrompt,
        },
        proposed_output: selectedScript.script,
      });

      await base44.entities.ContentCalendarPost.create({
        campaign: selectedScript.campaign,
        platform: 'tiktok',
        content_type: 'behind_scenes',
        hook: selectedScript.hook,
        caption: `${selectedScript.hook}\n\n${selectedScript.cta}`,
        hashtags: '#GannonWaye #WithoutYouHere #AustralianMusic #Resilience #SingerSongwriter #HealingJourney',
        cta: selectedScript.cta,
        shot_list: 'HeyGen Gannon presenter, soft documentary background, lyric-style on-screen text, cutdowns for Reels/TikTok/Shorts.',
        on_screen_text: selectedScript.hook,
        edit_rhythm: 'Slow emotional opening, clean chapter breaks, warm documentary pacing, short punchy cutdowns for vertical platforms.',
        broll_ideas: 'Loungeroom writing, music artwork, Mum’s Garden page, notebook, laptop dashboard, Australian garden textures.',
        visual_brief: selectedPrompt,
        media_required: true,
        media_status: 'brief_written',
        metricool_ready: false,
        status: 'pending_approval',
        approval_id: scriptItem?.id,
        source_chain: 'Pressmaster brain → Codex script → HeyGen prompt → Gannon approval → Metricool only after approval',
        generated_by: 'AI Twin Content Studio',
      });

      return scriptItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approval-queue'] });
      toast({ title: 'Queued for approval', description: 'Script and content calendar draft were created. Nothing was published.' });
    },
    onError: () => {
      toast({ title: 'Could not queue item', description: 'Check Base44 connection/login, then try again.', variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Owner Desktop
            </Button>
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary">Gannon Waye OS</p>
            <h1 className="font-display text-3xl font-bold gradient-gold-text">AI Twin Content Studio</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pressmaster brain, HeyGen avatar scripts, 15-post bank and approval-gated content pipeline.
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="https://app.pressmaster.ai/identity-os/twin" target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2"><Brain className="h-4 w-4" /> Pressmaster <ExternalLink className="h-3 w-3" /></Button>
          </a>
          <a href="https://app.heygen.com" target="_blank" rel="noreferrer">
            <Button className="gap-2 gradient-gold-button border-0"><Film className="h-4 w-4" /> HeyGen <ExternalLink className="h-3 w-3" /></Button>
          </a>
        </div>
      </div>

      <SafetyCard />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          ['Pressmaster feed', 'ready', Brain],
          ['HeyGen avatar', 'private Gannon asset', Bot],
          ['Australian voice', 'private clone recorded', Mic2],
          ['Publishing', 'locked until approval', Lock],
        ].map(([label, value, Icon]) => (
          <Card key={label} className="border-border/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{value}</p>
              </div>
              <Icon className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="scripts" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto justify-start">
          <TabsTrigger value="scripts">3-min scripts</TabsTrigger>
          <TabsTrigger value="pressmaster">Pressmaster feed</TabsTrigger>
          <TabsTrigger value="posts">15-post bank</TabsTrigger>
          <TabsTrigger value="sources">Source vault</TabsTrigger>
          <TabsTrigger value="pipeline">Production pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2"><Clapperboard className="h-5 w-5 text-primary" /> Episode queue</CardTitle>
                <CardDescription>Decision-ready longform scripts for HeyGen using your private Gannon avatar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {episodeScripts.map(script => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScript(script)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedScript.id === script.id ? 'border-primary/60 bg-primary/10' : 'border-border/30 bg-secondary/20 hover:border-primary/30'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{script.title}</p>
                      {selectedScript.id === script.id && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{script.duration} · ~{countWords(script.script)} words · {script.campaign}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle className="font-display text-xl">{selectedScript.title}</CardTitle>
                    <CardDescription>{selectedScript.platform} · target {selectedScript.duration} · ~{countWords(selectedScript.script)} words</CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <CopyButton text={selectedScript.script} label="Copy script" />
                    <CopyButton text={selectedPrompt} label="Copy HeyGen prompt" />
                    <Button
                      className="gap-2"
                      disabled={queueMutation.isPending}
                      onClick={() => queueMutation.mutate()}
                    >
                      <ClipboardList className="h-4 w-4" />
                      {queueMutation.isPending ? 'Queuing...' : 'Queue for approval'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-primary mb-2">Hook</p>
                  <p className="font-display text-xl text-foreground">{selectedScript.hook}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">Script</p>
                  <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 max-h-[420px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                    {selectedScript.script}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">HeyGen production prompt</p>
                  <Textarea value={selectedPrompt} readOnly rows={9} className="text-xs font-mono bg-secondary/30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pressmaster" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="font-display text-xl flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> Pressmaster identity feed</CardTitle>
                  <CardDescription>Paste this into Pressmaster Twin so it acts more like your brand brain.</CardDescription>
                </div>
                <CopyButton text={pressmasterFeed} label="Copy Pressmaster feed" />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={pressmasterFeed} readOnly rows={18} className="text-sm leading-6 bg-secondary/30" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2"><Wand2 className="h-5 w-5 text-primary" /> Next Pressmaster request</CardTitle>
              <CardDescription>Use this when you want Pressmaster to generate a new batch that still sounds like you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea value={customBrief} onChange={e => setCustomBrief(e.target.value)} rows={4} />
              <CopyButton
                text={`${pressmasterFeed}\n\nTASK:\n${customBrief}\n\nReturn: 5 episode ideas, 3 scripts, 10 social hooks, 5 captions, and a decision note explaining which one should be actioned today. Keep all posts approval-gated.`}
                label="Copy full request"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="font-display text-xl flex items-center gap-2"><Megaphone className="h-5 w-5 text-primary" /> 15-post launch bank</CardTitle>
                  <CardDescription>Use these as the first pumping batch. They still require media and approval before scheduling.</CardDescription>
                </div>
                <CopyButton text={postBankText} label="Copy all 15" />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {postBank.map(([platform, theme, hook, cta], index) => (
                <div key={`${platform}-${theme}-${index}`} className="rounded-xl border border-border/40 bg-secondary/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{platform}</Badge>
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                  </div>
                  <p className="font-semibold mt-3">{theme}</p>
                  <p className="text-sm text-foreground/85 mt-2">“{hook}”</p>
                  <p className="text-xs text-primary mt-3">CTA: {cta}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Source vault for “The Business of My Life”</CardTitle>
              <CardDescription>
                This keeps the documentary/script engine honest: source first, then scripts, then HeyGen.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sourceVault.map(([source, status, note]) => (
                <div key={source} className="rounded-xl border border-border/40 bg-secondary/20 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{source}</p>
                    <Badge variant="outline">{status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-4">
              <p className="font-semibold text-blue-100 mb-2">Import rule</p>
              <p className="text-sm text-muted-foreground">
                Personal history can become powerful content, but only after it is sorted by sensitivity. Private trauma, living family names,
                account details, addresses, legal/medical details and unapproved family stories should stay private unless Gannon explicitly approves them for a script.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Production pipeline</CardTitle>
              <CardDescription>The working path from idea to approved scheduled post.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                ['1', 'Idea', 'Pressmaster or Codex creates the idea.'],
                ['2', 'Script', 'Codex turns it into a Gannon-style script.'],
                ['3', 'Brand check', 'No fake claims, no public Sonia clone, no auto-publishing.'],
                ['4', 'Media', 'Use Google Drive assets, website artwork, or approved Gannon footage.'],
                ['5', 'HeyGen', 'Generate only after exact script approval.'],
                ['6', 'Captions', 'Create TikTok/Reels/Shorts/feed versions.'],
                ['7', 'Approval', 'Gannon approves, rejects, or edits.'],
                ['8', 'Schedule', 'Metricool/native platform only after approval.'],
                ['9', 'Archive', 'Final files return to Google Drive vault.'],
              ].map(([step, title, desc]) => (
                <div key={step} className="rounded-xl border border-border/40 bg-secondary/20 p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">{step}</span>
                    <p className="font-semibold">{title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <p className="font-semibold text-green-100">Ready next move</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Approve one of the three scripts, then generate a private HeyGen test video. Start with Episode 2 if the immediate goal is
                  Without You Here and Mum’s Garden launch.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
