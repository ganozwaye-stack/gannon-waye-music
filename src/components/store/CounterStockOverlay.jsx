// Owner-directed (10 September 2026): the Winter Warmer Writing Bundle stock
// photo the owner supplied sits ON TOP of the central counter of the locked
// boutique artwork. This is a pure CSS overlay — the locked photograph is
// never edited, regenerated or cropped, and the wooden counter stays
// untouched underneath. Explicitly permitted by the owner for this exact
// spot; nothing else may cover the artwork.

const STOCK_IMAGE_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/e65af171b_WinterWarmerwritingbundle.png';

// Placement over the locked frame, as % of its width — one block so it can
// be nudged in one place when the owner wants it moved or resized.
const PLACEMENT = { left: 30, top: 42, width: 32 };

export default function CounterStockOverlay() {
  return (
    <img
      src={STOCK_IMAGE_URL}
      alt="Gannon Waye Winter Warmer Writing Bundle stock display on the boutique counter"
      draggable="false"
      data-testid="counter-stock-overlay"
      style={{
        position: 'absolute',
        left: `${PLACEMENT.left}%`,
        top: `${PLACEMENT.top}%`,
        width: `${PLACEMENT.width}%`,
        borderRadius: '12px',
        boxShadow: '0 14px 40px rgba(0, 0, 0, 0.6)',
        zIndex: 1,
        // clicks pass through to the product hotspot circles underneath
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  );
}