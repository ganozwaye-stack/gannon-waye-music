import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Music, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutGannon() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Story Behind the Music</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6">About Gannon Waye</h1>
          <div className="w-16 h-px bg-primary/40 mx-auto" />
        </motion.div>

        <div className="space-y-12">

          {/* Who is this platform for */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border/40 rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl text-foreground">What This Platform Is</h2>
            </div>
            <p className="font-body text-foreground/75 leading-relaxed text-base mb-4">
              This is the official home of Gannon Waye — a deeply personal artist platform built for people who feel things deeply, who have lived through grief, growth, and the quiet revolution of finally becoming themselves. It is more than a music website. It is a community built on radical honesty, vulnerability, and the belief that music can hold space for the parts of us we don't always know how to name.
            </p>
            <p className="font-body text-foreground/75 leading-relaxed text-base">
              Here you will find original music, behind-the-scenes stories, a growing collection of merchandise, and a community wall where fans leave real messages about what the music means to them. The platform is designed to feel intimate, not transactional. Every element — from the visuals to the words — is chosen with care to reflect the same authenticity that goes into every song.
            </p>
          </motion.section>

          {/* Who it's for */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card border border-border/40 rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl text-foreground">Who It Is For</h2>
            </div>
            <p className="font-body text-foreground/75 leading-relaxed text-base mb-4">
              This platform is for the listener who has ever felt too much in a world that rewards feeling nothing. It is for anyone who has experienced loss that changed the shape of who they are, who has sat in the quiet after something broke and wondered what comes next. It is for people in their healing era, their rebuilding era, their "I don't recognise myself but I'm starting to" era.
            </p>
            <p className="font-body text-foreground/75 leading-relaxed text-base">
              Whether you found this through TikTok, a late-night search, or a friend who said "you need to hear this" — you belong here. The music is written for the version of you that doesn't always get seen. That's the whole point.
            </p>
          </motion.section>

          {/* The artist */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card border border-border/40 rounded-2xl p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <Music className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl text-foreground">Who Is Behind It</h2>
            </div>
            <p className="font-body text-foreground/75 leading-relaxed text-base mb-4">
              Gannon Waye is an Australian singer-songwriter based in Melbourne, originally from Adelaide. With a background in performance stretching back to his early teens — including runner-up in Adelaide's Search for a Star and a Top 100 placement in the early days of Australian Idol — Gannon spent the better part of a decade stepping back from the spotlight to develop something more important: a genuine voice.
            </p>
            <p className="font-body text-foreground/75 leading-relaxed text-base mb-4">
              His debut single "Thank You" is the first chapter of a deeply personal body of work. Written from lived experience — grief, transformation, and the unexpected gratitude that can emerge from devastating loss — it marks the beginning of an artist who is no longer writing for approval, but for truth.
            </p>
            <p className="font-body text-foreground/75 leading-relaxed text-base">
              The platform itself is independently built and operated, designed to give fans direct access to the music, the story, and the human behind it. No major label. No intermediary. Just the music and the people who connect with it.
            </p>
          </motion.section>

        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/music">
            <Button className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase gradient-gold-button border-0 w-full sm:w-auto">
              Hear the Music <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-foreground/20 hover:bg-foreground/5 w-full sm:w-auto">
              Get in Touch
            </Button>
          </Link>
          <Link to="/back-this">
            <Button variant="outline" className="rounded-full px-8 py-5 font-body text-sm tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
              Support the Project 🤍
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}