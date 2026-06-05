import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const REGIONS = [
  { value: 'australia', label: '🇦🇺 Australia' },
  { value: 'international', label: '🌍 International' },
  { value: 'local_pickup', label: '📍 Local Pickup' },
];

const PRODUCT_TYPES = [
  { value: 'cd', label: 'CD' },
  { value: 'merch', label: 'Merch' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'other', label: 'Other' },
];

export default function ShippingRates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    region: 'australia',
    product_type: 'merch',
    base_rate: 0,
    additional_item_rate: 0,
    free_shipping_threshold: null,
    notes: '',
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['shipping-rates'],
    queryFn: () => base44.entities.ShippingRateRule.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ShippingRateRule.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
      resetForm();
      toast({ title: 'Rule created' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ShippingRateRule.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
      resetForm();
      toast({ title: 'Rule updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ShippingRateRule.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
      toast({ title: 'Rule deleted' });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      region: 'australia',
      product_type: 'merch',
      base_rate: 0,
      additional_item_rate: 0,
      free_shipping_threshold: null,
      notes: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({ title: 'Name required', variant: 'destructive' });
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (rule) => {
    setFormData(rule);
    setEditingId(rule.id);
    setShowForm(true);
  };

  const auActive = rules.filter(r => r.is_active && r.region === 'australia').length;
  const intActive = rules.filter(r => r.is_active && r.region === 'international').length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Shipping Rate Rules</h1>
          <p className="text-muted-foreground text-sm mt-1">Control postage costs, profit margins, and free shipping thresholds</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Rule
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{auActive}</p>
            <p className="text-xs text-muted-foreground mt-1">🇦🇺 Active AU Rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{intActive}</p>
            <p className="text-xs text-muted-foreground mt-1">🌍 Active Int'l Rules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{rules.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Rules</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Rule' : 'New Shipping Rule'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Rule name (e.g. Australia CD Standard)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} className="px-3 py-2 rounded-md border border-input bg-transparent text-sm">
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
              <select value={formData.product_type} onChange={(e) => setFormData({ ...formData, product_type: e.target.value })} className="px-3 py-2 rounded-md border border-input bg-transparent text-sm">
                {PRODUCT_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Base Rate ($)</label>
                <Input type="number" step="0.01" value={formData.base_rate} onChange={(e) => setFormData({ ...formData, base_rate: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Per Extra Item ($)</label>
                <Input type="number" step="0.01" value={formData.additional_item_rate} onChange={(e) => setFormData({ ...formData, additional_item_rate: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Free Shipping Over ($)</label>
                <Input type="number" step="0.01" value={formData.free_shipping_threshold || ''} onChange={(e) => setFormData({ ...formData, free_shipping_threshold: e.target.value ? parseFloat(e.target.value) : null })} />
              </div>
            </div>

            <Textarea placeholder="Notes (internal use)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="h-20" />

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules list */}
      <div className="space-y-2">
        {rules.map(rule => (
          <Card key={rule.id} className={rule.is_active ? 'border-primary/30' : 'border-border/40 opacity-60'}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{rule.name}</h3>
                    {rule.is_active ? <Badge className="bg-green-500/10 text-green-400">Active</Badge> : <Badge variant="outline">Inactive</Badge>}
                    {rule.status === 'pending_approval' && <Badge className="bg-yellow-500/10 text-yellow-400">Pending Approval</Badge>}
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Region:</span> {REGIONS.find(r => r.value === rule.region)?.label}</div>
                    <div><span className="text-muted-foreground">Type:</span> {PRODUCT_TYPES.find(p => p.value === rule.product_type)?.label}</div>
                    <div><span className="text-muted-foreground">Base:</span> ${rule.base_rate.toFixed(2)}</div>
                    <div><span className="text-muted-foreground">Extra:</span> ${rule.additional_item_rate.toFixed(2)}</div>
                  </div>
                  {rule.free_shipping_threshold && (
                    <div className="text-sm text-primary">💚 Free shipping over ${rule.free_shipping_threshold.toFixed(2)}</div>
                  )}
                  {rule.notes && <p className="text-xs text-muted-foreground">{rule.notes}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(rule)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(rule.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Defaults guide */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-400" />
            <CardTitle className="text-base">Recommended Defaults</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>🇦🇺 CD Standard:</strong> $7 base, $0.50 extra, free over $100</p>
          <p><strong>🇦🇺 Merch Standard:</strong> $12 base, $2 extra, free over $100</p>
          <p><strong>🇦🇺 Bundle:</strong> $15 base, $1.50 extra, free over $120</p>
          <p><strong>🌍 CD International:</strong> $18 base, $3 extra</p>
          <p><strong>🌍 Merch International:</strong> $25 base, $5 extra</p>
        </CardContent>
      </Card>
    </div>
  );
}