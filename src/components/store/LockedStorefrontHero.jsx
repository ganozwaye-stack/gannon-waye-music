import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import WorldHotspot from '@/components/store/WorldHotspot';
import ExpressInterestModal from '@/components/store/ExpressInterestModal';
import { formatAudPrice } from '@/lib/liveStoreProducts';

// Hotspot zones are DATA, not code — they live in the StorefrontHotspot entity
// so Gannon can add, move or retire them himself from /admin/store-hotspots as
// new merch comes in, without ever touching this file or the locked photo
// underneath them. A hotspot only ever renders on top of the ONE locked
// artwork below (src/config/storefrontArtLock.js) — every record is filtered
// to that exact lock_id, and never resolved against any other image.

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

  // Owner-directed (10 September 2026): the artwork's top edge must sit flush
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
      aria-label="Permanent Gannon Waye boutique world"
      style={{
        position: 'relative',
        width: '100%',
        // The menu floats over the page and PublicLayout gives main a pt-16 (4rem)
        // top pad. The live-measured nav bottom cancels that pad out exactly, so
        // the top edge of the photo meets the menu's bottom border with zero gap
        // (symmetrical with the screen edge), on desktop and mobile alike.
        marginTop: `calc(${navBottom ?? 62}px - 4rem)`,
        // Owner-directed (10 September 2026): show the ENTIRE original
        // photograph — no cover-crop. The v1 photo already contains the
        // GANNON WAYE neon signage at the top, the full shopfront on both
        // sides, and the CD displays at the bottom; the previous 68vh
        // cover-crop was cutting all three off. The section hugs the image
        // at its natural aspect ratio so nothing is ever cropped again.
        overflow: 'hidden',
        background: '#0a0a0a',
      }}
    >
      <img
        data-testid="locked-storefront-world-image"
        data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
        data-storefront-image-sha256={STOREFRONT_ART_LOCK.imageSha256}
        src={STOREFRONT_ART_LOCK.imageUrl}
        alt="Gannon Waye Boutique, official merchandise store"
        draggable="false"
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: 'auto',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* No text overlay — the artwork carries the GANNON WAYE gold neon
          sign baked into the top of the image itself. Nothing may be
          layered over the artwork. */}

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

      {interestItem && (
        <ExpressInterestModal item={interestItem} onClose={() => setInterestItem(null)} />
      )}
    </section>
  );
}