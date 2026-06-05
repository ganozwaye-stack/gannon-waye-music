import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceTextarea from '@/components/ui/VoiceTextarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, FileText, Shield, Trash2, Edit2, Save } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const CATEGORIES = ['personal_profile','brand_profile','business_profile','legal','creative','website','email_archive','social_archive','research','financial','decision_history','action_history','evidence','important_dates','risks_protections','other'];

export default function KnowledgeVault() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [activeLetter, setActiveLetter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
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

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.KnowledgeVault.update(id, { ...data, tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : data.tags }),
    onSuccess: (updated) => { qc.invalidateQueries({ queryKey: ['knowledge-vault'] }); setEditing(false); setSelectedItem(updated); toast.success('Record updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.KnowledgeVault.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['knowledge-vault'] }); setSelectedItem(null); toast.success('Record deleted'); },
  });

  const openRecord = (item) => {
    setSelectedItem(item);
    setEditing(false);
    setEditForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '' });
  };

  const filtered = items.filter(i => {
    const matchCat = category === 'all' || i.category === category;
    const matchSearch = !search || i.title?.toLowerCase().includes(search.toLowerCase()) || i.summary?.toLowerCase().includes(search.toLowerCase());
    const matchLetter = !activeLetter || i.title?.toUpperCase().startsWith(activeLetter);
    return matchCat && matchSearch && matchLetter;
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

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search vault..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* A–Z Strip */}
      <div className="flex flex-wrap gap-1">
        <button onClick={() => setActiveLetter('')} className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all ${!activeLetter ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>All</button>
        {ALPHABET.map(l => {
          const has = items.some(i => i.title?.toUpperCase().startsWith(l));
          return (
            <button key={l} onClick={() => setActiveLetter(activeLetter === l ? '' : l)} disabled={!has}
              className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all ${activeLetter === l ? 'bg-primary text-primary-foreground border-primary' : has ? 'border-border text-muted-foreground hover:border-primary/40' : 'border-border/20 text-muted-foreground/30 cursor-not-allowed'}`}
            >{l}</button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => (
          <Card key={item.id} onClick={() => openRecord(item)} className={`cursor-pointer hover:border-primary/40 hover:shadow-md transition-all ${item.is_sensitive ? 'border-red-500/20' : ''}`}>
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

      {/* Record Detail / Edit Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-display text-xl pr-4">{editing ? 'Edit Record' : selectedItem?.title}</DialogTitle>
              <div className="flex gap-2">
                {!editing && (
                  <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1">
                    <Edit2 className="w-3 h-3" /> Edit
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(selectedItem?.id)} disabled={deleteMutation.isPending} className="gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          {editing ? (
            <div className="space-y-3 mt-2">
              <Input placeholder="Title" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
              <Select value={editForm.category} onValueChange={v => setEditForm({...editForm, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Summary" value={editForm.summary || ''} onChange={e => setEditForm({...editForm, summary: e.target.value})} />
              <VoiceTextarea placeholder="Content..." value={editForm.content || ''} onChange={e => setEditForm({...editForm, content: e.target.value})} rows={8} />
              <Input placeholder="Tags (comma separated)" value={editForm.tags || ''} onChange={e => setEditForm({...editForm, tags: e.target.value})} />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editForm.is_sensitive || false} onChange={e => setEditForm({...editForm, is_sensitive: e.target.checked})} />
                Mark as sensitive
              </label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Cancel</Button>
                <Button className="flex-1 gradient-gold-button gap-1" onClick={() => updateMutation.mutate({ id: selectedItem.id, data: editForm })} disabled={updateMutation.isPending}>
                  <Save className="w-3 h-3" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-secondary text-secondary-foreground capitalize">{selectedItem?.category?.replace(/_/g,' ')}</Badge>
                {selectedItem?.is_sensitive && <Badge className="bg-red-500/10 text-red-400"><Shield className="w-3 h-3 mr-1" />Sensitive</Badge>}
                {selectedItem?.tags?.map(t => <Badge key={t} className="bg-primary/10 text-primary">{t}</Badge>)}
              </div>
              {selectedItem?.summary && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm text-foreground/80">{selectedItem.summary}</p>
                </div>
              )}
              {selectedItem?.content && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Content</p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{selectedItem.content}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Created: {selectedItem?.created_date ? new Date(selectedItem.created_date).toLocaleDateString('en-AU') : '—'}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add to Knowledge Vault</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}</SelectContent>
            </Select>
            <VoiceTextarea placeholder="Content..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} />
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