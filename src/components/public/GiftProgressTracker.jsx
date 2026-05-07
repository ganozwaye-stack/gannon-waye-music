import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Gift, CheckCircle2, Circle, Instagram, Send, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function GiftProgressTracker() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tracker, setTracker] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    checkProgress();
  }, []);

  const checkProgress = async () => {
    try {
      const user = await base44.auth.me();
      if (!user) {
        setLoading(false);
        return;
      }

      const trackers = await base44.entities.GiftRequirementTracker.filter({
        subscriber_email: user.email,
      });

      if (trackers.length > 0) {
        setTracker(trackers[0]);
      }
    } catch (e) {
      // Not logged in or no tracker
    }
    setLoading(false);
  };

  const updateRequirement = async (field) => {
    if (!tracker) return;

    setUpdating(field);
    try {
      await base44.entities.GiftRequirementTracker.update(tracker.id, {
        [field]: true,
      });
      setTracker({ ...tracker, [field]: true });
      toast({ title: 'Progress saved! ✅' });
    } catch (e) {
      toast({ title: 'Error saving', variant: 'destructive' });
    }
    setUpdating(null);
  };

  const openInstagram = () => {
    window.open('https://instagram.com/gannonwaye', '_blank');
  };

  const openTikTok = () => {
    window.open('https://tiktok.com/@gannonwaye', '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!tracker) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 text-center"
      >
        <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display text-xl text-foreground mb-2">Your Gift Awaits</h3>
        <p className="font-body text-sm text-muted-foreground mb-4">
          Complete the requirements below to claim your exclusive hoodie gift.
        </p>
        <Button
          onClick={() => navigate('/gift-checklist')}
          className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase"
        >
          Start Your Journey
        </Button>
      </motion.div>
    );
  }

  const requirements = [
    {
      field: 'tiktok_followed',
      label: 'Follow on TikTok',
      icon: <Send className="w-4 h-4" />,
      action: openTikTok,
      completed: tracker.tiktok_followed,
    },
    {
      field: 'instagram_followed',
      label: 'Follow on Instagram',
      icon: <Instagram className="w-4 h-4" />,
      action: openInstagram,
      completed: tracker.instagram_followed,
    },
    {
      field: 'post_engaged',
      label: 'Like/Comment on Latest Post',
      icon: <Heart className="w-4 h-4" />,
      action: openInstagram,
      completed: tracker.post_engaged,
    },
    {
      field: 'screenshot_submitted',
      label: 'Submit Proof',
      icon: <Sparkles className="w-4 h-4" />,
      action: () => navigate('/gift-checklist'),
      completed: !!tracker.screenshot_submitted,
    },
  ];

  const completedCount = requirements.filter(r => r.completed).length;
  const progressPercent = (completedCount / requirements.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <Gift className="w-10 h-10 text-primary mx-auto mb-2" />
        <h3 className="font-display text-lg text-foreground">Gift Progress</h3>
        <p className="font-body text-xs text-muted-foreground">
          {completedCount} of {requirements.length} requirements completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
        />
      </div>

      {/* Requirements List */}
      <div className="space-y-3">
        {requirements.map((req, i) => (
          <motion.div
            key={req.field}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={() => req.completed ? null : req.action()}
              disabled={req.completed || updating === req.field}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                ${req.completed
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
                }`}
            >
              {req.completed ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1">
              <p className={`font-body text-sm ${req.completed ? 'text-green-500 line-through' : 'text-foreground'}`}>
                {req.label}
              </p>
            </div>
            {!req.completed && (
              <Button
                size="sm"
                variant="outline"
                onClick={req.action}
                disabled={updating === req.field}
                className="rounded-full text-xs h-8"
              >
                {updating === req.field ? '...' : 'Do This'}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Status */}
      {tracker.status === 'all_requirements_met' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center"
        >
          <p className="font-display text-sm text-green-500">🎉 All requirements met!</p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Your gift will be sent soon. Check your email for tracking.
          </p>
        </motion.div>
      )}

      {tracker.status === 'gift_sent' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center"
        >
          <p className="font-display text-sm text-primary">📦 Gift Sent!</p>
          {tracker.gift_sent_date && (
            <p className="font-body text-xs text-muted-foreground mt-1">
              Sent on {new Date(tracker.gift_sent_date).toLocaleDateString()}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}