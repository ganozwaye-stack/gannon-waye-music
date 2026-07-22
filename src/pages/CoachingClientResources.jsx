import { motion } from 'framer-motion';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import CoachingDisclaimer from '@/components/coaching/CoachingDisclaimer';
import { FileText, Target, Shield, BarChart2, Heart, Mic, RefreshCw, MessageSquare } from 'lucide-react';

const RESOURCES = [
  { icon: FileText, title: 'Welcome Manual', description: 'Everything you need to know before your first session — what to expect, how to prepare, and how to get the most from this work.', available: false },
  { icon: Target, title: 'Session Preparation Sheet', description: 'A short reflection to complete before each session so you arrive clear on what you most want to focus on.', available: false },
  { icon: Heart, title: 'Values Worksheet', description: 'A guided exercise to help you name what you actually value — not what you think you should value.', available: false },
  { icon: Shield, title: 'Boundary Scripts', description: 'Real language for real situations — 8 common boundary scenarios with scripts you can adapt and use.', available: false },
  { icon: RefreshCw, title: 'Weekly Reflection Page', description: 'A one-page weekly check-in to track how you are doing between sessions.', available: false },
  { icon: BarChart2, title: 'Goal Tracker', description: 'A simple, honest tracker to help you see how far you have come and what is still ahead.', available: false },
  { icon: Heart, title: 'Self Worth Check-In', description: 'A structured self-assessment to run any time you feel like you are losing ground.', available: false },
  { icon: Mic, title: 'Creative Confidence Plan', description: 'For creative clients — a practical monthly plan to rebuild your relationship with your voice and your work.', available: false },
  { icon: FileText, title: 'Post Session Reflection', description: 'A short structured reflection to complete within 24 hours of each session to lock in what landed.', available: false },
  { icon: MessageSquare, title: 'Testimonial Request Form', description: 'When you are ready — a simple way to share your experience if you would like to.', available: false },
];

export default function CoachingClientResources() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block border border-primary/30 text-primary font-body text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
            For Coaching Clients
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-foreground italic leading-tight mb-4">Client Resources</h1>
          <p className="font-body text-base text-foreground/70 leading-relaxed">
            Your resource hub — everything you need to prepare for sessions, track your progress, and continue the work between conversations with Gannon.
          </p>
        </div>
      </section>

      <section className="py-4 px-4 md:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-10 text-center">
            <p className="font-body text-xs text-primary">⚠ Resources are being prepared. Gannon to upload files before this page goes live.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {RESOURCES.map((resource, i) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-5 bg-card/40 border border-border/30 rounded-xl"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary/70" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-body text-sm font-semibold text-foreground">{resource.title}</p>
                      <span className="font-body text-[9px] tracking-widest uppercase text-muted-foreground/40 border border-border/30 rounded-full px-2 py-0.5 shrink-0">
                        {resource.available ? 'Available' : 'Coming Soon'}
                      </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <CoachingSignatureLine line="Still here." size="sm" />
      </section>

      <section className="py-10 px-4">
        <CoachingDisclaimer />
      </section>
    </div>
  );
}