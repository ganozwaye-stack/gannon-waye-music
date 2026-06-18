import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, AlertTriangle, ExternalLink, Film, Image, Zap, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

// ─────────────────────────────────────────────────────────────────────────────
// BRAND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const BRAND = `Brand voice: raw, honest, emotional, survivor-led, cinematic, premium.
Colour palette: deep black (#0a0a0a), gold (#D4AF37), warm white (#f0e8d8).
No cheap template look. No corporate energy. No filters that dilute the black/gold contrast.
Font style: Playfair Display (headings), Inter (body). Clean. No cluttered layouts.
Store URL: gannonwaye.com/store`;

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT BRIEFS
// ─────────────────────────────────────────────────────────────────────────────
const BRIEFS = [
  {
    id: 'ad-collection',
    type: 'ad',
    icon: Image,
    label: 'Merch Collection Advertisement',
    badge: 'Canva / Adobe Express',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    purpose: 'Sell the full store. Drive clicks to gannonwaye.com/store.',
    cta: 'Shop the official THANKYOU merch collection.',
    link: 'gannonwaye.com/store',
    formats: ['9:16 (Stories / TikTok)', '1:1 (Feed / Facebook)', '16:9 (YouTube / Facebook banner)'],
    products: [
      'Respect Is Earned Hoodie — $89',
      'Respect Is Earned Coffee Mug — $9.90',
      'Thankyou Journal, Pen & Thermos Bundle — $59',
      'Winter Writing & Comfort Bundle — $129 (no further discounts)',
      'Respect Is Earned Lyric Wall Poster — from $19',
      'Thankyou Tote Bag — Sold Out (show grayed/crossed)',
    ],
    canva_instructions: `CANVA / ADOBE EXPRESS VISUAL INSTRUCTIONS:

Canvas: Start with 9:16 (1080×1920px), export also as 1:1 and 16:9.

Background:
— Deep black gradient (#0a0a0a → #111). No white. No grey.
— Subtle gold dust/particle overlay layer (low opacity ~15%).
— Optional: faint horizontal scan lines for cinematic depth.

Product layout:
— Centre: Winter Bundle hero shot (hoodie + journal + pen + thermos) — largest element.
— Left column: Hoodie front mockup, Coffee Mug.
— Right column: Journal Bundle, Lyric Wall Poster.
— Bottom right: Tote Bag — slightly desaturated, small badge: "Sold Out".
— All product images on transparent/dark background. No white cards or product boxes.

Typography:
— Top: "GANNON WAYE" in gold uppercase Playfair Display, tracking wide.
— Centre above products: "THANKYOU" — oversized, deep gold glow effect.
— Below products: "RESPECT IS EARNED. NOT A GAME YOU MAKE ME PLAY." — smaller, warm white, italic Playfair.
— Bottom CTA: "Shop the collection" — white capsule button shape with gold border.
— URL: gannonwaye.com/store — small, warm white, bottom centre.

Gold accents:
— Thin gold horizontal rule above and below product cluster.
— Gold dot or star accent near THANKYOU heading.

Export:
— 9:16 → Instagram Stories, TikTok, Facebook Stories.
— 1:1 → Instagram Feed, Facebook Feed.
— 16:9 → Facebook Banner, YouTube Community post.`,

    caption: `Every piece in this collection is more than merch.

It's a reminder.

Respect is earned. Not given. Not begged for.

🖤 Shop the official THANKYOU collection.
Link in bio or go directly to gannonwaye.com/store

#GannonWaye #Thankyou #RespectIsEarned #IndieArtist #MerchDrop #AustralianMusic #MerchCollection #NewMusic #SupportIndieArtists`,

    first_comment: `🔗 Direct link: gannonwaye.com/store
Every purchase supports independent music and 10% goes to 1800RESPECT. 🖤`,
  },

  {
    id: 'reel-1-thankyou',
    type: 'reel',
    icon: Film,
    label: 'Reel 1 — "Who are you saying THANKYOU to?"',
    badge: 'CapCut — 9:16',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    purpose: 'Emotional/community reel. Drive feeling, not product specs. Products appear naturally.',
    cta: 'Tag who you are saying THANKYOU to in the comments.',
    hook: '"Who are you saying THANKYOU to right now?"',
    overlay_text: [
      'Screen 1: "Who are you saying THANKYOU to?" — large, centred, Playfair, gold glow fade in.',
      'Screen 2: (blank beat cut — let the hoodie shot breathe)',
      'Screen 3: "A parent. A friend. A version of yourself you left behind." — white italic, slow fade.',
      'Screen 4: Products in soft light — hoodie, mug, tote, journal — no price text yet.',
      'Screen 5: "The THANKYOU collection." — gold, centred.',
      'Screen 6: "Wear it. Write in it. Carry it." — white, smaller.',
      'Screen 7: "@gannonwaye · gannonwaye.com/store" — gold, bottom third.',
    ],
    scene_list: `CAPCUT SCENE LIST — REEL 1:

Scene 1 (0:00–0:03): Black screen → gold text fades in: "Who are you saying THANKYOU to?" 
— Beat cut on lyric hit. Slow zoom on text. Glow pulse effect on gold.

Scene 2 (0:03–0:06): Close-up hoodie product shot — dark background, soft directional lighting.
— Motion: slow push in. No text. Breathing space.

Scene 3 (0:06–0:10): Text overlay: "A parent. A friend. A version of yourself you left behind."
— White italic, centred. Fade in staggered per line. Subtle vignette.

Scene 4 (0:10–0:14): Flat lay — hoodie, mug, tote bag, journal together on black surface.
— Motion: slow pan right. Warm gold tone grade.
— Text lower third: "THANKYOU Collection"

Scene 5 (0:14–0:18): Single hero shot — mug in hands, steam, dark moody.
— Overlay: "Carry the reminder." — gold, small, centred.

Scene 6 (0:18–0:22): Tote bag shot with lyric printed. Close crop.
— Overlay: "Wear your values." — white italic.

Scene 7 (0:22–0:27): Journal open on dark desk, pen beside it.
— Overlay: "Write through it." — white, soft fade.

Scene 8 (0:27–0:30): End card — black, gold GANNON WAYE logo or signature.
— Text: "gannonwaye.com/store" — gold, centred.
— Beat out. Fade to black.

CapCut settings: 
— Aspect: 9:16. Export: 1080×1920, 60fps.
— Captions: auto-generate then manually review.
— Audio: song snippet — THANKYOU chorus or bridge, 30 sec clip.
— Colour grade: Golden Hour LUT or custom: shadows crushed black, midtones warm gold, highlights warm white.`,

    caption: `Who are you saying THANKYOU to?

Drop their name in the comments. 👇

This collection is for everyone who's earned respect, not been given it.

🖤 Shop the THANKYOU collection → gannonwaye.com/store

#GannonWaye #Thankyou #WhoAreYouThankfulFor #RespectIsEarned #IndieMusic #NewMusic #AustralianArtist #MerchDrop #EmotionalMusic #SurvivorMusic`,

    first_comment: `🔗 gannonwaye.com/store — every piece in this collection carries a meaning. 10% of proceeds to 1800RESPECT. 🖤`,
  },

  {
    id: 'reel-2-respect',
    type: 'reel',
    icon: Film,
    label: 'Reel 2 — "Respect is earned. Not a game you make me play."',
    badge: 'CapCut — 9:16',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    purpose: 'Identity/lyric reel. Strong, cinematic, unapologetic. Hoodie is the hero product.',
    cta: 'Shop the hoodie at gannonwaye.com/store',
    hook: '"Respect is earned. Not a game you make me play."',
    overlay_text: [
      'Screen 1: White text → "Respect is earned." — bold, slow fade in.',
      'Screen 2: Beat cut → Gold glitch/flash → "Not a game you make me play." — stronger, gold.',
      'Screen 3: Hoodie back shot — lyric printed clearly.',
      'Screen 4: Close-up of chest/front hoodie print — the artwork detail.',
      'Screen 5: Hoodie + mug together on dark surface — "The statement." — small white italic.',
      'Screen 6: Tote bag shot — identity accessory.',
      'Screen 7: Gold Gannon Waye signature end card. "gannonwaye.com/store"',
    ],
    scene_list: `CAPCUT SCENE LIST — REEL 2:

Scene 1 (0:00–0:02): Black. White bold text appears word by word: "RESPECT. IS. EARNED."
— Typewriter or snap-on effect. No music yet — or low rumble underneath.

Scene 2 (0:02–0:04): Gold flash transition. Text: "Not a game you make me play." — gold, larger, slower fade.
— Music drops: THANKYOU hook or chorus.

Scene 3 (0:04–0:08): Hoodie back — lyric text clearly visible. 
— Slow vertical pan upward. Dark studio lighting. High contrast.
— No overlay text. Let the product breathe.

Scene 4 (0:08–0:12): Hoodie front — logo/artwork close crop.
— Slight push-in motion. 
— Overlay (lower left): "Respect Is Earned Hoodie — $89"

Scene 5 (0:12–0:16): Hoodie + Mug styled flat lay. Dark surface, gold rim on mug catches light.
— Text: "The statement." — small white italic, upper centre.

Scene 6 (0:16–0:20): Tote bag — solo shot, styled close.
— Overlay: "Carry it with you." — white italic.

Scene 7 (0:20–0:25): Cinematic wide — all three products (hoodie, mug, tote) arranged on black.
— Slow pull-back. Gold particle dust overlay (low opacity).
— Overlay: "THANKYOU Collection" — gold, centred.

Scene 8 (0:25–0:30): End card — black background, gold GW signature or GANNON WAYE text.
— Text: "gannonwaye.com/store" — centred, gold.
— Fade to black. Music out.

CapCut settings:
— Aspect: 9:16. Export: 1080×1920, 60fps.
— Glow overlay: add gold glow/bloom on product highlights.
— Beat cuts: sync Scene 1→2 transition to beat drop.
— Colour grade: deep black shadows, warm gold midtones, no cool tones.`,

    caption: `Respect is earned.
Not a game you make me play. 🖤

If you know, you know.

The THANKYOU hoodie, mug, and tote — available now.

→ gannonwaye.com/store

#GannonWaye #RespectIsEarned #Thankyou #HoodieDrops #AustralianMusic #IndieArtist #NewMusicAlert #CinematicMerch #IdentityMerch #MerchCollection`,

    first_comment: `🔗 Shop the collection: gannonwaye.com/store
The lyric is on the back. Wear the reminder. 🖤`,
  },

  {
    id: 'reel-3-winter-bundle',
    type: 'reel',
    icon: Film,
    label: 'Reel 3 — "Winter Writing & Comfort Bundle — $119"',
    badge: 'CapCut — 9:16',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    purpose: 'Product reel. Clear value, emotional warmth, bundle hero. No further discounts messaging is REQUIRED.',
    cta: 'Shop the Winter Bundle — gannonwaye.com/store',
    hook: '"The writing bundle that changes your winter."',
    overlay_text: [
      'Screen 1: "Winter is the season for going deeper." — white italic, fade in.',
      'Screen 2: Products appear one by one — hoodie, journal, pen, thermos.',
      'Screen 3: "$119 — the full Winter Writing & Comfort Bundle." — gold, bold.',
      'Screen 4: ⚠️ "No further discounts apply to this bundle." — small amber text, visible clearly.',
      'Screen 5: "Write through the cold." — white italic.',
      'Screen 6: "gannonwaye.com/store" — gold, end card.',
    ],
    scene_list: `CAPCUT SCENE LIST — REEL 3:

Scene 1 (0:00–0:03): Black screen, slow text fade: "Winter is the season for going deeper."
— White italic Playfair style. Soft underscore sound or music in low.

Scene 2 (0:03–0:07): Product reveal — one by one, each appearing from black:
  → Hoodie (folded, close, dark bg)
  → Thermos (close up, steam if possible or stylised)
  → Journal (open, pen resting)
  → Pen (close crop)
— Music rises gently on each product reveal.
— No text during reveals — let each product land.

Scene 3 (0:07–0:11): All four products together — flat lay or styled arrangement.
— Slow push in. Warm gold tone grade.
— Overlay: "The Winter Writing & Comfort Bundle" — gold, centred, Playfair style.

Scene 4 (0:11–0:15): Price overlay — large and clear:
— "$119" — bold gold, centred.
— Below in smaller white text: "Hoodie + Journal + Pen + Thermos"
— ⚠️ Note below in amber/warm yellow (NOT red — not alarming): "No further discounts apply to this bundle."

Scene 5 (0:15–0:20): Lifestyle-style shot — journal open, pen in hand, thermos beside, hoodie visible behind.
— Warm, cosy, intentional. Not a stock photo vibe.
— Overlay: "Write through it. Stay warm. Stay grounded." — white italic, staggered lines.

Scene 6 (0:20–0:25): Hoodie close-up — front logo visible.
— Overlay: "Wear your values into winter." — white small.

Scene 7 (0:25–0:30): End card — black background, gold.
— Text: "Winter Writing & Comfort Bundle"
— "$119 · gannonwaye.com/store"
— "No further discounts." — small amber, visible but not alarming.
— Music out. Fade to black.

CapCut settings:
— Aspect: 9:16. Export: 1080×1920, 60fps.
— Warm golden LUT throughout — cosy, winter evening feel.
— No harsh cold blue tones.
— Captions: auto-generate then review for accuracy.
— Beat cuts: gentle, not aggressive — this is a comfort product reel.`,

    caption: `Winter just got warmer. 🖤

The THANKYOU Winter Writing & Comfort Bundle:

🖤 Respect Is Earned Hoodie
📓 Thankyou Journal
🖊️ Thankyou Pen
☕ Thermos Flask

All for $119 — no further discounts apply to this bundle.

Write through the cold. Wear your values. Stay grounded.

→ gannonwaye.com/store

#GannonWaye #WinterBundle #Thankyou #RespectIsEarned #ComfortSeason #WritingBundle #AustralianMusic #IndieArtistMerch #WinterVibes #WritingCommunity`,

    first_comment: `🔗 Direct link: gannonwaye.com/store — The Winter Writing & Comfort Bundle. $119. This one is already priced as a bundle — no further discounts apply. 🖤`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function CopyBlock({ label, content }) {
  const { toast } = useToast();
  const copy = () => {
    navigator.clipboard.writeText(content);
    toast({ title: `${label} copied to clipboard` });
  };
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</p>
        <button type="button" onClick={copy} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors">
          <Copy className="w-3 h-3" /> Copy
        </button>
      </div>
      <pre className="text-[11px] font-body text-foreground/80 bg-secondary/30 border border-border/30 rounded-xl p-3 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{content}</pre>
    </div>
  );
}

function BriefCard({ brief }) {
  const [expanded, setExpanded] = useState(false);
  const [queued, setQueued] = useState(false);
  const { toast } = useToast();
  const Icon = brief.icon;

  const sendToApproval = async () => {
    try {
      await base44.entities.ApprovalQueue.create({
        agent_name: 'content_revenue_agent',
        action_title: `[CONTENT BRIEF] ${brief.label}`,
        action_description: `Type: ${brief.type.toUpperCase()}\nPurpose: ${brief.purpose}\nCTA: ${brief.cta}\n\nCaption:\n${brief.caption}\n\nFirst Comment:\n${brief.first_comment}`,
        risk_type: ['publishing'],
        risk_level: 'low',
        status: 'pending',
        proposed_output: brief.caption,
        auto_eligible: false,
        tags: ['merch', 'content', brief.type, 'thankyou-collection'],
      });
      setQueued(true);
      toast({ title: 'Sent to Approval Queue', description: brief.label });
    } catch (e) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm flex items-start justify-between gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary shrink-0" />
            {brief.label}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-[9px] border-0 ${brief.badgeColor}`}>{brief.badge}</Badge>
            {queued
              ? <Badge className="text-[9px] border-0 bg-green-500/20 text-green-400"><CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />In Approval Queue</Badge>
              : <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={sendToApproval}>
                  <Zap className="w-3 h-3" /> Send to Approval Queue
                </Button>
            }
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 space-y-2">
        <p className="font-body text-xs text-muted-foreground">{brief.purpose}</p>

        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded-md bg-secondary border border-border/30 text-muted-foreground font-body">
            CTA: <strong className="text-foreground">{brief.cta}</strong>
          </span>
          {brief.formats && brief.formats.map(f => (
            <span key={f} className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-body">{f}</span>
          ))}
        </div>

        {brief.hook && (
          <div className="p-3 rounded-xl border border-primary/30 bg-primary/5">
            <p className="font-body text-[10px] uppercase tracking-widest text-primary mb-1">Hook</p>
            <p className="font-display text-sm text-foreground italic">{brief.hook}</p>
          </div>
        )}

        {brief.products && (
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Products Featured</p>
            <div className="space-y-1">
              {brief.products.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-body text-foreground/80">
                  <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-primary hover:text-primary/80 transition-colors font-body mt-1"
        >
          {expanded ? '▲ Hide full brief' : '▼ Show full brief (scenes, captions, CapCut notes)'}
        </button>

        {expanded && (
          <div className="space-y-1 pt-1">
            {brief.overlay_text && (
              <div>
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Overlay Text Plan</p>
                <div className="space-y-1">
                  {brief.overlay_text.map((t, i) => (
                    <p key={i} className="text-[11px] font-body text-foreground/75 pl-2 border-l border-border/30">{t}</p>
                  ))}
                </div>
              </div>
            )}
            {brief.canva_instructions && <CopyBlock label="Canva / Adobe Express Instructions" content={brief.canva_instructions} />}
            {brief.scene_list && <CopyBlock label="CapCut Scene List" content={brief.scene_list} />}
            <CopyBlock label="Caption" content={brief.caption} />
            <CopyBlock label="First Comment" content={brief.first_comment} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MerchContentBriefs() {
  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Content Agent — Merch Campaign</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Merch Content Briefs</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          1 merch advertisement + 3 reels — ready for Canva, CapCut, and Metricool. All approval-gated.
        </p>
      </div>

      {/* Workflow banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { step: '1', label: 'Base44 Agent', detail: 'Briefs, captions, scenes created here', color: 'text-primary', border: 'border-primary/30' },
          { step: '2', label: 'Canva / Adobe Express', detail: 'Create the hero ad (3 formats)', color: 'text-blue-400', border: 'border-blue-500/30' },
          { step: '3', label: 'CapCut', detail: 'Edit the 3 reels (9:16, beat cuts, captions)', color: 'text-purple-400', border: 'border-purple-500/30' },
          { step: '4', label: 'Metricool', detail: 'Schedule only after Gannon approves', color: 'text-green-400', border: 'border-green-500/30' },
        ].map(s => (
          <div key={s.step} className={`p-3 rounded-xl border ${s.border} bg-secondary/10`}>
            <p className={`font-display text-lg font-bold ${s.color}`}>{s.step}</p>
            <p className="font-body text-xs font-semibold text-foreground">{s.label}</p>
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">{s.detail}</p>
          </div>
        ))}
      </div>

      {/* Safety notice */}
      <div className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-muted-foreground">
          <strong className="text-amber-400">Approval-gated.</strong> No content is posted automatically. Use "Send to Approval Queue" on each brief, then approve at{' '}
          <Link to="/admin/approval-queue" className="text-primary underline underline-offset-2">/admin/approval-queue</Link>{' '}
          before scheduling in Metricool.
        </p>
      </div>

      {/* Brand reference */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-xs uppercase tracking-widest text-primary flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5" /> Brand Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <pre className="text-[11px] font-body text-foreground/70 whitespace-pre-wrap leading-relaxed">{BRAND}</pre>
        </CardContent>
      </Card>

      {/* Brief cards */}
      {BRIEFS.map(brief => <BriefCard key={brief.id} brief={brief} />)}

      {/* Footer links */}
      <div className="flex gap-3 flex-wrap pt-2">
        <Link to="/admin/approval-queue">
          <Button type="button" size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" /> Approval Queue</Button>
        </Link>
        <Link to="/admin/social-schedule-queue">
          <Button type="button" size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" /> Schedule Queue</Button>
        </Link>
        <Link to="/admin/metricool-command">
          <Button type="button" size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" /> Metricool</Button>
        </Link>
      </div>
    </div>
  );
}