import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Lock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const REQUIREMENTS = [
  { id: 'tiktok_followed', label: 'Follow @gannonwaye on TikTok', icon: '🎵' },
  { id: 'instagram_followed', label: 'Follow @ganozwaye on Instagram', icon: '📸' },
  { id: 'post_engaged', label: 'Like, comment & share latest post', icon: '💬' },
];

export default function GiftChecklistWidget({ trackerToken, onComplete }) {
  const { toast } = useToast();
  const [tracker, setTracker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingProof, setSubmittingProof] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    const loadTracker = async () => {
      try {
        // Fetch via token (no auth required)
        const trackers = await base44.entities.GiftRequirementTracker.filter({
          checklist_token: trackerToken,
        });
        if (trackers[0]) {
          setTracker(trackers[0]);
        }
      } catch {
        toast({ title: 'Could not load checklist', variant: 'destructive' });
      }
      setLoading(false);
    };
    
    if (trackerToken) loadTracker();
  }, [trackerToken, toast]);

  const handleSubmitProof = async () => {
    if (!screenshotUrl.trim()) {
      toast({ title: 'Please paste screenshot URL', variant: 'destructive' });
      return;
    }

    setSubmittingProof(true);
    try {
      await base44.asServiceRole.entities.GiftRequirementTracker.update(tracker.id, {
        screenshot_submitted: screenshotUrl,
        status: 'all_requirements_met',
      });
      setTracker(prev => ({
        ...prev,
        screenshot_submitted: screenshotUrl,
        status: 'all_requirements_met',
      }));
      toast({ title: '✓ Proof submitted! Waiting for verification.' });
      setScreenshotUrl('');
      onComplete?.();
    } catch {
      toast({ title: 'Could not submit proof', variant: 'destructive' });
    }
    setSubmittingProof(false);
  };

  if (loading) {
    return <div className="text-center py-6"><p className="font-body text-sm text-muted-foreground">Loading checklist...</p></div>;
  }

  if (!tracker) {
    return <div className="text-center py-6"><p className="font-body text-sm text-muted-foreground">Checklist not found.</p></div>;
  }

  const allComplete = REQUIREMENTS.every(r => tracker[r.id]);
  const allRequirementsShowable = tracker.status !== 'not_started';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-primary/20 rounded-2xl p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-foreground">Your Gift Checklist 🎁</h3>
        <div className="text-right">
          <p className="font-display text-sm text-primary">{REQUIREMENTS.filter(r => tracker[r.id]).length}/{REQUIREMENTS.length}</p>
        </div>
      </div>

      {/* Hidden until they engage */}
      <AnimatePresence>
        {!allRequirementsShowable ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-secondary/30 rounded-lg p-4 text-center"
          >
            <Lock className="w-5 h-5 text-muted-foreground/50 mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">
              Once you reply or engage, your requirements will appear here.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {REQUIREMENTS.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/30"
              >
                {tracker[req.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className="font-body text-sm text-foreground flex-1">
                  {req.icon} {req.label}
                </span>
              </motion.div>
            ))}

            {/* Proof submission */}
            {allComplete && tracker.screenshot_submitted === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/30 rounded-lg p-4 space-y-3 mt-4"
              >
                <p className="font-body text-sm text-primary">
                  ✓ All requirements met! Now submit proof:
                </p>
                <Input
                  placeholder="Paste screenshot URL here"
                  value={screenshotUrl}
                  onChange={e => setScreenshotUrl(e.target.value)}
                  className="bg-secondary/50"
                />
                <Button
                  onClick={handleSubmitProof}
                  disabled={submittingProof}
                  className="w-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submittingProof ? 'Submitting...' : 'Submit Proof'}
                </Button>
              </motion.div>
            )}

            {/* Verified state */}
            {tracker.status === 'all_requirements_met' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/20 border border-green-600/30 rounded-lg p-4"
              >
                <p className="font-body text-sm text-green-100">
                  ✓ Requirements verified! Waiting for gift shipment...
                </p>
              </motion.div>
            )}

            {tracker.status === 'gift_sent' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/20 border border-green-600/30 rounded-lg p-4"
              >
                <p className="font-body text-sm text-green-100">
                  🎁 Your gift was sent on {tracker.gift_sent_date}. Check your email!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-body text-xs text-muted-foreground/60 italic border-t border-border/30 pt-4">
        Questions? Reply to the signup email or DM @ganozwaye on social.
      </p>
    </motion.div>
  );
}