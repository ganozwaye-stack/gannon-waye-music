// @ts-nocheck
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Edit2, Save, Play, Pause, Send, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReleaseCountdown() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ release_date_text: '', release_date_iso: '', artwork_revealed: false, merch_revealed: false });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterResult, setNewsletterResult] = useState(null);
  const [triggeringReveal, setTriggeringReveal] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['siteReveal'],
    queryFn: () => base44.entities.SiteReveal.list(),
    initialData: [],
  });

  const currentSettings = settings[0] || {};

  const handleTriggerReveal = async () => {
    setTriggeringReveal(true);
    const res = await base44.functions.invoke('triggerMay10Reveal', {});
    queryClient.invalidateQueries({ queryKey: ['siteReveal'] });
    toast({ title: res.data?.message || 'Reveal triggered!' });
    setTriggeringReveal(false);
  };

  const handleSendNewsletter = async () => {
    setSendingNewsletter(true);
    setNewsletterResult(null);
    const res = await base44.functions.invoke('sendRevealNewsletter', {});
    setNewsletterResult(res.data);
    toast({ title: `Newsletter sent to ${res.data?.sent ?? 0} subscribers` });
    setSendingNewsletter(false);
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (currentSettings.id) {
        return base44.entities.SiteReveal.update(currentSettings.id, data);
      }
      return base44.entities.SiteReveal.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteReveal'] });
      setEditing(false);
      toast({ title: 'Countdown settings saved' });
    },
  });

  const calculateTimeRemaining = () => {
    if (!currentSettings.release_date_iso) return null;
    
    const target = new Date(currentSettings.release_date_iso);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, expired: false };
  };

  const timeRemaining = calculateTimeRemaining();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Release Countdown</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage "Thank You" single reveal & countdown</p>
        </div>
        <Button
          onClick={() => {
            setFormData({
              release_date_text: currentSettings.release_date_text || '',
              release_date_iso: currentSettings.release_date_iso || '',
              artwork_revealed: currentSettings.artwork_revealed || false,
              merch_revealed: currentSettings.merch_revealed || false,
            });
            setEditing(true);
          }}
          className="rounded-full gap-2"
        >
          <Edit2 className="w-4 h-4" /> {editing ? 'Edit' : 'Configure'}
        </Button>
      </div>

      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/30 rounded-2xl p-8"
      >
        <div className="text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Artwork & Release Date Reveal</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            {currentSettings.release_date_text || 'Release Date TBA'}
          </h2>

          {timeRemaining && !timeRemaining.expired ? (
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { value: timeRemaining.days, label: 'Days' },
                { value: timeRemaining.hours, label: 'Hours' },
                { value: timeRemaining.minutes, label: 'Minutes' },
                { value: timeRemaining.seconds, label: 'Seconds' },
              ].map((unit, i) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border/40 rounded-xl p-4"
                >
                  <p className="font-display text-3xl text-primary">{unit.value}</p>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">{unit.label}</p>
                </motion.div>
              ))}
            </div>
          ) : timeRemaining?.expired ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-primary/10 border border-primary/30 rounded-2xl p-6 inline-block"
            >
              <p className="font-display text-2xl text-primary">🎉 Release Day!</p>
              <p className="font-body text-sm text-muted-foreground mt-2">It's time. "Thank You" is out now — stream it on all platforms.</p>
            </motion.div>
          ) : (
            <p className="font-body text-muted-foreground">No release date set</p>
          )}

          {/* Reveal Status */}
          <div className="flex justify-center gap-4 mt-8">
            <div className={`px-4 py-2 rounded-full border ${currentSettings.artwork_revealed ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-muted-foreground/10 border-muted-foreground/30 text-muted-foreground'}`}>
              <p className="font-body text-xs font-medium">Artwork: {currentSettings.artwork_revealed ? 'Revealed ✓' : 'Hidden'}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border ${currentSettings.merch_revealed ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-muted-foreground/10 border-muted-foreground/30 text-muted-foreground'}`}>
              <p className="font-body text-xs font-medium">Merch: {currentSettings.merch_revealed ? 'Open ✓' : 'Closed'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* One-click reveal + newsletter */}
      <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 space-y-4">
        <p className="font-body text-xs tracking-widest uppercase gradient-gold-glow">🚀 Launch Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleTriggerReveal}
            disabled={triggeringReveal || (currentSettings.artwork_revealed && currentSettings.merch_revealed)}
            className="rounded-full gap-2 gradient-gold-button border-0"
          >
            <Zap className="w-4 h-4" />
            {triggeringReveal ? 'Triggering...' : currentSettings.artwork_revealed ? 'Reveal Active ✓' : 'Trigger Full Reveal'}
          </Button>
          <Button
            onClick={handleSendNewsletter}
            disabled={sendingNewsletter}
            variant="outline"
            className="rounded-full gap-2 border-primary/40 text-primary hover:bg-primary/10"
          >
            <Send className="w-4 h-4" />
            {sendingNewsletter ? 'Sending...' : 'Send Reveal Newsletter'}
          </Button>
        </div>
        {newsletterResult && (
          <p className="font-body text-xs text-muted-foreground">
            ✓ Sent: {newsletterResult.sent} · Failed: {newsletterResult.failed ?? 0}
            {newsletterResult.errors?.length > 0 && ` · Errors: ${newsletterResult.errors.join(', ')}`}
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Button
            variant="outline"
            className="w-full rounded-full gap-2"
            onClick={() => {
              setFormData({ ...currentSettings, artwork_revealed: !currentSettings.artwork_revealed });
              saveMutation.mutate({ ...currentSettings, artwork_revealed: !currentSettings.artwork_revealed });
            }}
          >
            {currentSettings.artwork_revealed ? (
              <>
                <Pause className="w-4 h-4" /> Hide Artwork
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Reveal Artwork
              </>
            )}
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Button
            variant="outline"
            className="w-full rounded-full gap-2"
            onClick={() => {
              setFormData({ ...currentSettings, merch_revealed: !currentSettings.merch_revealed });
              saveMutation.mutate({ ...currentSettings, merch_revealed: !currentSettings.merch_revealed });
            }}
          >
            {currentSettings.merch_revealed ? (
              <>
                <Pause className="w-4 h-4" /> Close Merch
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Open Merch
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editing} onOpenChange={() => setEditing(false)}>
        <DialogContent className="bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Configure Countdown</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              <TabsTrigger value="reveals" className="flex-1">Reveals</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Release Date (Human Readable)</Label>
                <Input
                  placeholder="e.g. 5 June 2026"
                  value={formData.release_date_text}
                  onChange={e => setFormData({ ...formData, release_date_text: e.target.value })}
                />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Release Date (ISO Format)</Label>
                <Input
                  type="datetime-local"
                  value={formData.release_date_iso ? new Date(formData.release_date_iso).toISOString().slice(0, 16) : ''}
                  onChange={e => setFormData({ ...formData, release_date_iso: new Date(e.target.value).toISOString() })}
                />
                <p className="font-body text-xs text-muted-foreground mt-1">
                  This controls the countdown timer
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reveals" className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                <div>
                  <p className="font-display text-sm text-foreground">Artwork Revealed</p>
                  <p className="font-body text-xs text-muted-foreground">Show/hide single artwork</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.artwork_revealed}
                  onChange={e => setFormData({ ...formData, artwork_revealed: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                <div>
                  <p className="font-display text-sm text-foreground">Merch Store Open</p>
                  <p className="font-body text-xs text-muted-foreground">Enable merch pre-orders</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.merch_revealed}
                  onChange={e => setFormData({ ...formData, merch_revealed: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 rounded-full">
              Cancel
            </Button>
            <Button
              onClick={() => saveMutation.mutate(formData)}
              disabled={saveMutation.isPending}
              className="flex-1 rounded-full gap-2"
            >
              <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}