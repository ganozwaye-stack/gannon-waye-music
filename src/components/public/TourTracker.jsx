import { motion } from 'framer-motion';
import { MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Static tour dates — update as bookings are confirmed
const TOUR_DATES = [
  // Placeholder dates — replace with real confirmed shows
  // { date: '2026-08-15', venue: 'The Toff in Town', city: 'Melbourne, VIC', status: 'confirmed', ticket_url: '' },
];

const UPCOMING_NOTE = "No tour dates announced yet. Follow on socials to be first to know when shows drop.";

export default function TourTracker() {
  const confirmed = TOUR_DATES.filter(d => d.status === 'confirmed');
  const past = TOUR_DATES.filter(d => d.status === 'past');

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
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Tour Dates</h2>
        </motion.div>

        {confirmed.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center bg-card border border-border/40 rounded-2xl p-12"
          >
            <MapPin className="w-10 h-10 text-primary/30 mx-auto mb-4" />
            <p className="font-body text-foreground/60 leading-relaxed">{UPCOMING_NOTE}</p>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
              <a href="https://www.tiktok.com/@gannonwaye" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
                  TikTok @gannonwaye
                </Button>
              </a>
              <a href="https://www.instagram.com/ganozwaye" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="rounded-full font-body text-xs tracking-wider uppercase border-primary/30 text-primary">
                  Instagram @ganozwaye
                </Button>
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {confirmed.map((show, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-card border border-border/40 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="text-center min-w-[48px]">
                    <p className="font-display text-2xl text-primary leading-none">
                      {new Date(show.date).getDate()}
                    </p>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                      {new Date(show.date).toLocaleDateString('en-AU', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-lg text-foreground">{show.venue}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <p className="font-body text-sm text-muted-foreground">{show.city}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-body text-xs">Confirmed</Badge>
                  {show.ticket_url && (
                    <a href={show.ticket_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="gradient-gold-button rounded-full gap-1.5 font-body text-xs">
                        <Ticket className="w-3 h-3" /> Tickets
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}