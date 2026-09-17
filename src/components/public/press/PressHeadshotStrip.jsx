import { Download } from 'lucide-react';

// Small downloadable headshot thumbnails, sitting inside the biography card so the
// images and the written biography read as one block instead of two disjointed sections.
export default function PressHeadshotStrip({ images = [] }) {
  if (images.length === 0) return null;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">
          Official headshots
        </p>
        <span className="font-body text-[10px] text-muted-foreground">
          High resolution on request
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <a
            key={image.id || image.image_url}
            href={image.image_url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Download: ${image.title || 'Gannon Waye'}`}
            className="group relative w-[86px] rounded-xl overflow-hidden border border-border/40 bg-card/55 hover:border-primary/40 transition-colors"
          >
            <img
              src={image.image_url}
              alt={image.title || 'Gannon Waye'}
              className="w-full aspect-[4/5] object-cover object-[center_25%]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="w-4 h-4 text-primary" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}