// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Gift, DollarSign, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function Subscribers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('-created_date');
  const [selectedSupporter, setSelectedSupporter] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState('');

  const { data: subscribers } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date'),
    initialData: [],
  });

  const { data: trackers } = useQuery({
    queryKey: ['giftTrackers'],
    queryFn: () => base44.entities.GiftRequirementTracker.list(),
    initialData: [],
  });

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.MerchOrder.list(),
    initialData: [],
  });

  const { data: contributions } = useQuery({
    queryKey: ['supportContributions'],
    queryFn: () => base44.entities.SupportContribution.list(),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.GiftRequirementTracker.update(data.id, { notes: data.notes, tags: data.tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftTrackers'] });
      toast({ title: 'Supporter updated' });
      setSelectedSupporter(null);
    },
  });

  // Build comprehensive supporter profiles
  const supporterProfiles = useMemo(() => {
    return subscribers.map(sub => {
      const tracker = trackers.find(t => t.subscriber_email === sub.email);
      const subOrders = orders.filter(o => o.customer_email === sub.email);
      const subContributions = contributions.filter(c => c.supporter_email === sub.email);
      
      const totalSpend = subOrders.reduce((s, o) => s + (o.total_amount || 0), 0) +
                         subContributions.reduce((s, c) => s + (c.total_charged || 0), 0);

      const engagementScore = [
        tracker?.tiktok_followed ? 10 : 0,
        tracker?.instagram_followed ? 10 : 0,
        tracker?.post_engaged ? 10 : 0,
        tracker?.screenshot_submitted ? 15 : 0,
        subOrders.length > 0 ? 15 : 0,
        subContributions.length > 0 ? 20 : 0,
        (tracker?.status === 'gift_sent' ? 20 : tracker?.status === 'all_requirements_met' ? 10 : 0),
      ].reduce((a, b) => a + b, 0);

      return {
        id: sub.id,
        email: sub.email,
        name: sub.name,
        phone: sub.phone,
        signupDate: sub.created_date,
        how_found: sub.how_found,
        totalSpend,
        totalOrders: subOrders.length,
        totalContributions: subContributions.length,
        engagementScore,
        giftStatus: tracker?.status || 'not_started',
        tracker,
        subOrders,
        subContributions,
        notes: tracker?.notes || '',
        tags: sub.tags || [],
      };
    });
  }, [subscribers, trackers, orders, contributions]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = supporterProfiles;

    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(s => {
        if (filterStatus === 'gift_eligible') return s.engagementScore >= 30;
        if (filterStatus === 'high_value') return s.totalSpend >= 50;
        if (filterStatus === 'active') return s.totalOrders > 0 || s.totalContributions > 0;
        return true;
      });
    }

    return result.sort((a, b) => {
      if (sortBy === '-created_date') return new Date(b.signupDate) - new Date(a.signupDate);
      if (sortBy === '-spend') return b.totalSpend - a.totalSpend;
      if (sortBy === '-engagement') return b.engagementScore - a.engagementScore;
      return 0;
    });
  }, [supporterProfiles, searchTerm, filterStatus, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Supporter Registry</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Complete CRM dashboard • {filtered.length} total</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-body text-sm text-foreground font-medium">{supporterProfiles.length} supporters</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-secondary/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Supporters</SelectItem>
            <SelectItem value="gift_eligible">Gift Eligible</SelectItem>
            <SelectItem value="high_value">High Value ($50+)</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="bg-secondary/50">
            <SelectValue placeholder="Sort..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created_date">Newest First</SelectItem>
            <SelectItem value="-spend">Highest Spend</SelectItem>
            <SelectItem value="-engagement">Highest Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/40 rounded-xl p-4">
          <Users className="w-4 h-4 text-primary mb-2" />
          <p className="font-display text-2xl text-foreground">{supporterProfiles.length}</p>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Total Supporters</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border/40 rounded-xl p-4">
          <DollarSign className="w-4 h-4 text-primary mb-2" />
          <p className="font-display text-2xl text-foreground">${supporterProfiles.reduce((s, p) => s + p.totalSpend, 0).toFixed(0)}</p>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Total Revenue</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border/40 rounded-xl p-4">
          <Gift className="w-4 h-4 text-primary mb-2" />
          <p className="font-display text-2xl text-foreground">{supporterProfiles.filter(p => p.giftStatus === 'gift_sent').length}</p>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Gifts Sent</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border/40 rounded-xl p-4">
          <TrendingUp className="w-4 h-4 text-primary mb-2" />
          <p className="font-display text-2xl text-foreground">{(supporterProfiles.reduce((s, p) => s + p.engagementScore, 0) / supporterProfiles.length).toFixed(0)}</p>
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Avg Engagement</p>
        </motion.div>
      </div>

      {/* Supporters Table */}
      <div className="space-y-3">
        {filtered.map((supporter, i) => (
          <motion.div
            key={supporter.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedSupporter(supporter)}
            className="bg-card border border-border/40 rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base text-foreground">{supporter.name}</h3>
                <p className="font-body text-xs text-muted-foreground">{supporter.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {supporter.totalOrders > 0 && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">🛍️ {supporter.totalOrders} order{supporter.totalOrders > 1 ? 's' : ''}</span>}
                  {supporter.totalContributions > 0 && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">❤️ {supporter.totalContributions} contribution{supporter.totalContributions > 1 ? 's' : ''}</span>}
                  {supporter.giftStatus === 'gift_sent' && <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded">✓ Gift Sent</span>}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="font-display text-sm text-primary">${supporter.totalSpend.toFixed(2)}</p>
                  <p className="font-body text-[10px] text-muted-foreground">Lifetime Value</p>
                </div>
                <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-3 py-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <p className="font-body text-xs text-foreground font-medium">{supporter.engagementScore}</p>
                </div>
                <p className="font-body text-[10px] text-muted-foreground">{format(new Date(supporter.signupDate), 'MMM d')}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-body text-muted-foreground">No supporters found.</p>
          </div>
        )}
      </div>

      {/* Supporter Detail Modal */}
      {selectedSupporter && (
        <Dialog open={!!selectedSupporter} onOpenChange={() => setSelectedSupporter(null)}>
          <DialogContent className="bg-card border-border/40 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">{selectedSupporter.name}</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{selectedSupporter.email}</p>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Profile Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Joined</p>
                  <p className="font-display text-sm text-foreground">{format(new Date(selectedSupporter.signupDate), 'MMM d, yyyy')}</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">How They Found Us</p>
                  <p className="font-display text-sm text-foreground capitalize">{selectedSupporter.how_found?.replace(/_/g, ' ')}</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Lifetime Value</p>
                  <p className="font-display text-lg text-primary">${selectedSupporter.totalSpend.toFixed(2)}</p>
                </div>
                <div className="bg-secondary/30 rounded-xl p-4">
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Engagement Score</p>
                  <p className="font-display text-lg text-primary">{selectedSupporter.engagementScore}/100</p>
                </div>
              </div>

              {/* Engagement Tracking */}
              {selectedSupporter.tracker && (
                <div className="border-t border-border/30 pt-4">
                  <h4 className="font-display text-sm text-foreground mb-3 flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Gift Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg">
                      <span className="font-body text-sm">TikTok Followed</span>
                      <span className={selectedSupporter.tracker.tiktok_followed ? 'text-green-400' : 'text-muted-foreground'}>
                        {selectedSupporter.tracker.tiktok_followed ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg">
                      <span className="font-body text-sm">Instagram Followed</span>
                      <span className={selectedSupporter.tracker.instagram_followed ? 'text-green-400' : 'text-muted-foreground'}>
                        {selectedSupporter.tracker.instagram_followed ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg">
                      <span className="font-body text-sm">Post Engaged</span>
                      <span className={selectedSupporter.tracker.post_engaged ? 'text-green-400' : 'text-muted-foreground'}>
                        {selectedSupporter.tracker.post_engaged ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg">
                      <span className="font-body text-sm">Status</span>
                      <span className="font-body text-xs bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                        {selectedSupporter.giftStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order & Contribution History */}
              {(selectedSupporter.subOrders.length > 0 || selectedSupporter.subContributions.length > 0) && (
                <div className="border-t border-border/30 pt-4">
                  <h4 className="font-display text-sm text-foreground mb-3">Purchase History</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedSupporter.subOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg text-sm">
                        <span className="font-body">Order #{order.id.slice(0, 8)}</span>
                        <span className="font-display text-primary">${order.total_amount?.toFixed(2)}</span>
                      </div>
                    ))}
                    {selectedSupporter.subContributions.map(contrib => (
                      <div key={contrib.id} className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg text-sm">
                        <span className="font-body">Support ({contrib.frequency})</span>
                        <span className="font-display text-primary">${contrib.total_charged?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes & Tags */}
              <div className="border-t border-border/30 pt-4 space-y-4">
                <div>
                  <label className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block">Notes</label>
                  <Textarea
                    value={editNotes || selectedSupporter.notes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Add private notes about this supporter..."
                    className="bg-secondary/50 min-h-24"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (selectedSupporter.tracker) {
                        updateMutation.mutate({
                          id: selectedSupporter.tracker.id,
                          notes: editNotes || selectedSupporter.notes,
                          tags: editTags || selectedSupporter.tags,
                        });
                      }
                    }}
                    disabled={updateMutation.isPending}
                    className="rounded-full font-body text-sm"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Notes'}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedSupporter(null)} className="rounded-full font-body text-sm">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}