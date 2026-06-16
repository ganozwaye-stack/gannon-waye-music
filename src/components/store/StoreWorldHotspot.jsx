const ACCENT = '#D4AF37';

export default function StoreWorldHotspot({ product, onOpenModal }) {
  const { hotspot } = product;
  if (!hotspot) return null;

  const handleClick = () => {
    if (product.status === 'memorial' && product.link) {
      window.location.href = product.link;
      return;
    }
    onOpenModal(product.id);
  };

  return (
    <button
      type="button"
      aria-label={`Open ${product.name}`}
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: hotspot.left,
        top: hotspot.top,
        width: hotspot.width,
        height: hotspot.height,
        border: '1px solid transparent',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius: '14px',
        zIndex: 20,
        transition: 'all 0.22s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.85)';
        e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
        e.currentTarget.style.boxShadow = '0 0 28px rgba(212,175,55,0.35)';
        const label = e.currentTarget.querySelector('.hotspot-label');
        if (label) label.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
        const label = e.currentTarget.querySelector('.hotspot-label');
        if (label) label.style.opacity = '0';
      }}
    >
      <span
        className="hotspot-label"
        style={{
          position: 'absolute',
          left: '50%',
          top: '-10px',
          transform: 'translate(-50%, -100%)',
          opacity: 0,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          background: 'rgba(10,10,10,0.94)',
          border: '1px solid rgba(212,175,55,0.5)',
          color: ACCENT,
          padding: '7px 10px',
          borderRadius: '999px',
          fontSize: '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 700,
          boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
          transition: 'opacity 0.2s ease',
        }}
      >
        {product.shortName || product.name}
      </span>
    </button>
  );
}