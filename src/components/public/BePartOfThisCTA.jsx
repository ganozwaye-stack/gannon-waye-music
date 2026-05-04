import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function BePartOfThisCTA({ context = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-t border-border/30 mt-8 pt-8 text-center"
    >
      <p className="font-body text-sm text-foreground/60 mb-3">
        {context || 'If this resonates with you, you can be part of it.'}
      </p>
      <Link to="/back-this">
        <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2 px-8">
          <Heart className="w-4 h-4" /> Be Part of This
        </Button>
      </Link>
    </motion.div>
  );
}