export default function FiligreeDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-6 ${className}`}>
      <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4))' }} />
      <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '12px' }}>✦</span>
      <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.4))' }} />
    </div>
  );
}