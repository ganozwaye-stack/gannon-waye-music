import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { STOREFRONT_ART_LOCK, BOUTIQUE_HERO_IMAGE } from '@/config/storefrontArtLock';
import WorldHotspot from '@/components/store/WorldHotspot';
import ExpressInterestModal from '@/components/store/ExpressInterestModal';
import { formatAudPrice } from '@/lib/liveStoreProducts';

// Hotspot zones are DATA, not code — they live in the StorefrontHotspot entity
// so Gannon can add, move or retire them himself from /admin/merch-visual-lab as
// new merch comes in, without ever touching this file or the locked photo
// underneath them. A hotspot only ever renders on top of the ONE locked
// artwork below (src/config/storefrontArtLock.js) — every record is filtered
// to that exact lock_id, and never resolved against any other image.
//
// v6 (owner-directed, 26 October 2026): the hero shows Gannon Waye Music
// merchandise only — no Thanking You Kindly brand items, no tribute pieces and
// no TYK campaign posters. This is the standing brand-separation rule.

export default function LockedStorefrontHero({ products = [], onOpenProduct }) {
  const { data: hotspots } = useQuery({
    queryKey: ['storefrontHotspots', STOREFRONT_ART_LOCK.lockId],
    queryFn: () => base44.entities.StorefrontHotspot.filter(
      { lock_id: STOREFRONT_ART_LOCK.lockId, active: true },
      'sort_order'
    ),
    staleTime: 60_000,
  });

  // Fail closed, same as the product grid below: a hotspot with no matching
  // live product (wrong id, unpublished, or the query hasn't landed yet)
  // simply doesn't render. Never invent a product or a price for it.
  const activeHotspots = Array.isArray(hotspots) ? hotspots : [];
  const resolvedHotspots = activeHotspots
    .map((hotspot) => {
      const zone = {
        left: `${hotspot.left_pct}%`,
        top: `${hotspot.top_pct}%`,
        width: `${hotspot.width_pct}%`,
        height: `${hotspot.height_pct}%`,
      };
      // Pre-design items have no live product: the hotspot collects Express
      // Interest instead of selling. Fails closed without an item name.
      if (hotspot.hotspot_mode === 'interest') {
        const itemName = String(hotspot.interest_item_name || '').trim();
        if (!itemName) return null;
        return {
          id: hotspot.id,
          zone,
          label: hotspot.label_override || `${itemName} — Express Interest`,
          interest: {
            key: hotspot.interest_item_key || hotspot.zone_key,
            name: itemName,
          },
        };
      }
      // Product hotspots fail closed exactly as before: no matching live,
      // in-stock product means the zone never renders.
      const product = products.find((p) => p.id === hotspot.product_id);
      const inStock = product && Number(product.stock_quantity) > 0;
      if (!inStock) return null;
      return {
        id: hotspot.id,
        zone,
        label: hotspot.label_override || `${product.name} — ${formatAudPrice(product.sale_price)} + delivery`,
        product,
      };
    })
    .filter(Boolean);

  // Owner-directed (10 September 2026): the hero's top edge must sit flush
  // against the bottom border of the floating menu bar — no black strip between
  // them. The menu is fixed with a responsive height, so its bottom edge is
  // measured live on mount and on resize.
  const [navBottom, setNavBottom] = useState(null);
  const [interestItem, setInterestItem] = useState(null);
  useEffect(() => {
    const nav = document.querySelector('nav');
    const measure = () => {
      if (nav) setNavBottom(nav.offsetTop + nav.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <section
      data-testid="locked-storefront-world"
      data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
      aria-label="Gannon Waye Music official merchandise"
      style={{
        position: 'relative',
        width: '100%',
        // The menu floats over the page and PublicLayout gives main a pt-16 (4rem)
        // top pad, so the live-measured nav bottom cancels that pad out exactly
        // and the hero meets the menu's bottom border with no gap.
        marginTop: `calc(${navBottom ?? 62}px - 4rem)`,
        background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '72rem',
          margin: '0 auto',
          padding: '2rem 1rem 2.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* The one locked piece of artwork. Hotspot zones are positioned against
            this exact image box, which is also what the owner records them on in
            /admin/merch-visual-lab. */}
        <div
          style={{
            position: 'relative',
            flex: '1 1 320px',
            minWidth: '260px',
            maxWidth: '520px',
            margin: '0 auto',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid rgba(212, 175, 55, 0.28)',
            background: 'radial-gradient(ellipse at 50% 32%, rgba(212,175,55,0.16) 0%, rgba(10,10,10,0) 62%), #0d0d0d',
            boxShadow: '0 0 60px rgba(212, 175, 55, 0.10)',
          }}
        >
          <img
            data-testid="locked-storefront-world-image"
            data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
            data-storefront-image-sha256={STOREFRONT_ART_LOCK.imageSha256}
            src={BOUTIQUE_HERO_IMAGE}
            alt={STOREFRONT_ART_LOCK.imageAlt}
            draggable="false"
            style={{
              position: 'relative',
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: '60vh',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          />

          {resolvedHotspots.map((hotspot) => (
            <WorldHotspot
              key={hotspot.id}
              zone={hotspot.zone}
              testId={hotspot.product ? 'world-hoodie-hotspot' : 'world-interest-hotspot'}
              label={hotspot.label}
              onClick={() =>
                hotspot.product
                  ? onOpenProduct?.(hotspot.product)
                  : setInterestItem(hotspot.interest)
              }
            />
          ))}
        </div>

        {/* Brand copy. Sits beside the artwork, never over it. */}
        <div style={{ flex: '1 1 260px', minWidth: '240px' }}>
          <p className="font-body text-[10px] tracking-[0.32em] uppercase text-primary/70 mb-3">
            Official merchandise
          </p>
          <h2 className="font-display text-4xl md:text-5xl gradient-gold-text leading-tight mb-3">
            Gannon Waye
          </h2>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary/80 mb-4">
            Carry the message
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed">
            Independent, heart-first music, and merchandise that carries the message. Every piece in the store below is verified, in stock and ready to ship.
          </p>
        </div>
      </div>

      {interestItem && (
        <ExpressInterestModal item={interestItem} onClose={() => setInterestItem(null)} />
      )}
    </section>
  );
}