import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, Sparkles, Zap, Package, Lock, Star, Globe, ShoppingBag, Music, Layers } from 'lucide-react';

const SECTIONS = [
  {
    id: 'store-animation',
    icon: ShoppingBag,
    title: 'Store — BigCartel-Style Product Animations',
    priority: 'HIGH',
    color: 'text-primary',
    summary: 'How BigCartel animates products: tilt on hover, floating images, magnetic cursor, reveal-on-scroll.',
    items: [
      {
        title: '3D Product Card Tilt (CSS perspective)',
        desc: 'Cards physically tilt toward the cursor using CSS transform: perspective() rotateX() rotateY(). Creates depth illusion. Already partially implemented via Framer Motion — needs mouse tracking added.',
        effort: 'Low',
        example: 'https://codrops.com/2020/01/15/magnetic-buttons/',
        howto: 'Add onMouseMove handler to ProductCard that calculates tilt angle from cursor position and applies CSS transform.',
      },
      {
        title: 'Floating/Levitating Product Images',
        desc: 'Products slowly float up and down using a breathing animation. Makes static images feel alive. The hoodie image should feel like it\'s weightless.',
        effort: 'Very Low — already in Framer Motion',
        howto: 'Add animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} to product image.',
      },
      {
        title: 'Magnetic Hover Button',
        desc: 'The Add to Cart button follows the cursor magnetically within a radius. Premium artist stores use this.',
        effort: 'Medium',
        example: 'https://codepen.io/aaroniker/pen/ExNBPNB',
        howto: 'Track mouse distance from button center; apply translate proportional to distance when within 80px radius.',
      },
      {
        title: 'Scroll-triggered product reveal with stagger',
        desc: 'Each product card enters the viewport with a staggered animation — currently basic. Should feel like cards are being revealed one by one.',
        effort: 'Very Low — update delay calc',
        howto: 'Already in codebase — increase stagger delay to 0.15s and add scale + opacity combination.',
      },
      {
        title: 'Image parallax inside card on hover',
        desc: 'Product photo shifts slightly inside its container as cursor moves over the card. Creates depth.',
        effort: 'Low',
        howto: 'Track cursor offset within card bounds, apply object-position or transform: translate to the img on mousemove.',
      },
    ],
  },
  {
    id: 'premium-3d',
    icon: Layers,
    title: 'Across The Entire Site — 3D & Premium Elevation',
    priority: 'HIGH',
    color: 'text-blue-400',
    summary: 'Reference sites to benchmark against and specific techniques to add.',
    items: [
      {
        title: 'Awwwards.com reference sites for music artists',
        desc: 'Benchmark sites: Noah Kahan, Boygenius, FKA Twigs, Lil Uzi Vert. All use immersive scroll-driven 3D.',
        effort: 'Reference only',
        example: 'https://www.awwwards.com/sites/lil-uzi-vert',
        howto: 'Study scroll-driven WebGL backgrounds. Three.js particle fields on homepage hero would elevate the site immediately.',
      },
      {
        title: 'Three.js Gold Particle Field (Homepage hero)',
        desc: 'Replace the static pollen dots with a proper Three.js WebGL particle system — thousands of gold/amber particles reacting to scroll and mouse. Already have Three.js installed.',
        effort: 'Medium (2-3 hours)',
        howto: 'Create a Three.js canvas overlay on the hero section. Particles drift and respond to mouse position using raycasting.',
      },
      {
        title: 'GSAP ScrollTrigger on every section',
        desc: 'Currently using Framer Motion whileInView. GSAP ScrollTrigger is more performant and allows pinned sections, scrub-based animations, and horizontal scroll sequences. Already have GSAP installed.',
        effort: 'Medium — systematic replacement',
        example: 'https://gsap.com/showcase/',
        howto: 'Replace viewport-triggered reveals with ScrollTrigger.create() scenes. Pin the hero. Scrub text reveal on names.',
      },
      {
        title: 'CSS glassmorphism panels (not cards)',
        desc: 'Current cards look flat. True glassmorphism with backdrop-filter: blur(24px), transparency layering, and border gradients creates luxury.',
        effort: 'Low — CSS update',
        howto: 'Update bg-card/30 + backdrop-blur-sm to backdrop-filter: blur(24px) saturate(180%), border: 1px solid rgba(255,255,255,0.08).',
      },
      {
        title: 'Horizontal scroll music section',
        desc: 'Instead of stacked releases, a pinned horizontal scroll through music releases like Apple Music store. Very premium.',
        effort: 'Medium',
        example: 'https://gsap.com/docs/v3/Plugins/ScrollTrigger/?page=1#horizontal-scroll',
        howto: 'GSAP ScrollTrigger horizontal carousel — pin the Music page, scroll X on vertical scroll.',
      },
    ],
  },
  {
    id: 'missing-features',
    icon: Zap,
    title: 'Features You Asked About — Not Yet Built',
    priority: 'HIGH',
    color: 'text-yellow-400',
    summary: 'Explicit requests from previous conversations that are tracked but not implemented.',
    items: [
      {
        title: 'Slideshow Image Extractor (from MUM SLIDESHOW PICTURES 1.mp4)',
        desc: 'Tool to detect scene changes in the funeral slideshow video and extract each photo into the Unassigned Memories Queue. Requires FFmpeg or similar — cannot run in browser.',
        effort: 'Medium — backend function',
        howto: 'Create a Deno backend function that calls an external FFmpeg API (e.g. api.video, Cloudinary Video Intelligence) to extract frames at scene changes and return URLs. Then admin assigns each to a memorial section.',
      },
      {
        title: 'Memory Timeline (admin-managed)',
        desc: 'The SoniaTimeline component is built but uses hardcoded data. Should be a database entity — MemoryTimelineEvent — so you can add/edit/delete timeline moments from admin.',
        effort: 'Low — new entity + admin CRUD page',
        howto: 'Create MemoryTimelineEvent entity with fields: year, title, story, icon, quote. Build /admin/memorial-timeline CRUD page.',
      },
      {
        title: 'Fan Newsletter — Enable & send',
        desc: 'EmailSubscriber entity exists. Newsletter admin page exists. But the actual send button and send function may not be fully wired. Verify and test.',
        effort: 'Low — audit existing function',
        howto: 'Go to /admin/newsletter — verify the send functionality works end-to-end with a test subscriber.',
      },
      {
        title: 'Inventory Alerts — Low stock notifications',
        desc: 'notifyAdminLowStock function exists but the threshold trigger needs to be set up as an entity automation on MerchProduct updates.',
        effort: 'Very Low — create automation',
        howto: 'Create entity automation: when MerchProduct stock_quantity < 5, fire notifyAdminLowStock.',
      },
      {
        title: 'Educational Course / Training Content (public)',
        desc: 'TrainingModule entity and TrainingCentre admin page exist. But there is no public-facing course/lesson page for fans or students.',
        effort: 'Medium — new public page',
        howto: 'Create /training or /learn public page that lists published TrainingModules by category with lesson content, video embeds, and practice prompts.',
      },
    ],
  },
  {
    id: 'print-on-demand',
    icon: Package,
    title: 'Print-On-Demand Poster Setup',
    priority: 'MEDIUM',
    color: 'text-green-400',
    summary: 'How to sell the Respect Is Earned wall poster with zero inventory risk.',
    items: [
      {
        title: 'Gelato.com — Best for Australia',
        desc: 'Gelato has AU print facilities. A3 approx $8-12 cost → sell at $25-35. A2 approx $14-18 → sell at $35-49. A1 approx $22-28 → sell at $55-75. Fully automated — customer orders, Gelato prints and ships direct.',
        effort: 'Setup: 1-2 hours',
        example: 'https://www.gelato.com/au/print-on-demand/posters',
      },
      {
        title: 'Printful.com — US/EU focused, ships to AU',
        desc: 'Higher quality paper options. Slower AU delivery (10-14 days). Cost is USD ~$12-25 depending on size. Good for premium framed prints.',
        effort: 'Setup: 1-2 hours',
        example: 'https://www.printful.com/custom/posters',
      },
      {
        title: 'Integration method',
        desc: 'Both Gelato and Printful offer a manual order API. When a customer orders a poster, a Stripe webhook triggers a backend function that calls the Gelato/Printful API to place the print order automatically. No manual work required.',
        effort: 'Medium — backend function',
        howto: 'Create forwardPosterOrder backend function. Triggered by onNewOrderAutomation when item category === poster.',
      },
    ],
  },
  {
    id: 'security',
    icon: Lock,
    title: 'Memorial Page Lock Status',
    priority: 'DONE',
    color: 'text-green-400',
    summary: 'Memorial pages /mum and /without-you-here now require authentication. Auth is enforced at the AuthContext level.',
    items: [
      {
        title: 'Status: LOCKED',
        desc: '/mum and /without-you-here now require the user to be logged in. Unauthenticated visitors are redirected to the login page.',
        effort: 'Complete',
        howto: 'AuthContext.jsx updated: AUTH_REQUIRED_PATH_PREFIXES now includes /mum and /without-you-here.',
      },
      {
        title: 'To de-index from Google',
        desc: 'Add <meta name="robots" content="noindex,nofollow" /> to the MumTribute page. Even though it requires auth, Google may still index the URL if linked anywhere.',
        effort: 'Very Low',
        howto: 'Add to MumTribute.jsx: import Helmet or add to index.html with route-specific logic.',
      },
    ],
  },
  {
    id: 'premium-sites',
    icon: Star,
    title: 'Reference Sites — Premium Artist Web Design',
    priority: 'REFERENCE',
    color: 'text-purple-400',
    summary: 'Sites to show you what is possible. All built with similar tech stack (React/GSAP/Three.js).',
    items: [
      { title: 'FKA Twigs', desc: 'Immersive full-screen 3D with WebGL shaders. The gold standard for artist sites.', example: 'https://fkatwigs.com' },
      { title: 'Radiohead — Kid A Mnesia Exhibition', desc: 'WebGL 3D environment. Scroll through the world.', example: 'https://www.kidamnesia.com' },
      { title: 'Resn.co.nz (Agency)', desc: 'Best WebGL interactive site agency. Shows what\'s possible.', example: 'https://resn.co.nz' },
      { title: 'Bruno Simon — 3D portfolio', desc: 'Full Three.js world. Drive a car through a portfolio. Shows what Three.js can do.', example: 'https://bruno-simon.com' },
      { title: 'Awwwards Music Category', desc: 'Curated best music artist sites globally.', example: 'https://www.awwwards.com/websites/music/' },
      { title: 'Codrops — CSS & Animation inspiration', desc: 'Specific tutorials for tilt effects, magnetic buttons, scroll reveals.', example: 'https://tympanus.net/codrops/' },
    ],
  },
];

const PRIORITY_COLORS = {
  HIGH: 'bg-red-500/15 text-red-400 border-red-500/30',
  MEDIUM: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  DONE: 'bg-green-500/15 text-green-400 border-green-500/30',
  REFERENCE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

export default function SiteUpgradeAudit() {
  const [open, setOpen] = useState({});

  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-3xl text-foreground">Site Upgrade Audit</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Everything recommended, everything missing, and how to action each item.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'High Priority', count: SECTIONS.filter(s => s.priority === 'HIGH').length, color: 'text-red-400' },
          { label: 'Medium', count: SECTIONS.filter(s => s.priority === 'MEDIUM').length, color: 'text-yellow-400' },
          { label: 'Completed', count: SECTIONS.filter(s => s.priority === 'DONE').length, color: 'text-green-400' },
          { label: 'Reference', count: SECTIONS.filter(s => s.priority === 'REFERENCE').length, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/40 rounded-xl p-4">
            <p className={`font-display text-2xl ${s.color}`}>{s.count}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const Icon = section.icon;
        const isOpen = open[section.id];
        return (
          <motion.div key={section.id} layout
            className="bg-card border border-border/40 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${section.color}`} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-base text-foreground">{section.title}</p>
                    <span className={`font-body text-[9px] tracking-[0.15em] uppercase border rounded-full px-2 py-0.5 ${PRIORITY_COLORS[section.priority]}`}>
                      {section.priority}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{section.summary}</p>
                </div>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 space-y-3 border-t border-border/30 pt-4">
                    {section.items.map((item, i) => (
                      <div key={i} className="bg-secondary/20 rounded-xl p-4 space-y-2">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <p className="font-display text-sm text-foreground">{item.title}</p>
                          {item.effort && (
                            <span className="font-body text-[9px] tracking-wide uppercase border border-border/50 rounded-full px-2 py-0.5 text-muted-foreground shrink-0">
                              Effort: {item.effort}
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                        {item.howto && (
                          <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                            <p className="font-body text-[10px] text-primary/70 leading-relaxed">
                              <span className="text-primary font-medium">How to action: </span>{item.howto}
                            </p>
                          </div>
                        )}
                        {item.example && (
                          <a href={item.example} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-body text-[10px] text-primary hover:text-primary/80 underline">
                            <ExternalLink className="w-3 h-3" /> View reference / docs
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      <p className="text-center font-body text-xs text-muted-foreground/40 pb-8">
        Audit generated 14 Jun 2026 · gannonwaye.com
      </p>
    </div>
  );
}