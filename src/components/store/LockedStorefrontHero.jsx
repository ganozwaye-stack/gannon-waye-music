import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import NeonBrandTitle from '@/components/store/NeonBrandTitle';

export default function LockedStorefrontHero() {
  return (
    <section
      data-testid="locked-storefront-world"
      data-storefront-lock-id={STOREFRONT_ART_LOCK.lockId}
      aria-label="Permanent Gannon Waye boutique world"
      style={{
        position: 'relative',
        width: '100%',
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

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'center',
          padding: 'clamp(40px, 9vh, 96px) 16px 0',
        }}
      >
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '10px',
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.72)',
            marginBottom: '14px',
          }}
        >
          Boutique · Step Inside
        </p>
        <NeonBrandTitle />
      </div>
    </section>
  );
}
