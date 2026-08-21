
/**
 * HeartOfGold — refined gold memorial emblem with SVG heart, swallow, MUM text.
 * Uses CSS animations as fallback (no external deps needed).
 * Respects prefers-reduced-motion.
 */
export default function HeartOfGold({ size = 'lg' }) {
  const dim = size === 'lg' ? 160 : 120;
  const sw = Math.round(dim * 0.75);
  const sh = Math.round(dim * 0.67);

  return (
    <div
      className="memorial-heart"
      aria-label="Forever in my heart — Sonia Katisa Waye"
      style={{
        position: 'relative',
        width: `clamp(96px, 16vw, ${dim}px)`,
        height: `clamp(86px, 14vw, ${dim * 0.89}px)`,
        margin: '0 auto',
        filter: 'drop-shadow(0 0 18px rgba(212,175,55,0.35))',
      }}
    >
      <svg
        viewBox="0 0 180 165"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Outer heart outline — pulsing */}
        <path
          d="M90 155 C 18 92 4 42 38 16 C 62 -2 84 10 90 32 C 96 10 118 -2 142 16 C 176 42 162 92 90 155 Z"
          stroke="rgba(212,175,55,0.88)"
          strokeWidth="2.2"
          fill="rgba(212,175,55,0.04)"
          className="heart-orbit"
          style={{
            animation: 'heartPulse 3.6s ease-in-out infinite',
            transformOrigin: '90px 85px',
          }}
        />

        {/* Inner glow fill */}
        <ellipse
          cx="90"
          cy="82"
          rx="44"
          ry="40"
          fill="rgba(212,175,55,0.05)"
          className="heart-glow"
          style={{ animation: 'goldBreath 5s ease-in-out infinite', transformOrigin: '90px 82px' }}
        />

        {/* Orbit shimmer dots — 6 evenly spaced */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          // Approximate heart perimeter points
          const t = deg / 360;
          const cx = 90 + 70 * Math.cos(rad - Math.PI / 2) * (0.85 + 0.15 * Math.sin(rad * 2));
          const cy = 80 + 60 * Math.sin(rad - Math.PI / 2) * (0.9 + 0.1 * Math.cos(rad));
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="1.8"
              fill="rgba(212,175,55,0.55)"
              style={{
                animation: `shimmerDot 2.4s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          );
        })}

        {/* Swallow silhouette — centred inside heart */}
        <g transform="translate(90,72) scale(1)" opacity="0.82">
          {/* Left wing */}
          <path
            d="M0 0 C -8 -10 -22 -12 -28 -5 C -26 0 -14 2 0 0 Z"
            fill="rgba(212,175,55,0.78)"
          />
          {/* Right wing */}
          <path
            d="M0 0 C 8 -10 22 -12 28 -5 C 26 0 14 2 0 0 Z"
            fill="rgba(212,175,55,0.78)"
          />
          {/* Body */}
          <path
            d="M-4 0 C -3 5 0 10 0 12 C 0 10 3 5 4 0 Z"
            fill="rgba(212,175,55,0.65)"
          />
          {/* Tail fork */}
          <path
            d="M0 12 C -3 16 -7 20 -10 18 M0 12 C 3 16 7 20 10 18"
            stroke="rgba(212,175,55,0.6)"
            strokeWidth="1.2"
            fill="none"
          />
        </g>

        {/* MUM text */}
        <text
          x="90"
          y="108"
          textAnchor="middle"
          fill="rgba(212,175,55,0.88)"
          fontSize="11"
          fontFamily="'Playfair Display', Georgia, serif"
          letterSpacing="5"
          fontWeight="500"
        >
          MUM
        </text>

        {/* Decorative line under MUM */}
        <line x1="72" y1="113" x2="108" y2="113" stroke="rgba(212,175,55,0.3)" strokeWidth="0.8" />

        {/* Small decorative diamonds */}
        <path d="M88 118 L90 120 L92 118 L90 116 Z" fill="rgba(212,175,55,0.4)" />
      </svg>

      <style>{`
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); opacity: 0.82; }
          50% { transform: scale(1.045); opacity: 1; }
        }
        @keyframes goldBreath {
          0%, 100% { opacity: 0.22; transform: scale(0.96); }
          50% { opacity: 0.55; transform: scale(1.06); }
        }
        @keyframes shimmerDot {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .heart-orbit { animation: none !important; }
          .heart-glow { animation: none !important; }
        }
      `}</style>
    </div>
  );
}