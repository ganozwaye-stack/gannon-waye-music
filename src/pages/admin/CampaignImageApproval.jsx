import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X, Edit3, Image, AlertTriangle, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

// The 11 uploaded campaign images mapped to their correct days
// Gannon: review each image below and pick the heading/label you want, or write your own.
const CAMPAIGN_IMAGES = [
  {
    id: 'day6_square',
    day: 6,
    dayLabel: '6 DAYS TO RELEASE',
    format: '1:1 Square',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8135235ed_ChatGPTImageMay31202609_50_04AM3.png',
    suggestedHeadingOptions: [
      '6 DAYS TO RELEASE — Respect Is Earned',
      '6 Days — Countdown Announcement Image',
      'Countdown Day 6 — Square Format',
    ],
    notes: 'Large gold 6, Gannon portrait, "RESPECT IS EARNED, NOT A GAME YOU MAKE ME PLAY", silhouette walking, full merch row, www.gannonwaye.com',
  },
  {
    id: 'day6_wide',
    day: 6,
    dayLabel: '6 DAYS TO RELEASE',
    format: '16:9 Wide / Store Banner',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/16d98737c_ChatGPTImageMay31202609_50_05AM4.png',
    suggestedHeadingOptions: [
      '6 Days — Wide Banner / Website Block',
      '6 Days Announcement — Landscape Format',
      'Countdown Day 6 — Wide Store Banner',
    ],
    notes: 'Landscape layout. THANKYOU title left, merch row centre-right, gold GW logo, cinematic studio lighting.',
  },
  {
    id: 'day5_square_a',
    day: 5,
    dayLabel: '5 DAYS TO RELEASE',
    format: '1:1 Square — Version A',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a576a68ed_ChatGPTImageMay31202609_50_03AM1.png',
    suggestedHeadingOptions: [
      '5 Days — Chose Peace Over Toxicity (Merch Square)',
      '5 Days — Official Merch Collection Square',
      'Countdown Day 5 — Square Format A',
    ],
    notes: 'Warm studio lighting. Products arranged symmetrically. "FOR THE ONES WHO CHOSE PEACE OVER TOXICITY."',
  },
  {
    id: 'day5_square_b',
    day: 5,
    dayLabel: '5 DAYS TO RELEASE',
    format: '1:1 Square — Version B',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/a8e4fb2fd_ChatGPTImageMay31202609_50_03AM2.png',
    suggestedHeadingOptions: [
      '5 Days — Official Merch Collection Square (Alt)',
      '5 Days — Dark Studio Product Flat Lay',
      'Countdown Day 5 — Square Format B',
    ],
    notes: 'Slightly darker studio. Products on black surface. Same merch lineup, alternate angle.',
  },
  {
    id: 'day5_portrait',
    day: 5,
    dayLabel: '5 DAYS TO RELEASE',
    format: '9:16 Vertical / IG Reel',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/1cb0386be_ChatGPTImageMay31202609_50_05AM5.png',
    suggestedHeadingOptions: [
      '5 Days — Portrait Reel: "For The Ones Who Said Goodbye To Toxic Family"',
      '5 Days — Gannon Close-Up Portrait Reel',
      'Countdown Day 5 — 9:16 TikTok/Reels',
    ],
    notes: 'Strong Gannon portrait, gold "5 DAYS TO RELEASE", "FOR THE ONES WHO SAID GOODBYE TO TOXIC FAMILY". Merch row bottom.',
  },
  {
    id: 'day4_portrait',
    day: 4,
    dayLabel: '4 DAYS TO RELEASE',
    format: '9:16 Vertical / IG Reel',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/078c01632_ChatGPTImageMay31202609_50_06AM6.png',
    suggestedHeadingOptions: [
      '4 Days — Peace Over Toxicity Portrait Reel',
      '4 Days — Sound Teaser Image: "A Song For The Ones Who Finally Chose Themselves"',
      'Countdown Day 4 — 9:16 TikTok/Reels',
    ],
    notes: 'Large "4 DAYS TO RELEASE", "PEACE OVER TOXICITY" headline. Gannon portrait + silhouette on road. Merch bottom.',
  },
  {
    id: 'day3_portrait',
    day: 3,
    dayLabel: '3 DAYS TO RELEASE',
    format: '9:16 Vertical / IG Reel',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5f20943cd_ChatGPTImageMay31202610_02_21AM2.png',
    suggestedHeadingOptions: [
      '3 Days — "Wear The Message" Merch Reel',
      '3 Days — Store CTA: "THANKYOU is more than a song"',
      'Countdown Day 3 — Merch/Store CTA 9:16',
    ],
    notes: '"3 DAYS TO RELEASE", "WEAR THE MESSAGE". Strong Gannon portrait. Full merch lineup + "MORE THAN MUSIC. IT\'S A MOVEMENT." badge.',
  },
  {
    id: 'day2_portrait',
    day: 2,
    dayLabel: '2 DAYS TO RELEASE',
    format: '9:16 Vertical / IG Reel',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d5b683dc2_ChatGPTImageMay31202610_02_21AM1.png',
    suggestedHeadingOptions: [
      '2 Days — "Goodbye. Release. Self-Worth." Community Reel',
      '2 Days — Engagement Push: "THANKYOU is for the people who walked away"',
      'Countdown Day 2 — 9:16 TikTok/Reels',
    ],
    notes: '"2 DAYS TO RELEASE", "GOODBYE. RELEASE. SELF-WORTH." Gannon portrait. Merch customised with "Goodbye. Release. Self-Worth." text.',
  },
  {
    id: 'day1_square',
    day: 1,
    dayLabel: '1 DAY TO RELEASE',
    format: '1:1 Square',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/36a5180e4_ChatGPTImageMay31202610_02_22AM4.png',
    suggestedHeadingOptions: [
      '1 Day — "THANKYOU TOMORROW" Final Pre-Release Square',
      '1 Day — "For The Ones Who Chose Peace" — Final Push',
      'Countdown Day 1 — 1:1 Instagram Feed',
    ],
    notes: '"1 DAY TO RELEASE", "THANKYOU TOMORROW". Strong Gannon portrait. Full merch row. Road silhouette.',
  },
  {
    id: 'day1_portrait',
    day: 1,
    dayLabel: '1 DAY TO RELEASE',
    format: '9:16 Vertical / IG Reel',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/2bd1f4939_ChatGPTImageMay31202610_02_22AM3.png',
    suggestedHeadingOptions: [
      '1 Day — "THANKYOU TOMORROW" Portrait Reel (Final Push)',
      '1 Day — Pre-Release Urgency: "For The Ones Who Chose Themselves"',
      'Countdown Day 1 — 9:16 Final Push Reel',
    ],
    notes: '"THANKYOU TOMORROW" large. Gold dawn road silhouette. Merch lineup bottom. Same energy as 1 Day square but portrait.',
  },
  {
    id: 'mum_hero',
    day: null,
    dayLabel: 'MUM TRIBUTE PAGE',
    format: 'Hero Image — /mum page',
    url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5f86d8dde_image.png',
    suggestedHeadingOptions: [
      'For My Mum — Hero Image (Sonia Katisa Waye)',
      'Mum Tribute Hero — Memorial Page Main Image',
      'Sonia Living Garden — Page Hero',
    ],
    notes: '"For My Mum" header. Sonia seated with dogs. Gold framed photos around her. Candles & garden. Charity/memorial aesthetic. Three CTA buttons: Share Her Story | Gallery of Memories | Visit Mum\'s Memorial Page.',
  },
];

const DAY_COLORS = {
  6: 'border-primary/50 bg-primary/5',
  5: 'border-blue-500/40 bg-blue-500/5',
  4: 'border-purple-500/40 bg-purple-500/5',
  3: 'border-pink-500/40 bg-pink-500/5',
  2: 'border-cyan-500/40 bg-cyan-500/5',
  1: 'border-green-500/40 bg-green-500/5',
  null: 'border-amber-500/40 bg-amber-500/5',
};

function ImageApprovalCard({ img, onApprove }) {
  const [chosenHeading, setChosenHeading] = useState(null);
  const [customHeading, setCustomHeading] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [approved, setApproved] = useState(false);
  const { toast } = useToast();

  const finalHeading = showCustom ? customHeading : chosenHeading;

  const handleApprove = () => {
    if (!finalHeading) {
      toast({ title: 'Select or write a heading first', variant: 'destructive' });
      return;
    }
    setApproved(true);
    onApprove({ ...img, approvedHeading: finalHeading });
    toast({ title: `✓ Approved: ${finalHeading}` });
  };

  return (
    <Card className={`border ${DAY_COLORS[img.day]} overflow-hidden`}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <Badge className={`text-[10px] tracking-widest uppercase font-body mb-1.5 ${img.day === null ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-primary/20 text-primary border-primary/30'} border`}>
              {img.dayLabel}
            </Badge>
            <CardTitle className="text-sm font-body font-semibold text-foreground">{img.format}</CardTitle>
          </div>
          {approved && (
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 gap-1 text-[10px]">
              <CheckCircle2 className="w-3 h-3" /> Approved
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 space-y-3">
        {/* Image preview */}
        <div className="relative rounded-xl overflow-hidden border border-border/30 bg-black">
          <img
            src={img.url}
            alt={img.dayLabel}
            className="w-full object-contain max-h-72"
            loading="lazy"
          />
          <a
            href={img.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 bg-black/60 rounded-lg p-1.5 text-white/70 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Notes */}
        <div className="bg-secondary/30 rounded-lg px-3 py-2">
          <p className="font-body text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-1">Image Contents</p>
          <p className="font-body text-xs text-foreground/75 leading-relaxed">{img.notes}</p>
        </div>

        {/* Heading selection */}
        <div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Edit3 className="w-3 h-3" /> Choose heading for this image
          </p>

          <div className="space-y-1.5 mb-2">
            {img.suggestedHeadingOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => { setChosenHeading(opt); setShowCustom(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-body transition-all ${
                  chosenHeading === opt && !showCustom
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/40 text-foreground/70 hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {i + 1}. {opt}
              </button>
            ))}
            <button
              onClick={() => { setShowCustom(true); setChosenHeading(null); }}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-body transition-all ${
                showCustom
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              ✏️ Write my own heading
            </button>
          </div>

          {showCustom && (
            <input
              type="text"
              placeholder="Type your heading here..."
              value={customHeading}
              onChange={e => setCustomHeading(e.target.value)}
              className="w-full bg-secondary border border-primary/40 rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          )}
        </div>

        {/* Approve button */}
        <Button
          onClick={handleApprove}
          disabled={approved || (!finalHeading)}
          className={`w-full gap-2 ${approved ? 'bg-green-600 hover:bg-green-700' : 'gradient-gold-button'} border-0`}
        >
          {approved
            ? <><CheckCircle2 className="w-4 h-4" /> Approved — {finalHeading}</>
            : <><CheckCircle2 className="w-4 h-4" /> Approve with selected heading</>
          }
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CampaignImageApproval() {
  const { toast } = useToast();
  const [approvedImages, setApprovedImages] = useState([]);

  const handleApprove = (imgData) => {
    setApprovedImages(prev => {
      const exists = prev.find(a => a.id === imgData.id);
      if (exists) return prev.map(a => a.id === imgData.id ? imgData : a);
      return [...prev, imgData];
    });
  };

  // Group by day
  const campaignImages = CAMPAIGN_IMAGES.filter(i => i.day !== null);
  const mumImage = CAMPAIGN_IMAGES.filter(i => i.day === null);

  const groupedByDay = [6, 5, 4, 3, 2, 1].map(day => ({
    day,
    images: campaignImages.filter(i => i.day === day),
  })).filter(g => g.images.length > 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">THANKYOU Release Campaign</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Campaign Image Approval</h1>
        <p className="font-body text-sm text-muted-foreground mt-1.5 max-w-2xl">
          Each image is shown under the correct campaign day. For every image, pick one of the 3 suggested headings or write your own. Then click Approve. Nothing publishes until you approve.
        </p>
      </div>

      {/* Approved summary */}
      {approvedImages.length > 0 && (
        <div className="bg-green-500/5 border border-green-500/30 rounded-xl p-4">
          <p className="font-body text-sm text-green-400 font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {approvedImages.length} of {CAMPAIGN_IMAGES.length} images approved
          </p>
          <div className="space-y-1">
            {approvedImages.map(a => (
              <p key={a.id} className="font-body text-xs text-foreground/70">
                ✓ <strong>{a.dayLabel}</strong> — {a.format}: <em>"{a.approvedHeading}"</em>
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-amber-300/80">
          All images are currently un-labelled / under wrong headings. Review each one below and pick the heading that fits. Your selections are saved this session — next step is to upload these to the Social Asset Library or Merch Visual Lab once approved.
        </p>
      </div>

      {/* Campaign days */}
      {groupedByDay.map(group => (
        <div key={group.day}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-display text-lg font-bold text-primary">{group.day}</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {group.day === 6 ? '6 Days To Release' :
                 group.day === 5 ? '5 Days To Release' :
                 group.day === 4 ? '4 Days To Release' :
                 group.day === 3 ? '3 Days To Release — Merch Day' :
                 group.day === 2 ? '2 Days To Release — Community Push' :
                 '1 Day To Release — Final Pre-Release'}
              </h2>
              <p className="font-body text-xs text-muted-foreground">
                {group.images.length} image{group.images.length > 1 ? 's' : ''} to review
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.images.map(img => (
              <ImageApprovalCard key={img.id} img={img} onApprove={handleApprove} />
            ))}
          </div>
        </div>
      ))}

      {/* Mum tribute image */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <span className="text-amber-400 text-xl">♡</span>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Mum Tribute — /mum Page</h2>
            <p className="font-body text-xs text-muted-foreground">Hero image for Sonia's memorial page</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mumImage.map(img => (
            <ImageApprovalCard key={img.id} img={img} onApprove={handleApprove} />
          ))}
        </div>
      </div>
    </div>
  );
}