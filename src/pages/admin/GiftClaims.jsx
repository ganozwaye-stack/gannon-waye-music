import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Gift, Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  verified: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  gift_sent: 'bg-green-500/10 text-green-600 border-green-500/30',
  completed: 'bg-primary/10 text-primary border-primary/30',
};

export default function GiftClaims() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: claims = [] } = useQuery({
    queryKey: ['giftClaims'],
    queryFn: () => base44.entities.GiftClaim.list('-created_date', 100),
    initialData: [],
  });

  const updateClaim = useMutation({
    mutationFn: (data) =>
      base44.entities.GiftClaim.update(data.id, {
        status: data.status,
        gift_description: data.gift_description,
        notes: data.notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftClaims'] });
      toast({ title: 'Claim updated' });
    },
  });

  const deleteClaim = useMutation({
    mutationFn: (id) => base44.entities.GiftClaim.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['giftClaims'] });
      toast({ title: 'Claim deleted' });
    },
  });

  const sendGiftEmail = useMutation({
    mutationFn: async (claim) => {
      // This would call a backend function to send personalized gift email
      await base44.functions.invoke('sendGiftEmail', {
        email: claim.subscriber_email,
        name: claim.subscriber_name,
        gift: claim.gift_description,
      });
    },
    onSuccess: () => {
      toast({ title: 'Gift email sent!' });
    },
  });

  const filtered = statusFilter === 'all' ? claims : claims.filter(c => c.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-foreground flex items-center gap-3">
          <Gift className="w-8 h-8 text-primary" /> Gift Claims
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Claims', count: claims.length, color: 'bg-primary/10' },
          { label: 'Pending', count: claims.filter(c => c.status === 'pending').length, color: 'bg-yellow-500/10' },
          { label: 'Gift Sent', count: claims.filter(c => c.status === 'gift_sent').length, color: 'bg-green-500/10' },
          { label: 'Completed', count: claims.filter(c => c.status === 'completed').length, color: 'bg-primary/10' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 border border-border/30`}>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="font-display text-3xl text-foreground mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'verified', 'gift_sent', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-body tracking-wider uppercase transition-all ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No claims found</p>
          </div>
        ) : (
          filtered.map((claim, i) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border/30 rounded-xl p-5 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-body font-medium text-foreground">{claim.subscriber_name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-body tracking-wider uppercase border ${STATUS_COLORS[claim.status]}`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-3">{claim.subscriber_email}</p>
                  {claim.gift_description && (
                    <p className="font-body text-sm text-foreground/70 mb-2">
                      <strong>Gift:</strong> {claim.gift_description}
                    </p>
                  )}
                  <p className="font-body text-xs text-muted-foreground/60">
                    {format(new Date(claim.created_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedClaim(claim)}
                    className="rounded-lg border-border/40"
                  >
                    Edit
                  </Button>
                  {claim.status === 'gift_sent' && (
                    <Button
                      size="sm"
                      onClick={() => sendGiftEmail.mutate(claim)}
                      className="rounded-lg gap-1"
                    >
                      <Mail className="w-3 h-3" /> Send Email
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteClaim.mutate(claim.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {selectedClaim && (
        <Dialog open onOpenChange={() => setSelectedClaim(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Claim: {selectedClaim.subscriber_name}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                updateClaim.mutate(selectedClaim);
                setSelectedClaim(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Status
                </label>
                <select
                  value={selectedClaim.status}
                  onChange={e => setSelectedClaim({ ...selectedClaim, status: e.target.value })}
                  className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="gift_sent">Gift Sent</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Gift Description
                </label>
                <Input
                  placeholder="e.g., Signed hoodie, exclusive track"
                  value={selectedClaim.gift_description || ''}
                  onChange={e => setSelectedClaim({ ...selectedClaim, gift_description: e.target.value })}
                  className="bg-secondary/50 border-border/40"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground block mb-2">
                  Notes
                </label>
                <Textarea
                  placeholder="Internal notes..."
                  value={selectedClaim.notes || ''}
                  onChange={e => setSelectedClaim({ ...selectedClaim, notes: e.target.value })}
                  className="bg-secondary/50 border-border/40 h-24"
                />
              </div>
              <Button type="submit" className="w-full rounded-lg gradient-gold-button border-0">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}