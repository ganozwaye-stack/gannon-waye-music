import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Music, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORY_PARAGRAPHS = [
  "I was born and raised in Adelaide, one of four kids, and I have called Melbourne home for over 13 years now.",
  "Music has always been there. From a young age, I was singing at every opportunity, family events, competitions, anywhere I could be heard. Even when it was not always encouraged, I still showed up. That never left me.",
  "But behind that, life was complicated. I grew up in an environment that shaped how I saw myself, where love often felt conditional, and silence felt safer than expression. Over time, that became my normal, and it followed me into relationships, into identity, into everything.",
  "I spent years feeling like I had to be someone else just to be accepted. I did not truly like or love myself until I was 33. That moment changed everything. It was the first time I felt free from the fear of abandonment, and it shifted how I saw my entire life.",
  "There has been a lot of loss in my world. Losing my Mum not too long ago, who was my best friend and my biggest fan. Also people I love that took their own life and others with diagnosis no one saw coming, these experiences did not just hurt, they reshaped me. Grief is something I am still learning to sit with.",
  "At one point, I turned to substances trying to navigate that pain. What followed was a long recovery journey, one that forced me to look inward, understand myself, and rebuild from the ground up. Over six years, I developed emotional awareness, regulation, and a sense of purpose I never had before.",
  "Now, everything I create comes from that place. My music is not just sound, it is lived experience. It is for anyone who has ever felt lost, isolated, or like they did not belong.",
  "If even one person hears something in my music that helps them feel understood, that is everything.",
];

export default function AboutGannon() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Story Behind the Music</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6">About</h1>
          <div className="w-16 h-px bg-primary/40 mx-auto" />
        </motion.div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-14 flex justify-center"
        >
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border border-primary/20 shadow-xl">
            <img
              src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/74a4ae1c3_0.jpg"
              alt="Gannon Waye"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </motion.div>

        {/* Story paragraphs */}
        <div className="space-y-6">
          {STORY_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="font-body text-foreground/75 leading-relaxed text-base md:text-lg"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 border-l-2 border-primary pl-6 py-2"
        >
          <p className="font-display text-xl md:text-2xl gradient-gold-glow italic leading-relaxed">
            "For them, it was about appearance. For me, I was breaking inside."
          </p>
          <p className="font-body text-xs text-muted-foreground mt-3 tracking-widest uppercase">Gannon Waye</p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/music">
            <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0 w-full sm:w-auto">
              Hear the Music <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20 hover:bg-foreground/5 w-full sm:w-auto">
              <Users className="w-4 h-4 mr-2" /> Community
            </Button>
          </Link>
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
              <Heart className="w-4 h-4 mr-2" /> Support the Project 🤍
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}