import React from 'react';
import { ExternalLink, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DESIGNS = [
  {
    title: 'Gannon Waye — Artist Logo',
    description: 'Typographic logo for use across all merchandise, social media, and branding. Gold metallic "GANNON WAYE" on dark background with GW monogram accent. Use this on any product label, tag, or packaging.',
    imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0fac46594_generated_image.png',
    products: [],
    tags: ['Logo', 'Branding', 'All products'],
  },
  {
    title: 'Oversized Tee Design — "Thank You"',
    description: 'Cinematic moody portrait graphic with bold "THANK YOU / GANNON WAYE" typography for the front chest of an oversized heavy cotton tee.',
    imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/75839ab3f_generated_image.png',
    products: [
      {
        label: 'Alibaba — Oversized Heavy Cotton Tee',
        url: 'https://www.alibaba.com/product-detail/High-Quality-100-Cotton-Oversized-Heavy_1601048746639.html',
      },
    ],
    tags: ['Apparel', 'T-Shirt', 'Oversized'],
  },
  {
    title: 'Tote Bag Design — "Thank You"',
    description: 'Single cover inspired artwork adapted for a large folding tote bag. Moody portrait with gold and white typography on dark background.',
    imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/fe7b6b744_generated_image.png',
    products: [
      {
        label: 'Alibaba — Custom Printed Folding Tote Bag',
        url: 'https://www.alibaba.com/product-detail/2022-Custom-Printed-logo-Large-Folding_1600408471779.html',
      },
    ],
    tags: ['Tote Bag', 'Accessory'],
  },
  {
    title: 'Notebook / Journal Design — "Thank You"',
    description: 'Dark matte cover with cinematic portrait artwork, "THANK YOU / GANNON WAYE" in geometric sans-serif, and GW monogram on the spine. Perfect for a branded journal or notebook gift.',
    imageUrl: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/8df1b5d71_generated_image.png',
    products: [
      {
        label: 'Alibaba — Custom Corporate Logo Notebook',
        url: 'https://www.alibaba.com/product-detail/Custom-Corporate-Logo-Promotional-Business-Gift_1601710864383.html',
      },
    ],
    tags: ['Notebook', 'Stationery', 'Gift'],
  },
];

export default function MerchDesigns() {
  const handleDownload = (url, title) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.png`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-foreground">Merch Artwork Designs</h1>
        <p className="font-body text-sm text-muted-foreground mt-2">
          AI-generated designs based on your "Thank You" single cover. Download any image and send it directly to your Alibaba supplier.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {DESIGNS.map((design) => (
          <div key={design.title} className="bg-card border border-border/40 rounded-2xl overflow-hidden flex flex-col">
            {/* Image */}
            <div className="aspect-square bg-secondary/40 overflow-hidden">
              <img
                src={design.imageUrl}
                alt={design.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {design.tags.map(tag => (
                    <span key={tag} className="font-body text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-xl text-foreground">{design.title}</h2>
                <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed">{design.description}</p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <Button
                  variant="outline"
                  className="gap-2 rounded-full font-body text-sm tracking-wider uppercase border-foreground/20 w-full"
                  onClick={() => handleDownload(design.imageUrl, design.title)}
                >
                  <Download className="w-4 h-4" /> Download Design
                </Button>

                {design.products.map(p => (
                  <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="gap-2 rounded-full font-body text-sm tracking-wider uppercase w-full">
                      <ExternalLink className="w-4 h-4" /> {p.label}
                    </Button>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-secondary/30 border border-border/40 rounded-xl p-5">
        <p className="font-body text-sm text-muted-foreground">
          <strong className="text-foreground">How to use these:</strong> Download the design, then send the image file to the Alibaba supplier via their product inquiry or customisation form. Ask them to print it exactly as shown, specifying placement (front chest for tee, front panel for tote/notebook).
        </p>
      </div>
    </div>
  );
}