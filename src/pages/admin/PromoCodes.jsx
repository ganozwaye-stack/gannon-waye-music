import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function PromoCodes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount_percent: '', max_uses: '', description: '' });

  const { data: codes } = useQuery({
    queryKey: ['promoCodes'],
    queryFn: () => base44.entities.PromoCode.list('-created_date'),
    initialData: [],
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount_percent) {
      toast({ title: 'Code and discount % are required', variant: 'destructive' });
      return;
    }
    await base44.entities.PromoCode.create({
      code: form.code.toUpperCase().trim(),
      discount_percent: parseFloat(form.discount_percent),
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      description: form.description,
      times_used: 0,
      is_active: true,
    });
    queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    setForm({ code: '', discount_percent: '', max_uses: '', description: '' });
    setShowForm(false);
    toast({ title: 'Promo code created!' });
  };

  const handleDelete = async (id) => {
    await base44.entities.PromoCode.delete(id);
    queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
    toast({ title: 'Deleted' });
  };

  const toggleActive = async (item) => {
    await base44.entities.PromoCode.update(item.id, { is_active: !item.is_active });
    queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Promo Codes</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage discount codes for your store</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2">
          <Plus className="w-4 h-4" /> New Code
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-border/40 rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Code *</Label>
              <Input placeholder="LAUNCH15" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="bg-secondary/50 border-border/40 font-body tracking-widest" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Discount % *</Label>
              <Input type="number" placeholder="15" value={form.discount_percent} onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))} className="bg-secondary/50 border-border/40" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Max Uses (blank = unlimited)</Label>
              <Input type="number" placeholder="e.g. 50" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))} className="bg-secondary/50 border-border/40" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">Description</Label>
              <Input placeholder="e.g. Launch offer" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary/50 border-border/40" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase">Create</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-full font-body text-sm">Cancel</Button>
          </div>
        </form>
      )}

      {codes.length === 0 ? (
        <div className="text-center py-24">
          <Tag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground">No promo codes yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active codes */}
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Active</p>
            <div className="space-y-3">
              {codes.filter(c => c.is_active).map((code) => (
                <div key={code.id} className="bg-card border border-border/40 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-xl px-4 py-2">
                      <p className="font-body text-base font-bold tracking-widest gradient-gold-glow">{code.code}</p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-foreground font-medium">{code.discount_percent}% off</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {code.times_used || 0} used{code.max_uses ? ` / ${code.max_uses} max` : ' / unlimited'}
                        {code.description ? ` · ${code.description}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(code)} className="rounded-full font-body text-xs gap-1.5">
                      <ToggleRight className="w-3.5 h-3.5 text-primary" /> Active
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(code.id)} className="rounded-full font-body text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {codes.filter(c => c.is_active).length === 0 && (
                <p className="font-body text-sm text-muted-foreground py-4">No active codes.</p>
              )}
            </div>
          </div>

          {/* Retired / inactive codes */}
          {codes.filter(c => !c.is_active).length > 0 && (
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Retired / Inactive</p>
              <div className="space-y-3">
                {codes.filter(c => !c.is_active).map((code) => (
                  <div key={code.id} className="bg-card border border-border/20 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap opacity-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-secondary/50 rounded-xl px-4 py-2">
                        <p className="font-body text-base font-bold tracking-widest text-muted-foreground line-through">{code.code}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-body text-sm text-muted-foreground font-medium">{code.discount_percent}% off</p>
                          <span className="font-body text-[10px] tracking-wider uppercase bg-secondary rounded-full px-2 py-0.5 text-muted-foreground">Retired</span>
                        </div>
                        <p className="font-body text-xs text-muted-foreground">
                          {code.times_used || 0} used{code.max_uses ? ` / ${code.max_uses} max` : ''}
                          {code.description ? ` · ${code.description}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => toggleActive(code)} className="rounded-full font-body text-xs gap-1.5">
                        <ToggleLeft className="w-3.5 h-3.5" /> Reactivate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(code.id)} className="rounded-full font-body text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}