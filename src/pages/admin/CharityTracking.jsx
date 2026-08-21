import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, DollarSign, Calendar, CheckCircle2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function CharityTracking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trackers } = useQuery({
    queryKey: ['charityTrackers'],
    queryFn: () => base44.entities.CharityDonationTracker.list('-month'),
    initialData: [],
  });

  const { data: contributions } = useQuery({
    queryKey: ['supportContributions'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date'),
    initialData: [],
  });

  const trackMutation = useMutation({
    mutationFn: async () => {
      const res = await base44.functions.invoke('trackMonthlyCharityDonation', {});
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['charityTrackers'] });
      toast({
        title: 'Charity tracking updated!',
        description: `${data.month}: $${data.donationAmountOwed.toFixed(2)} allocated to 1800RESPECT`,
      });
    },
  });

  const handleUpdateStatus = async (id, newStatus) => {
    await base44.entities.CharityDonationTracker.update(id, { status: newStatus });
    queryClient.invalidateQueries({ queryKey: ['charityTrackers'] });
    toast({ title: `Status updated to ${newStatus}` });
  };

  const stats = {
    totalRaised: contributions.reduce((sum, c) => sum + c.amount, 0),
    totalDonated: trackers.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.donation_amount_paid, 0),
    pending: trackers.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.donation_amount_owed, 0),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Charity Donation Tracking</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Track 10% monthly donations to 1800RESPECT</p>
        </div>
        <Button
          onClick={() => trackMutation.mutate()}
          disabled={trackMutation.isPending}
          className="rounded-full gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          {trackMutation.isPending ? 'Calculating...' : 'Run Monthly Tracking'}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <DollarSign className="w-5 h-5 text-primary mb-3" />
            <p className="font-display text-2xl text-foreground">${stats.totalRaised.toFixed(2)}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Raised</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Heart className="w-5 h-5 text-green-500 mb-3" />
            <p className="font-display text-2xl text-foreground">${stats.totalDonated.toFixed(2)}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Donated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Calendar className="w-5 h-5 text-yellow-500 mb-3" />
            <p className="font-display text-2xl text-foreground">${stats.pending.toFixed(2)}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-1">Pending Donation</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trackers */}
      <div className="space-y-4">
        <h2 className="font-display text-xl text-foreground">Monthly Tracking</h2>
        {trackers.map((tracker, i) => (
          <motion.div
            key={tracker.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={tracker.status === 'pending' ? 'border-yellow-500/30 bg-yellow-500/5' : tracker.status === 'paid' ? 'border-green-500/30 bg-green-500/5' : ''}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-display text-lg text-foreground">{tracker.month}</p>
                      <Badge variant={tracker.status === 'pending' ? 'secondary' : tracker.status === 'paid' ? 'default' : 'outline'}>
                        {tracker.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Support Received</p>
                        <p className="font-display text-base text-primary">${tracker.total_support_received.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">10% Allocated</p>
                        <p className="font-display text-base text-foreground">${tracker.donation_amount_owed.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Amount Paid</p>
                        <p className="font-display text-base text-green-500">${(tracker.donation_amount_paid || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Contributions</p>
                        <p className="font-display text-base text-foreground">{tracker.contribution_count}</p>
                      </div>
                    </div>
                    {tracker.payment_reference && (
                      <p className="font-body text-xs text-muted-foreground mt-2">
                        Payment Ref: {tracker.payment_reference} {tracker.payment_date && `• Paid: ${tracker.payment_date}`}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {tracker.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(tracker.id, 'paid')}
                          className="gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Mark as Paid
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const paymentRef = prompt('Enter 1800RESPECT payment reference:');
                            if (paymentRef) {
                              base44.entities.CharityDonationTracker.update(tracker.id, {
                                payment_reference: paymentRef,
                                payment_date: new Date().toISOString().split('T')[0],
                              });
                              queryClient.invalidateQueries({ queryKey: ['charityTrackers'] });
                            }
                          }}
                        >
                          Add Payment Ref
                        </Button>
                      </>
                    )}
                    {tracker.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(tracker.id, 'verified')}
                      >
                        Verify Donation
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {trackers.length === 0 && (
          <div className="text-center py-12 bg-card border border-border/40 rounded-2xl">
            <Calendar className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-body text-muted-foreground mb-4">No monthly tracking yet</p>
            <Button onClick={() => trackMutation.mutate()} className="gap-2">
              <TrendingUp className="w-4 h-4" /> Run First Monthly Tracking
            </Button>
          </div>
        )}
      </div>

      {/* Impact Summary */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-display text-xl text-blue-900 mb-2">1800RESPECT Partnership</h3>
              <p className="font-body text-sm text-blue-800 leading-relaxed mb-3">
                Every month, 10% of all support received is donated to 1800RESPECT — providing inclusive, confidential support for women, men, and children fleeing domestic and family violence, with specialised LGBTQIA+ services.
              </p>
              <div className="flex gap-3">
                <a href="https://www.1800respect.org.au" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-body text-xs hover:bg-blue-700 transition-colors">
                  Visit 1800RESPECT →
                </a>
                <a href="/impact" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-600 text-blue-700 font-body text-xs hover:bg-blue-50 transition-colors">
                  View Public Impact →
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}