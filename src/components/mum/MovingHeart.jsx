
export default function MovingHeart({ label = "Forever in my heart", size = "md", showLabel = false }) {
  const sizeMap = { sm: '1.8rem', md: '2.8rem', lg: '3.5rem' };
  return (
    <>
      <style>{`
        .memorial-heart {
          color: #d4af37;
          font-size: ${sizeMap[size]};
          line-height: 1;
          text-shadow: 0 0 18px rgba(212, 175, 55, 0.45);
          animation: memorialHeartPulse 2.8s ease-in-out infinite;
          display: inline-block;
          user-select: none;
        }
        @keyframes memorialHeartPulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.82; filter: drop-shadow(0 0 6px rgba(212,175,55,0.25)); }
          50% { transform: scale(1.08) translateY(-2px); opacity: 1; filter: drop-shadow(0 0 14px rgba(212,175,55,0.55)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .memorial-heart { animation: none; }
        }
      `}</style>
      <span className="inline-flex flex-col items-center gap-1" aria-label={label}>
        <span className="memorial-heart" aria-hidden="true">♥</span>
        {showLabel && <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/50">{label}</span>}
        <span className="sr-only">{label}</span>
      </span>
    </>
  );
}