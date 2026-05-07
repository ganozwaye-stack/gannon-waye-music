import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Clock, Send, Zap, Eye, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-secondary/30', icon: Clock, text: 'Awaiting initial engagement' },
  in_progress: { label: 'In Progress', color: 'bg-blue-900/20', icon: Clock, text: 'User working on requirements' },
  all_requirements_met: { label: 'Requirements Met', color: 'bg-amber-900/20', icon: Zap, text: 'Proof submitted, awaiting verification' },
  gift_sent: { label: 'Gift Sent', color: 'bg-green-900/20', icon: CheckCircle2, text: 'Gift shipped to user' },
};

export default function GiftVerification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [giftDate, setGiftDate] = useState('');

  const { data: trackers } = useQuery({
    queryKey: ['giftTrackers'],
    queryFn: () => base44.entities.GiftRequirementTracker.list('-updated_date'),
    initialData: [],
  });

  const verifyMutation = useMutation({
    mutationFn: (id) =>
      base44.asServiceRole.entities.GiftRequirementTracker.update(id, {
        status: 'all_requirements_met',
        notes: verifyNotes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftTrackers'] });
      toast({ title: '✓ Requirements verified' });
      setVerifyNotes('');
      setSelectedTracker(null);
    },
  });

  const sendGiftMutation = useMutation({
    mutationFn: (id) =>
      base44.asServiceRole.entities.GiftRequirementTracker.update(id, {
        status: 'gift_sent',
        gift_sent_date: giftDate,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftTrackers'] });
      toast({ title: '✓ Gift marked as sent' });
      setGiftDate('');
      setSelectedTracker(null);
    },
  });

  const stats = {
    total: trackers.length,
    notStarted: trackers.filter(t => t.status === 'not_started').length,
    inProgress: trackers.filter(t => t.status === 'in_progress').length,
    readyToSend: trackers.filter(t => t.status === 'all_requirements_met').length,
    sent: trackers.filter(t => t.status === 'gift_sent').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-foreground mb-2">Gift Verification System</h1>
        <p className="font-body text-sm text-muted-foreground">
          Track subscriber gift requirements & manage fulfillment
        </p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total Signups', value: stats.total },
          { label: 'Not Started', value: stats.notStarted },
          { label: 'In Progress', value: stats.inProgress },
          { label: 'Ready to Send', value: stats.readyToSend, highlight: true },
          { label: 'Sent', value: stats.sent },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`${s.highlight ? 'bg-green-900/20 border-green-600/30' : 'bg-card border-border/40'} border rounded-2xl p-4`}
          >
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-display text-2xl ${s.highlight ? 'text-green-400' : 'text-foreground'}`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">To Verify</TabsTrigger>
          <TabsTrigger value="ready">Ready to Send</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {/* To Verify */}
        <TabsContent value="pending" className="space-y-4">
          {trackers
            .filter(t => t.status === 'all_requirements_met' && !t.gift_sent_date)
            .map((tracker, i) => (
              <motion.div
                key={tracker.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-amber-600/30 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg text-foreground">{tracker.subscriber_name}</p>
                    <p className="font-body text-sm text-muted-foreground">{tracker.subscriber_email}</p>
                  </div>
                  <Badge className="bg-amber-900/30 text-amber-100">Proof Submitted</Badge>
                </div>

                {tracker.screenshot_submitted && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={tracker.screenshot_submitted}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-body"
                    >
                      View screenshot
                    </a>
                  </div>
                )}

                <div className="bg-secondary/30 rounded-lg p-4">
                  <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Verification Notes</Label>
                  <Textarea
                    placeholder="e.g. 'Screenshot verified, follows confirmed on both platforms'"
                    value={selectedTracker?.id === tracker.id ? verifyNotes : ''}
                    onChange={e => {
                      setSelectedTracker(tracker);
                      setVerifyNotes(e.target.value);
                    }}
                    className="bg-card text-sm min-h-[80px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => verifyMutation.mutate(tracker.id)}
                    disabled={verifyMutation.isPending}
                    className="flex-1 gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {verifyMutation.isPending ? 'Verifying...' : 'Verify & Approve'}
                  </Button>
                </div>
              </motion.div>
            ))}
          {trackers.filter(t => t.status === 'all_requirements_met' && !t.gift_sent_date).length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No pending verifications.</p>
          )}
        </TabsContent>

        {/* Ready to Send */}
        <TabsContent value="ready" className="space-y-4">
          {trackers
            .filter(t => t.status === 'all_requirements_met')
            .map((tracker, i) => (
              <motion.div
                key={tracker.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-green-600/30 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg text-foreground">{tracker.subscriber_name}</p>
                    <p className="font-body text-sm text-muted-foreground">{tracker.subscriber_email}</p>
                  </div>
                  <Badge className="bg-green-900/30 text-green-100">Approved</Badge>
                </div>

                {tracker.notes && (
                  <p className="font-body text-sm text-foreground/70 bg-secondary/30 p-3 rounded-lg">
                    {tracker.notes}
                  </p>
                )}

                <div className="bg-secondary/30 rounded-lg p-4">
                  <Label className="font-body text-xs tracking-wider uppercase mb-2 block">Date Gift Was Sent</Label>
                  <Input
                    type="date"
                    value={selectedTracker?.id === tracker.id ? giftDate : ''}
                    onChange={e => {
                      setSelectedTracker(tracker);
                      setGiftDate(e.target.value);
                    }}
                    className="bg-card"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => sendGiftMutation.mutate(tracker.id)}
                    disabled={sendGiftMutation.isPending || !giftDate}
                    className="flex-1 gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {sendGiftMutation.isPending ? 'Marking...' : 'Mark as Sent'}
                  </Button>
                </div>
              </motion.div>
            ))}
          {trackers.filter(t => t.status === 'all_requirements_met').length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No gifts ready to send.</p>
          )}
        </TabsContent>

        {/* Sent */}
        <TabsContent value="sent" className="space-y-4">
          {trackers
            .filter(t => t.status === 'gift_sent')
            .map((tracker, i) => (
              <motion.div
                key={tracker.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-green-600/30 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-display text-lg text-foreground">{tracker.subscriber_name}</p>
                    <p className="font-body text-sm text-muted-foreground">{tracker.subscriber_email}</p>
                  </div>
                  <Badge className="bg-green-900/30 text-green-100">✓ Sent {tracker.gift_sent_date}</Badge>
                </div>
                {tracker.notes && (
                  <p className="font-body text-sm text-foreground/70">{tracker.notes}</p>
                )}
              </motion.div>
            ))}
          {trackers.filter(t => t.status === 'gift_sent').length === 0 && (
            <p className="text-center py-12 text-muted-foreground">No gifts sent yet.</p>
          )}
        </TabsContent>

        {/* All */}
        <TabsContent value="all" className="space-y-4">
          {trackers.map((tracker, i) => {
            const config = STATUS_CONFIG[tracker.status];
            const Icon = config?.icon || Clock;
            return (
              <motion.div
                key={tracker.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`${config?.color} border border-border/40 rounded-2xl p-5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-display text-base text-foreground">{tracker.subscriber_name}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{tracker.subscriber_email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline">{config?.label}</Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}