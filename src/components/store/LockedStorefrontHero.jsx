import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import NeonBrandTitle from '@/components/store/NeonBrandTitle';
import WorldHotspot from '@/components/store/WorldHotspot';
import { formatAudPrice } from '@/lib/liveStoreProducts';

// The jumpers hanging on both sides of the locked boutique artwork are the ONE
// live hoodie record — a single product, never split into front/back listings.
const HOODIE_ZONES = [
  { left: '1%', top: '28%', width: '15%', height: '42%' },
  { left: '84%', top: '28%', width: '15%', height: '42%' },
];

export default function LockedStorefrontHero({ hoodieProduct, onOpenProduct }) {
  const hoodieInStock = hoodieProduct && Number(hoodieProduct.stock_quantity) > 0;
  const hotspotLabel = hoodieInStock
    ? `Respect Is Earned Hoodie — ${formatAudPrice(hoodieProduct.sale_price)} + delivery`
    : '';

  return (
    <section
      data-testid="locked-storefront-world"
      data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
      aria-label="Permanent Gannon Waye boutique world"
      style={{
        position: 'relative',
        width: '100%',
        // The menu floats over the page. Nudge the artwork down so the
        // boutique signage at the top of the image clears it.
        marginTop: '76px',
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

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,14,0.28) 0%, rgba(8,8,14,0.08) 38%, rgba(8,8,14,0.52) 78%, rgba(8,8,14,0.92) 100%)',
        }}
      />

      {/* The name above the boutique — the signage fans see first.
          Name only; no kicker, no subtitle, and never part of the artwork file. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'center',
          padding: 'clamp(18px, 4vh, 44px) 16px 0',
          pointerEvents: 'none',
        }}
      >
        <NeonBrandTitle subtitle="" />
      </div>

      {hoodieInStock && HOODIE_ZONES.map((zone, index) => (
        <WorldHotspot
          key={index}
          zone={zone}
          testId="world-hoodie-hotspot"
          label={hotspotLabel}
          onClick={() => onOpenProduct?.(hoodieProduct)}
        />
      ))}
    </section>
  );
}