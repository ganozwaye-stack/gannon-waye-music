import { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Gift, CheckCircle2, Clock, Send, Instagram, Heart, Mail, Search, Filter, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function GiftProgressAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [giftSentDate, setGiftSentDate] = useState('');

  const { data: trackers } = useQuery({
    queryKey: ['giftTrackers'],
    queryFn: () => base44.entities.GiftRequirementTracker.list(),
    initialData: [],
  });

  const { data: subscribers } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.GiftRequirementTracker.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftTrackers'] });
      toast({ title: 'Tracker updated' });
      setSelectedTracker(null);
    },
  });

  const stats = useMemo(() => {
    const total = trackers.length;
    const notStarted = trackers.filter(t => t.status === 'not_started').length;
    const inProgress = trackers.filter(t => t.status === 'in_progress').length;
    const completed = trackers.filter(t => t.status === 'all_requirements_met').length;
    const giftSent = trackers.filter(t => t.status === 'gift_sent').length;

    const tiktokFollowed = trackers.filter(t => t.tiktok_followed).length;
    const instagramFollowed = trackers.filter(t => t.instagram_followed).length;
    const postEngaged = trackers.filter(t => t.post_engaged).length;
    const screenshotSubmitted = trackers.filter(t => t.screenshot_submitted).length;

    return {
      total,
      notStarted,
      inProgress,
      completed,
      giftSent,
      tiktokFollowed,
      instagramFollowed,
      postEngaged,
      screenshotSubmitted,
      completionRate: total > 0 ? ((completed + giftSent) / total) * 100 : 0,
    };
  }, [trackers]);

  const filtered = useMemo(() => {
    let result = trackers;

    if (searchTerm) {
      result = result.filter(t =>
        t.subscriber_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subscriber_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(t => t.status === filterStatus);
    }

    return result.sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
  }, [trackers, searchTerm, filterStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'not_started': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'in_progress': return <Gift className="w-4 h-4 text-primary" />;
      case 'all_requirements_met': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'gift_sent': return <Send className="w-4 h-4 text-accent" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'bg-muted-foreground/10 text-muted-foreground';
      case 'in_progress': return 'bg-primary/10 text-primary';
      case 'all_requirements_met': return 'bg-green-500/10 text-green-500';
      case 'gift_sent': return 'bg-accent/10 text-accent';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-foreground">Gift Progress Tracker</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Monitor hoodie gift campaign progress</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
          <Gift className="w-4 h-4 text-primary" />
          <span className="font-body text-sm text-foreground font-medium">{stats.total} total trackers</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/40 rounded-xl p-4">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Total</p>
          <p className="font-display text-2xl text-foreground">{stats.total}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border/40 rounded-xl p-4">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Not Started</p>
          <p className="font-display text-2xl text-muted-foreground">{stats.notStarted}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-primary/30 rounded-xl p-4">
          <p className="font-body text-xs tracking-widest uppercase text-primary mb-1">In Progress</p>
          <p className="font-display text-2xl text-primary">{stats.inProgress}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-green-500/30 rounded-xl p-4">
          <p className="font-body text-xs tracking-widest uppercase text-green-500 mb-1">Completed</p>
          <p className="font-display text-2xl text-green-500">{stats.completed}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-accent/30 rounded-xl p-4">
          <p className="font-body text-xs tracking-widest uppercase text-accent mb-1">Gifts Sent</p>
          <p className="font-display text-2xl text-accent">{stats.giftSent}</p>
        </motion.div>
      </div>

      {/* Completion Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-primary" />
            <p className="font-body text-xs text-muted-foreground uppercase">TikTok Followed</p>
          </div>
          <p className="font-display text-xl text-foreground">{stats.tiktokFollowed} / {stats.total}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Instagram className="w-4 h-4 text-primary" />
            <p className="font-body text-xs text-muted-foreground uppercase">Instagram Followed</p>
          </div>
          <p className="font-display text-xl text-foreground">{stats.instagramFollowed} / {stats.total}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-primary" />
            <p className="font-body text-xs text-muted-foreground uppercase">Post Engaged</p>
          </div>
          <p className="font-display text-xl text-foreground">{stats.postEngaged} / {stats.total}</p>
        </div>
        <div className="bg-card border border-border/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary" />
            <p className="font-body text-xs text-muted-foreground uppercase">Screenshots Submitted</p>
          </div>
          <p className="font-display text-xl text-foreground">{stats.screenshotSubmitted} / {stats.total}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="bg-secondary/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not_started">Not Started</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="all_requirements_met">Completed</SelectItem>
            <SelectItem value="gift_sent">Gift Sent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trackers List */}
      <div className="space-y-3">
        {filtered.map((tracker, i) => (
          <motion.div
            key={tracker.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedTracker(tracker)}
            className="bg-card border border-border/40 rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(tracker.status)}
                  <h3 className="font-display text-sm text-foreground">{tracker.subscriber_name || 'Anonymous'}</h3>
                </div>
                <p className="font-body text-xs text-muted-foreground">{tracker.subscriber_email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tracker.tiktok_followed && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">✓ TikTok</span>}
                  {tracker.instagram_followed && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">✓ Instagram</span>}
                  {tracker.post_engaged && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded">✓ Engaged</span>}
                  {tracker.screenshot_submitted && <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 rounded">✓ Proof</span>}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`font-body text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusColor(tracker.status)}`}>
                  {tracker.status.replace(/_/g, ' ')}
                </span>
                <p className="font-body text-[10px] text-muted-foreground">
                  {format(new Date(tracker.created_date || Date.now()), 'MMM d')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="font-body text-muted-foreground">No trackers found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTracker && (
        <Dialog open={!!selectedTracker} onOpenChange={() => setSelectedTracker(null)}>
          <DialogContent className="bg-card border-border/40 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">{selectedTracker.subscriber_name}</DialogTitle>
              <p className="font-body text-sm text-muted-foreground">{selectedTracker.subscriber_email}</p>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Requirements */}
              <div>
                <h4 className="font-display text-sm text-foreground mb-3">Requirements Progress</h4>
                <div className="space-y-2">
                  {[
                    { field: 'tiktok_followed', label: 'TikTok Followed', icon: Send },
                    { field: 'instagram_followed', label: 'Instagram Followed', icon: Instagram },
                    { field: 'post_engaged', label: 'Post Engaged', icon: Heart },
                    { field: 'screenshot_submitted', label: 'Screenshot Submitted', icon: Mail },
                  ].map(req => {
                    const Icon = req.icon;
                    const completed = selectedTracker[req.field];
                    return (
                      <div key={req.field} className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-body text-sm">{req.label}</span>
                        </div>
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-display text-sm text-foreground mb-3">Status</h4>
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                  <p className="font-display text-lg text-primary capitalize">{selectedTracker.status.replace(/_/g, ' ')}</p>
                  {selectedTracker.gift_sent_date && (
                    <p className="font-body text-xs text-muted-foreground mt-1">
                      Gift sent: {format(new Date(selectedTracker.gift_sent_date), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="font-body text-xs tracking-widest uppercase mb-2 block">Admin Notes</Label>
                <Textarea
                  value={editNotes || selectedTracker.notes || ''}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Add notes about verification or gift..."
                  className="bg-secondary/50 min-h-24"
                />
              </div>

              {/* Gift Sent Date */}
              {selectedTracker.status === 'all_requirements_met' && (
                <div>
                  <Label className="font-body text-xs tracking-widest uppercase mb-2 block">Mark as Gift Sent</Label>
                  <Input
                    type="date"
                    value={giftSentDate}
                    onChange={e => setGiftSentDate(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    const updateData = { id: selectedTracker.id, notes: editNotes || selectedTracker.notes };
                    if (giftSentDate && selectedTracker.status === 'all_requirements_met') {
                      updateData.status = 'gift_sent';
                      updateData.gift_sent_date = giftSentDate;
                    }
                    updateMutation.mutate(updateData);
                  }}
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded-full"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setSelectedTracker(null)} className="flex-1 rounded-full">
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}