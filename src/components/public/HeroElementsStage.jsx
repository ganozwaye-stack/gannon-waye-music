import HeroElementRender from '@/components/public/HeroElementRender';

// Renders the owner's saved hero design elements full-width on the public
// hero. Sizes are stored for a 1440px design width and scale with the
// viewport, so the design holds at any screen size and no edge can show.
export default function HeroElementsStage({ elements }) {
  if (!Array.isArray(elements) || elements.length === 0) return null;
  const scale = (s) => `calc(100vw / 1440 * ${s})`;
  const sorted = [...elements].sort((a, b) => (a.z || 0) - (b.z || 0));
  return (
    <div className="absolute inset-0">
      {sorted.map((el) => (
        <div key={el.id} className={el.type === 'button' ? 'pointer-events-auto' : 'pointer-events-none'}>
          <HeroElementRender el={el} scale={scale} />
        </div>
      ))}
    </div>
  );
}