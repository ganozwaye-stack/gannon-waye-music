import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import WorldHotspot from '@/components/store/WorldHotspot';
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
      const product = products.find((p) => p.id === hotspot.product_id);
      const inStock = product && Number(product.stock_quantity) > 0;
      if (!inStock) return null;
      return {
        id: hotspot.id,
        zone: {
          left: `${hotspot.left_pct}%`,
          top: `${hotspot.top_pct}%`,
          width: `${hotspot.width_pct}%`,
          height: `${hotspot.height_pct}%`,
        },
        label: hotspot.label_override || `${product.name} — ${formatAudPrice(product.sale_price)} + delivery`,
        product,
      };
    })
    .filter(Boolean);

  return (
    <section
      data-testid="locked-storefront-world"
      data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
      aria-label="Permanent Gannon Waye boutique world"
      style={{
        position: 'relative',
        width: '100%',
        // The menu floats over the page (fixed, top-3 + its own ~46-50px height,
        // measured live on desktop and mobile). This clears its bottom edge with a
        // couple of px to spare — the artwork sits right under the banner with no
        // dead gap, and never renders underneath / behind the nav.
        marginTop: '62px',
        height: '68vh',
        minHeight: '480px',
        maxHeight: '780px',
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
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* No text overlay — the v2 artwork carries the GANNON WAYE gold neon
          sign baked into the top of the image itself (owner-directed update,
          9 September 2026). Nothing may be layered over the artwork. */}

      {resolvedHotspots.map((hotspot) => (
        <WorldHotspot
          key={hotspot.id}
          zone={hotspot.zone}
          testId="world-hoodie-hotspot"
          label={hotspot.label}
          onClick={() => onOpenProduct?.(hotspot.product)}
        />
      ))}
    </section>
  );
}