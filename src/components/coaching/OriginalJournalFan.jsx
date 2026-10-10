import { useEffect, useRef, useState } from 'react';
import { PUBLIC_JOURNALS } from '@/lib/publicJournalCatalogue';
import './OriginalJournalFan.css';

// Original advert composition, cropped to its fan region. CSS rasterization
// differs from Pillow; source PNGs remain unchanged and interiors stay private.
const covers = [
  ['Healing After Toxic Relationships', 265, 1093, 305, -23],
  ['Knowing Your Worth', 349, 1104, 317, -14],
  ['Building Resilience', 821, 1093, 305, 23],
  ['Healthy Boundaries', 731, 1104, 317, 14],
  ['Working with People-Pleasing', 459, 1134, 340, -5],
  ['Choosing Yourself', 608, 1134, 340, 5],
];
export default function OriginalJournalFan() {
  const ref = useRef(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1080));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <figure ref={ref} className="relative w-full max-w-xl mx-auto mb-8" style={{ aspectRatio: '1080 / 660' }} data-testid="coaching-original-fan" aria-label="The six Gannon Waye journals">
      <div className="absolute left-0 top-0" style={{ width: 1080, height: 660, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <div className="coaching-display-base" aria-hidden="true" data-testid="coaching-display-base" />
        {covers.map(([title, x, y, width, angle], index) => {
          const journal = PUBLIC_JOURNALS.find(item => item.title === title);
          return <div key={title} className="coaching-journal-rim" style={{
              left: x, top: y - 800, width, height: width * 1474 / 1042,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`, zIndex: index + 1,
            }}>
              <img src={journal.coverImageUrl} alt={title} width="1042" height="1474" decoding="async" data-testid="coaching-fan-cover" />
              <span className="coaching-edge-glint" aria-hidden="true" />
            </div>;
        })}
      </div>
    </figure>
  );
}
