import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PLATFORMS = [
  {
    name: 'Printful',
    url: 'https://www.printful.com',
    description: 'High-quality on-demand printing. Integrates with Shopify, Etsy & more. Great for apparel, posters, and accessories.',
    tags: ['Dropship', 'No minimums', 'Global shipping'],
    recommended: true,
  },
  {
    name: 'Printify',
    url: 'https://printify.com',
    description: 'Large network of print providers worldwide. Often cheaper than Printful. Wide product range.',
    tags: ['Dropship', 'No minimums', 'Competitive pricing'],
    recommended: true,
  },
  {
    name: 'Spring (Teespring)',
    url: 'https://www.sprisng.com',
    description: 'Built for creators & musicians. Sell directly via a storefront link — no separate store needed.',
    tags: ['Creator-focused', 'Free storefront', 'Music merch'],
    recommended: true,
  },
  {
    name: 'Redbubble',
    url: 'https://www.redbubble.com',
    description: 'Upload your art once, fans buy on-demand. Good for stickers, prints, phone cases.',
    tags: ['Marketplace', 'Passive income', 'Wide products'],
    recommended: false,
  },
  {
    name: 'Merch by Amazon',
    url: 'https://merch.amazon.com',
    description: 'Sell your designs on Amazon with no upfront cost. Requires approval — best for t-shirts.',
    tags: ['Amazon reach', 'Approval required', 'T-shirts'],
    recommended: false,
  },
  {
    name: 'Spreadshirt',
    url: 'https://www.spreadshirt.com',
    description: 'Design and sell custom merch. Has a marketplace and your own shop option.',
    tags: ['Dropship', 'EU & US', 'Marketplace'],
    recommended: false,
  },
  {
    name: 'GOOTEN',
    url: 'https://www.gooten.com',
    description: 'Enterprise-grade print-on-demand. Good for scaling up with consistent quality.',
    tags: ['Dropship', 'Scalable', 'API integrations'],
    recommended: false,
  },
  {
    name: 'Gelato',
    url: 'https://www.gelato.com',
    description: 'Prints locally in 32 countries — faster delivery, lower carbon footprint. Great quality.',
    tags: ['Dropship', 'Global local print', 'Eco-friendly'],
    recommended: true,
  },
  {
    name: 'Vistaprint',
    url: 'https://www.vistaprint.com.au',
    description: 'Best for bulk physical orders you ship yourself — business cards, stickers, posters, apparel.',
    tags: ['Bulk orders', 'Self-fulfil', 'Australia'],
    recommended: false,
  },
  {
    name: 'Canva Merch',
    url: 'https://www.canva.com/print/',
    description: 'Design and print directly from Canva. Great if you already use Canva for artwork.',
    tags: ['Design + print', 'Easy', 'Self-fulfil'],
    recommended: false,
  },
  {
    name: 'Teelaunch',
    url: 'https://www.teelaunch.com',
    description: 'Budget-friendly POD with low prices. Great for basic apparel and bulk orders.',
    tags: ['Budget', 'Low cost', 'Dropship'],
    recommended: true,
  },
  {
    name: 'Prodigi (formerly Prodigi)',
    url: 'https://www.prodigi.com',
    description: 'Affordable on-demand with global print partners. Lower prices than competitors.',
    tags: ['Budget', 'Affordable', 'Global'],
    recommended: true,
  },
  {
    name: 'Kunaki',
    url: 'https://www.kunaki.com',
    description: 'Cheap CD/DVD duplication and physical media manufacturing. Perfect for indie musicians.',
    tags: ['CDs', 'DVDs', 'Budget manufacturing'],
    recommended: true,
  },
  {
    name: 'DiscMakers',
    url: 'https://www.discmakers.com',
    description: 'Professional CD and vinyl manufacturing. Competitive pricing for physical music releases.',
    tags: ['CDs', 'Vinyl', 'Music manufacturing'],
    recommended: true,
  },
  {
    name: 'CD Baby',
    url: 'https://www.cdbaby.com',
    description: 'Sell your music on all platforms + physical CDs. Distribution + manufacturing combined.',
    tags: ['Music distribution', 'Physical CDs', 'All stores'],
    recommended: true,
  },
  {
    name: 'Alibaba',
    url: 'https://www.alibaba.com',
    description: 'Source custom merchandise directly from manufacturers at rock-bottom wholesale prices. Order branded apparel, accessories, and more with your own designs. Minimum order quantities apply but per-unit cost is extremely cheap.',
    tags: ['Wholesale', 'Bulk orders', 'Ultra cheap', 'Self-fulfil'],
    recommended: true,
  },
  {
    name: 'AliExpress',
    url: 'https://www.aliexpress.com',
    description: 'Alibaba\'s retail arm — lower minimums, sometimes no minimums. Great for sampling products before committing to a bulk Alibaba order. Many suppliers offer custom print and branding.',
    tags: ['Low minimums', 'Custom print', 'Cheap', 'Self-fulfil'],
    recommended: true,
  },
  {
    name: 'Faire',
    url: 'https://www.faire.com',
    description: 'Wholesale marketplace connecting independent brands with manufacturers. Good for unique, boutique-style merch at wholesale prices with smaller order runs.',
    tags: ['Wholesale', 'Independent brands', 'Low MOQ'],
    recommended: false,
  },
  {
    name: 'DHgate',
    url: 'https://www.dhgate.com',
    description: 'Chinese wholesale marketplace similar to Alibaba with lower minimums. Great for custom clothing, accessories, and promotional items at very low cost.',
    tags: ['Wholesale', 'Ultra cheap', 'Low MOQ', 'Custom'],
    recommended: true,
  },
  {
    name: 'Zazzle',
    url: 'https://www.zazzle.com',
    description: 'Upload designs, sell on-demand or order for yourself at discounted creator rates. Wide range of products from apparel to homewares.',
    tags: ['On-demand', 'Creator discount', 'Wide range'],
    recommended: false,
  },
  {
    name: 'Apliiq',
    url: 'https://www.apliiq.com',
    description: 'Private label clothing manufacturer specialising in custom streetwear and cut-and-sew pieces. Low minimums and high-quality finished garments with your own labels.',
    tags: ['Private label', 'Streetwear', 'Low MOQ', 'Premium'],
    recommended: false,
  },
  {
    name: 'Sticker Mule',
    url: 'https://www.stickermule.com',
    description: 'Cheap, fast, high-quality custom stickers, buttons, packaging, and branded merchandise. Popular with musicians for affordable fan merch add-ons.',
    tags: ['Stickers', 'Buttons', 'Affordable', 'Fast shipping'],
    recommended: true,
  },
];

export default function MerchPlatforms() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Merch Platforms</h1>
        <p className="font-body text-sm text-muted-foreground mt-2">
          Click any platform to open it, design your products, and order to sell. Recommended picks are highlighted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PLATFORMS.map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className={`bg-card border-border/40 h-full transition-all group-hover:border-primary/40 group-hover:shadow-lg ${p.recommended ? 'border-primary/20' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </CardTitle>
                    {p.recommended && (
                      <Badge className="bg-primary/20 text-primary border-0 text-[10px] tracking-wider uppercase">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                </div>
                <CardDescription className="font-body text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-body text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}