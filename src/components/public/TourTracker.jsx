import { motion } from 'framer-motion';
import { MapPin, Ticket, Calendar, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const UPCOMING_NOTE = "No dates announced yet. The moment a show or release is added to my calendar, it appears here automatically.";

const TYPE_BADGE = {
  gig: { label: 'Live Show', cls: 'bg-green-500/20 text-green-300 border-green-500/30' },
  release: { label: 'Release', cls: 'bg-primary/20 text-primary border-primary/30' },
  rehearsal: { label: 'Rehearsal', cls: 'bg-secondary text-muted-foreground border-border/40' },
  meeting: { label: 'Private', cls: 'bg-secondary text-muted-foreground border-border/40' },
  other: { label: 'Event', cls: 'bg-secondary text-muted-foreground border-border/40' },
};

export default function TourTracker() {
  const { data: events = [] } = useQuery({
    queryKey: ['publicCalendarEvents'],
    queryFn: () => base44.entities.CalendarEvent.filter({ is_public: true }, 'start_time'),
    initialData: [],
  });

  const now = new Date();
  const upcoming = events.filter(e => e.start_time && new Date(e.start_time) >= now);

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">Live</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Schedule</h2>
        </motion.div>

        {upcoming.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center bg-card border border-border/40 rounded-2xl p-12"
          >
            <Calendar className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <p className="font-body text-foreground/60 leading-relaxed">{UPCOMING_NOTE}</p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <a href="https://www.tiktok.com/@gann0nwaye" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
                  TikTok @gann0nwaye
                </Button>
              </a>
              <a href="https://www.instagram.com/gann0nwaye" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
                  Instagram @gann0nwaye
                </Button>
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((show, i) => {
              const start = new Date(show.start_time);
              const badge = TYPE_BADGE[show.event_type] || TYPE_BADGE.other;
              const isRelease = show.event_type === 'release';
              return (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card border border-border/40 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className="text-center min-w-[48px]">
                      <p className="font-display text-2xl text-primary leading-none">{start.getDate()}</p>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                        {start.toLocaleDateString('en-AU', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-lg text-foreground">{show.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {isRelease ? <Music2 className="w-3 h-3 text-muted-foreground" /> : <MapPin className="w-3 h-3 text-muted-foreground" />}
                        <p className="font-body text-sm text-muted-foreground">{show.location || (isRelease ? 'New release' : 'TBA')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`font-body text-xs ${badge.cls}`}>{badge.label}</Badge>
                    {show.google_html_link && (
                      <a href={show.google_html_link} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gradient-gold-button rounded-full gap-1.5 font-body text-xs">
                          <Ticket className="w-3 h-3" /> Details
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}