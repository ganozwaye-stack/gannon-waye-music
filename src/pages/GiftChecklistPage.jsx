import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import GiftChecklistWidget from '@/components/public/GiftChecklistWidget';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function GiftChecklistPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <h1 className="font-display text-4xl text-foreground mb-2">Your Gift Journey</h1>
          <p className="font-body text-muted-foreground">
            Complete these simple steps to unlock your special gift from Gannon. No purchase needed—just genuine support.
          </p>
        </motion.div>

        <GiftChecklistWidget trackerToken={token} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-card border border-border/40 rounded-2xl p-6 space-y-4"
        >
          <h3 className="font-display text-lg text-foreground">How This Works</h3>
          <div className="space-y-3 font-body text-sm text-foreground/70">
            <p>
              <strong>Step 1:</strong> Follow @gann0nwaye on TikTok & Instagram
            </p>
            <p>
              <strong>Step 2:</strong> Like, comment, and share the latest post from either platform
            </p>
            <p>
              <strong>Step 3:</strong> Take a screenshot of your engagement and paste the image URL above
            </p>
            <p>
              <strong>Step 4:</strong> Wait for verification (usually 24-48 hours)
            </p>
            <p>
              <strong>Step 5:</strong> Receive your gift directly 🎁
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6"
        >
          <p className="font-body text-sm text-foreground/70">
            <strong>Need help?</strong> Reply to the signup email or DM @gann0nwaye on Instagram or TikTok.
            This gift is my way of saying thank you for believing in this before the 5 June 2026 release. 🤍
          </p>
        </motion.div>
      </div>
    </div>
  );
}