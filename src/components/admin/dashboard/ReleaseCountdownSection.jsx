import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Clock, Disc3, Calendar } from 'lucide-react';

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

export default function ReleaseCountdownSection() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-release_date'),
    staleTime: 60_000,
  });

  const upcoming = releases
    .filter((r) => r.release_date && r.status !== 'released' && new Date(r.release_date).getTime() > now)
    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
    .slice(0, 4);

  if (upcoming.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Upcoming Release Countdown</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {upcoming.map((r) => {
          const rem = getRemaining(r.release_date);
          const dateStr = new Date(r.release_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
          return (
            <div key={r.id} className="rounded-2xl border border-border/30 bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0">
                  {r.artwork_url ? (
                    <img src={r.artwork_url} alt={r.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Disc3 className="w-5 h-5 text-muted-foreground/30" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-sm text-foreground truncate">{r.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />{dateStr}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['Days', rem.days], ['Hrs', rem.hours], ['Min', rem.mins], ['Sec', rem.secs]].map(([label, val]) => (
                  <div key={label} className="rounded-lg bg-secondary/30 py-2">
                    <p className="font-display text-xl text-primary tabular-nums leading-none">{String(val).padStart(2, '0')}</p>
                    <p className="font-body text-[9px] uppercase tracking-wider text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}