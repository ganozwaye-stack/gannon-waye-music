import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Package, Printer, CheckCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const POSTER_SIZES = [
  { size: 'A4 (210×297mm)', printCost: '~$4–6', retail: 25, margin: '~$19–21', popular: false },
  { size: 'A3 (297×420mm)', printCost: '~$7–12', retail: 35, margin: '~$23–28', popular: true },
  { size: 'A2 (420×594mm)', printCost: '~$12–18', retail: 55, margin: '~$37–43', popular: false },
  { size: 'A1 (594×841mm)', printCost: '~$20–30', retail: 75, margin: '~$45–55', popular: false },
  { size: '50×70cm (Standard Frame)', printCost: '~$15–22', retail: 65, margin: '~$43–50', popular: false },
];

const POD_OPTIONS = [
  {
    name: 'Printful',
    url: 'https://www.printful.com',
    model: 'Print-on-demand — they print and ship direct to customer',
    pros: ['No stock to hold', 'Integrates with Shopify/WooCommerce', 'Ships globally', 'Premium matte & gloss finish'],
    cons: ['Lower margin than bulk', 'Your branding on packing slip (can be customised)'],
    setup: 'Upload your poster artwork → set sizes + prices → embed in your store. Customer orders → Printful prints & ships automatically. You never touch it.',
    cost: 'A3 matte: ~USD $8–12 per unit',
    recommended: true,
  },
  {
    name: 'Printify',
    url: 'https://www.printify.com',
    model: 'Print-on-demand — multiple print partners, competitive pricing',
    pros: ['Often cheaper than Printful', 'Wide range of Australian print partners', 'Good quality control'],
    cons: ['Quality varies slightly between print partners', 'Need to select partner per product'],
    setup: 'Similar to Printful. Upload artwork → connect to store → orders automated.',
    cost: 'A3 matte: ~USD $6–10 per unit',
    recommended: false,
  },
  {
    name: 'Canva Print (via Canva)',
    url: 'https://www.canva.com/print',
    model: 'You order bulk from Canva, you ship manually',
    pros: ['Easy design + order', 'Good Australian pricing', 'High quality finishes'],
    cons: ['Manual fulfilment — you pack and post', 'Not automated'],
    setup: 'Design in Canva → Order print run → Store at home → Ship manually when ordered.',
    cost: 'A3: ~AUD $12–18 per unit (bulk)',
    recommended: false,
  },
  {
    name: 'Redbubble / Teepublic',
    url: 'https://www.redbubble.com',
    model: 'Third-party marketplace — they handle everything',
    pros: ['Zero setup cost', 'Fully automated', 'Global reach'],
    cons: ['Lower margins', 'You lose brand control', 'Traffic goes to their platform not yours'],
    setup: 'Upload artwork to Redbubble → set base price markup → share your product URL. Passive only — not recommended as primary.',
    cost: 'You earn markup %, typically AUD $8–20 per poster sold',
    recommended: false,
  },
];

export default function StorePoster() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen relative" style={{ background: '#020802' }}>
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/6591fa60b_generated_image.png"
          alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.15) saturate(0.8)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(2,5,2,0.92) 0%, rgba(2,5,2,0.70) 50%, rgba(2,5,2,0.92) 100%)' }} />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="font-body text-[9px] tracking-[0.55em] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.40)' }}>
            Official Print
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-3">
            Thankyou "Respect is Earned"<br />
            <span className="font-display italic" style={{ color: 'rgba(212,175,55,0.7)' }}>Wall Poster</span>
          </h1>
          <p className="font-body text-sm max-w-md mx-auto" style={{ color: 'rgba(245,235,200,0.40)' }}>
            Assorted sizes. Printed and shipped directly to you. No stock held. No waiting.
          </p>
        </motion.div>

        {/* Pricing table */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h2 className="font-display text-xl text-foreground mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Sizing & Pricing
          </h2>
          <div className="space-y-2">
            {POSTER_SIZES.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{
                  border: `1px solid ${row.popular ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  background: row.popular ? 'rgba(212,175,55,0.06)' : 'rgba(5,8,5,0.60)',
                }}>
                <div className="flex items-center gap-3">
                  {row.popular && <span className="font-body text-[8px] tracking-wider uppercase border border-primary/40 rounded-full px-2 py-0.5 text-primary bg-primary/10">Popular</span>}
                  <p className="font-body text-sm text-foreground">{row.size}</p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-wider text-muted-foreground">Print Cost</p>
                    <p className="font-body text-xs text-muted-foreground/70">{row.printCost}</p>
                  </div>
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-wider text-muted-foreground">Retail Price</p>
                    <p className="font-display text-lg gradient-gold-glow">${row.retail}</p>
                  </div>
                  <div>
                    <p className="font-body text-[9px] uppercase tracking-wider text-muted-foreground">Your Margin</p>
                    <p className="font-body text-xs text-green-400">{row.margin}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-xs text-muted-foreground/50 mt-2 flex items-center gap-1.5">
            <Info className="w-3 h-3" /> Costs are estimates based on current Printful/Printify pricing. Margins are after print cost, before shipping. Shipping is charged to the customer separately.
          </p>
        </motion.div>

        {/* Fulfilment options */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-xl text-foreground mb-5 flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" /> How Customers Can Order
          </h2>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(245,235,200,0.45)' }}>
            The recommended approach: print-on-demand (POD). Customer orders on your store → the print partner prints and ships direct → you never touch inventory.
          </p>
          <div className="space-y-4">
            {POD_OPTIONS.map((opt, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{ border: `1px solid ${opt.recommended ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.07)'}`, background: 'rgba(5,8,5,0.80)' }}>
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex items-center gap-3">
                    {opt.recommended && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                    <div>
                      <p className="font-display text-base text-foreground">{opt.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{opt.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {opt.recommended && <span className="font-body text-[9px] tracking-wider uppercase border border-green-500/40 rounded-full px-2 py-0.5 text-green-400 bg-green-500/10">Recommended</span>}
                    <span className="text-muted-foreground text-sm">{expanded === i ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expanded === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 space-y-3 border-t border-border/20">
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-body text-[9px] tracking-wider uppercase text-green-400 mb-1">Pros</p>
                        <ul className="space-y-1">
                          {opt.pros.map((p, j) => <li key={j} className="font-body text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-green-400 mt-0.5">✓</span>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="font-body text-[9px] tracking-wider uppercase text-red-400 mb-1">Cons</p>
                        <ul className="space-y-1">
                          {opt.cons.map((p, j) => <li key={j} className="font-body text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-red-400 mt-0.5">×</span>{p}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-lg p-3 mt-2" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
                      <p className="font-body text-[9px] tracking-wider uppercase text-primary mb-1">How it works</p>
                      <p className="font-body text-xs text-foreground/70">{opt.setup}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-body text-xs text-muted-foreground"><span className="text-primary">Cost estimate:</span> {opt.cost}</p>
                      <a href={opt.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 font-body text-xs tracking-wider uppercase rounded-full px-4 py-1.5 transition-all"
                        style={{ border: '1px solid rgba(212,175,55,0.30)', color: 'rgba(212,175,55,0.70)' }}>
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl text-center"
          style={{ border: '1px solid rgba(212,175,55,0.20)', background: 'rgba(212,175,55,0.04)' }}>
          <p className="font-display text-lg text-foreground mb-2">Ready to Add Posters to the Store?</p>
          <p className="font-body text-sm mb-4" style={{ color: 'rgba(245,235,200,0.45)' }}>
            Tell Base44 to integrate Printful — we can connect your store to Printful's API so poster orders are fully automated. No manual work.
          </p>
          <Link to="/store">
            <button className="rounded-full font-body text-xs tracking-wider uppercase px-8 py-2.5 gradient-gold-button">
              Back to Store
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}