import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS = [
  {
    day: 1,
    declaration: 'I Will Take Full Ownership Of My Life.',
    reflection: "No more blaming. No more waiting for someone to save you. The moment you decide that your life is yours to shape — fully, completely, unconditionally — everything changes. You are not a product of what happened to you. You are the author of what comes next.",
    practice: 'Write down one area of your life you\'ve been blaming someone else for. Then write one action you can take today to reclaim it.',
  },
  {
    day: 2,
    declaration: 'I Will Prioritise My Mind, Body & Energy.',
    reflection: "You cannot pour from an empty vessel. Recovery, growth, and freedom all begin with protecting your energy. Sleep matters. Movement matters. What you feed your mind matters. You deserve to be well — not as a reward, but as a foundation.",
    practice: 'Choose one thing for your body (a walk, water, rest) and one for your mind (journal, silence, a boundary) today.',
  },
  {
    day: 3,
    declaration: 'I Will Build Discipline Through Consistent Action.',
    reflection: "Motivation fades. Discipline carries you when feeling it isn't easy. Small, repeated actions — even when no one is watching, even when you don't feel like it — build the version of you that you're becoming. You don't need to be perfect. You need to be consistent.",
    practice: 'Pick one small habit to repeat every day this week, even for just five minutes.',
  },
  {
    day: 4,
    declaration: 'I Will Stay Committed, Even When It\'s Hard.',
    reflection: "The hardest days are the most important ones. When you want to give up, retreat, or go back — that is exactly when staying the course matters most. Growth lives on the other side of discomfort. You've survived harder things than this.",
    practice: 'Think of one commitment you almost gave up on. Recommit to it today. Write it down.',
  },
  {
    day: 5,
    declaration: 'I Will Focus On Growth, Not Perfection.',
    reflection: "Perfectionism is fear wearing a productive mask. You don't need to have it all figured out. You just need to keep moving forward. Every stumble is data. Every setback is a setup. Progress — however messy — is enough.",
    practice: 'List three things you\'ve grown in this year, no matter how small.',
  },
  {
    day: 6,
    declaration: 'I Will Surround Myself With Winners.',
    reflection: "Your environment shapes your evolution. The people around you — the voices you let in, the spaces you inhabit — are either lifting you or quietly holding you back. You deserve to be around people who believe in your potential, who model the life you're building toward.",
    practice: 'Identify one person who lifts you up. Reach out to them today. And one relationship that drains you — set a gentle boundary.',
  },
  {
    day: 7,
    declaration: 'I Will Reflect, Recharge And Level Up.',
    reflection: "Growth without reflection is just movement. Today, you pause. You look at how far you've come. You celebrate the wins — the big ones and the ones only you know about. Then you rest, restore, and step forward with renewed intention. You are worthy of this life you're building.",
    practice: 'Write a letter to yourself about one thing you\'re proud of this week and one intention for the week ahead.',
  },
];

function DayCard({ day, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="border border-border/30 hover:border-primary/30 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm transition-all duration-300"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-5 flex items-center gap-4"
      >
        <div className="shrink-0 w-10 h-10 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center">
          <span className="font-display text-sm gradient-gold-glow font-bold">{day.day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Day {day.day}</p>
          <p className="font-display text-base text-foreground leading-snug mt-0.5">{day.declaration}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-5 pb-5 border-t border-border/20"
        >
          <p className="font-body text-sm text-foreground/70 leading-relaxed mt-4">{day.reflection}</p>
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-primary">Today's Practice</p>
            </div>
            <p className="font-body text-sm text-foreground/80 leading-relaxed">{day.practice}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function SevenDayStandard() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Gannon Waye</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 leading-tight">
            The 7 Day<br />Standard
          </h1>
          <div className="flex justify-center mb-6">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/0c6ab8939_7a747a8f-0e6d-449b-962b-5e08bfcf2f0e.png"
              alt="The 7 Day Standard — Gannon Waye"
              className="w-48 md:w-64 object-contain rounded-xl shadow-2xl"
            />
          </div>
          <p className="font-body text-foreground/60 leading-relaxed max-w-lg mx-auto text-base">
            Seven declarations. Seven days. One commitment to yourself.
          </p>
          <p className="font-body text-foreground/50 text-sm mt-4 max-w-md mx-auto leading-relaxed">
            This isn't a program. It's a way of living. A standard you set for yourself — not for anyone else.
            Whether you're rebuilding after abuse, starting over, or simply choosing growth — these seven principles are your foundation.
          </p>
        </motion.div>

        {/* Days */}
        <div className="space-y-3">
          {DAYS.map((day, i) => (
            <DayCard key={day.day} day={day} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center space-y-4"
        >
          <div className="flex justify-center mb-4">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/adcdec40c_GWheartlacewrap.png"
              alt="GW Heart"
              className="w-20 h-20 object-contain"
            />
          </div>
          <p className="font-body text-foreground/60 text-sm max-w-md mx-auto leading-relaxed">
            If this resonated with you — share it with someone who needs it. And if you're in a dark place right now, please reach out.
          </p>
          <a
            href="https://www.1800respect.org.au"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-xs text-primary hover:underline tracking-wider"
          >
            <Heart className="w-3.5 h-3.5" /> 1800RESPECT — Free, confidential support 24/7 →
          </a>
          <div className="pt-4">
            <Link
              to="/back-this"
              className="inline-flex items-center gap-2 gradient-gold-button rounded-full px-8 py-3 font-body text-sm tracking-wider uppercase"
            >
              <Heart className="w-4 h-4" /> Support This Project
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}