import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, Upload, ShoppingBag } from 'lucide-react';

const CATEGORIES = ['apparel', 'accessories', 'vinyl', 'cd', 'poster', 'bundle', 'other'];
const emptyProduct = { name: '', description: '', category: 'apparel', price: '', image_url: '', sizes_available: [], stock_quantity: 0, is_active: true };

export default function MerchManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [sizeInput, setSizeInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['merchProducts'], queryFn: () => base44.entities.MerchProduct.list('-created_date'), initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, price: Number(data.price), stock_quantity: Number(data.stock_quantity) };
      if (editing === 'new') return base44.entities.MerchProduct.create(payload);
      return base44.entities.MerchProduct.update(editing, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      setEditing(null);
      toast({ title: 'Product saved' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.MerchProduct.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchProducts'] });
      toast({ title: 'Product deleted' });
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, image_url: file_url });
    setUploading(false);
  };

  const addSize = () => {
    if (sizeInput.trim() && !form.sizes_available.includes(sizeInput.trim())) {
      setForm({ ...form, sizes_available: [...form.sizes_available, sizeInput.trim()] });
      setSizeInput('');
    }
  };

  const removeSize = (s) => setForm({ ...form, sizes_available: form.sizes_available.filter(x => x !== s) });

  const openEdit = (product) => {
    setEditing(product ? product.id : 'new');
    setForm(product ? { ...emptyProduct, ...product } : emptyProduct);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-foreground">Merch Products</h1>
        <Button onClick={() => openEdit(null)} className="gap-2 rounded-full font-body text-sm">
          <Plus className="w-4 h-4" /> New Product
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="bg-card border-border/40 overflow-hidden">
            <div className="aspect-square bg-secondary/50 overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-muted-foreground/20" /></div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px]">{product.category}</Badge>
                {!product.is_active && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
              </div>
              <h3 className="font-display text-lg text-foreground">{product.name}</h3>
              <p className="font-display text-xl text-primary">${product.price?.toFixed(2)}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Stock: {product.stock_quantity}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(product)} className="gap-1"><Pencil className="w-3 h-3" /> Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(product.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {products.length === 0 && (
        <p className="text-center py-12 font-body text-muted-foreground">No products yet. Click "New Product" to add merchandise.</p>
      )}

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-card border-border/40 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing === 'new' ? 'New Product' : 'Edit Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Price ($) *</Label>
                <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label className="font-body text-xs tracking-wider uppercase">Stock Qty</Label>
                <Input type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Image</Label>
              <div className="flex items-center gap-4 mt-1">
                {form.image_url && <img src={form.image_url} alt="product" className="w-16 h-16 rounded-lg object-cover" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  <Button variant="outline" size="sm" className="gap-2" asChild><span><Upload className="w-3 h-3" /> {uploading ? 'Uploading...' : 'Upload'}</span></Button>
                </label>
              </div>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Sizes</Label>
              <div className="flex gap-2 mt-1">
                <Input value={sizeInput} onChange={e => setSizeInput(e.target.value)} placeholder="e.g. XL" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSize())} />
                <Button variant="outline" size="sm" onClick={addSize}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.sizes_available?.map(s => (
                  <Badge key={s} variant="outline" className="cursor-pointer" onClick={() => removeSize(s)}>{s} ×</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
              <Label className="font-body text-sm">Active (visible in store)</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}