import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lock, Plus, Search, FileText, Shield, Trash2, Archive } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const CATEGORIES = ['personal_profile','brand_profile','business_profile','legal','creative','website','email_archive','social_archive','research','financial','decision_history','action_history','evidence','important_dates','risks_protections','other'];

export default function KnowledgeVault() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'other', content: '', summary: '', tags: '', is_sensitive: false });
  const qc = useQueryClient();

  const { data: items = [] } = useQuery({
    queryKey: ['knowledge-vault'],
    queryFn: () => base44.entities.KnowledgeVault.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.KnowledgeVault.create({ ...data, tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [] }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['knowledge-vault'] }); setShowAdd(false); toast.success('Added to vault'); },
  });

  const filtered = items.filter(i => {
    const matchCat = category === 'all' || i.category === category;
    const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.summary?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold gradient-gold-text">Knowledge Vault</h1>
          <p className="text-muted-foreground text-sm">Secure private memory — {items.length} records stored</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gradient-gold-button">
          <Plus className="w-4 h-4 mr-1" /> Add Record
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search vault..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => (
          <Card key={item.id} className={`hover:border-primary/30 transition-all ${item.is_sensitive ? 'border-red-500/20' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex gap-1">
                  {item.is_sensitive && <Badge className="bg-red-500/10 text-red-400 text-xs"><Shield className="w-3 h-3 mr-1" />Sensitive</Badge>}
                </div>
              </div>
              <p className="font-semibold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{item.summary || item.content?.substring(0, 100)}</p>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-secondary text-secondary-foreground text-xs capitalize">{item.category?.replace(/_/g,' ')}</Badge>
                {item.tags?.slice(0, 2).map(t => <Badge key={t} className="bg-primary/10 text-primary text-xs">{t}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground col-span-3 text-center py-12">No records found.</p>}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add to Knowledge Vault</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}</SelectContent>
            </Select>
            <Textarea placeholder="Content..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} />
            <Input placeholder="Summary (optional)" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} />
            <Input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_sensitive} onChange={e => setForm({...form, is_sensitive: e.target.checked})} />
              Mark as sensitive
            </label>
            <Button className="w-full gradient-gold-button" onClick={() => createMutation.mutate(form)} disabled={!form.title || createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save to Vault'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}