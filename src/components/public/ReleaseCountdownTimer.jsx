import { useState, useEffect } from 'react';
import { Clock, Disc3 } from 'lucide-react';

function getRemaining(target) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

// Visual countdown hero for an upcoming release — large artwork, prominent title,
// live ticking countdown. Mobile-first: stacks artwork above info, 4-unit grid fits
// the smallest screens.
export default function ReleaseCountdownTimer({ release }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!release || !release.release_date) return null;
  const rem = getRemaining(release.release_date);
  const dateStr = new Date(release.release_date).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const isOut = !rem;

  return (
    <div className="rounded-3xl overflow-hidden border border-border/30 bg-card/60 backdrop-blur-sm">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Artwork — square on mobile, full height on desktop */}
        <div className="relative aspect-square md:aspect-auto md:h-full min-h-[260px]">
          {release.artwork_url ? (
            <img
              src={release.artwork_url}
              alt={release.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-secondary/40">
              <Disc3 className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />
        </div>

        {/* Info + countdown */}
        <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-center">
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary/70 mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Counting down
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.05] mb-2 break-words">
            {release.title}
          </h2>
          <p className="font-body text-xs sm:text-sm text-muted-foreground mb-6 uppercase tracking-wider">
            {release.type || 'Single'} · {dateStr}
          </p>

          {isOut ? (
            <p className="gradient-gold-text font-display text-3xl">Out now.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                ['Days', rem.days],
                ['Hrs', rem.hours],
                ['Min', rem.mins],
                ['Sec', rem.secs],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/30 bg-secondary/40 py-3 text-center"
                >
                  <p className="font-display text-2xl sm:text-4xl text-primary tabular-nums leading-none">
                    {String(val).padStart(2, '0')}
                  </p>
                  <p className="font-body text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground mt-1.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}