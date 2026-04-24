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
import { Plus, Pencil, Trash2, Upload, Music } from 'lucide-react';

const STATUSES = ['idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released'];
const TYPES = ['single', 'ep', 'album'];

const emptyRelease = {
  title: '', type: 'single', status: 'idea', release_date: '', artwork_url: '', description: '',
  lyrics: '', credits: '', distributor: '', distributor_link: '', spotify_link: '',
  apple_music_link: '', youtube_link: '', price: '', is_published: false,
};

export default function Releases() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRelease);
  const [uploading, setUploading] = useState(false);

  const { data: releases } = useQuery({
    queryKey: ['releases'], queryFn: () => base44.entities.Release.list('-created_date'), initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { ...data, price: data.price ? Number(data.price) : undefined };
      if (editing === 'new') return base44.entities.Release.create(payload);
      return base44.entities.Release.update(editing, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      setEditing(null);
      toast({ title: 'Release saved' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Release.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] });
      toast({ title: 'Release deleted' });
    },
  });

  const handleUploadArtwork = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, artwork_url: file_url });
    setUploading(false);
  };

  const openEdit = (release) => {
    setEditing(release ? release.id : 'new');
    setForm(release ? { ...emptyRelease, ...release } : emptyRelease);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-foreground">Releases</h1>
        <Button onClick={() => openEdit(null)} className="gap-2 rounded-full font-body text-sm">
          <Plus className="w-4 h-4" /> New Release
        </Button>
      </div>

      <div className="space-y-4">
        {releases.map(release => (
          <Card key={release.id} className="bg-card border-border/40">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0">
                {release.artwork_url ? (
                  <img src={release.artwork_url} alt={release.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Music className="w-6 h-6 text-muted-foreground/30" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg text-foreground">{release.title}</h3>
                  <Badge variant="outline" className="text-[10px] tracking-widest uppercase">{release.type}</Badge>
                  <Badge className={`text-[10px] tracking-widest uppercase ${release.status === 'released' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {release.status?.replace(/_/g, ' ')}
                  </Badge>
                  {release.is_published && <Badge className="bg-chart-2/20 text-chart-2 text-[10px]">Published</Badge>}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {release.release_date && <p className="font-body text-xs text-muted-foreground">{new Date(release.release_date).toLocaleDateString('en-AU')}</p>}
                  {release.distributor && <p className="font-body text-xs text-muted-foreground">Via {release.distributor}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => openEdit(release)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(release.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {releases.length === 0 && (
          <p className="text-center py-12 font-body text-muted-foreground">No releases yet. Click "New Release" to get started.</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="bg-card border-border/40 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing === 'new' ? 'New Release' : 'Edit Release'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Release Date</Label>
              <Input type="date" value={form.release_date} onChange={e => setForm({ ...form, release_date: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Price ($)</Label>
              <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={form.is_published} onCheckedChange={v => setForm({ ...form, is_published: v })} />
              <Label className="font-body text-sm">Published (visible on site)</Label>
            </div>
            <div className="md:col-span-2">
              <Label className="font-body text-xs tracking-wider uppercase">Artwork</Label>
              <div className="flex items-center gap-4 mt-1">
                {form.artwork_url && <img src={form.artwork_url} alt="artwork" className="w-20 h-20 rounded-lg object-cover" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadArtwork} />
                  <Button variant="outline" size="sm" className="gap-2" asChild><span><Upload className="w-3 h-3" /> {uploading ? 'Uploading...' : 'Upload'}</span></Button>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label className="font-body text-xs tracking-wider uppercase">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="min-h-[80px]" />
            </div>
            <div className="md:col-span-2">
              <Label className="font-body text-xs tracking-wider uppercase">Lyrics</Label>
              <Textarea value={form.lyrics} onChange={e => setForm({ ...form, lyrics: e.target.value })} className="min-h-[100px]" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Credits</Label>
              <Input value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} placeholder="Produced by..." />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Distributor</Label>
              <Input value={form.distributor} onChange={e => setForm({ ...form, distributor: e.target.value })} placeholder="DistroKid, TuneCore..." />
            </div>
            <div className="md:col-span-2">
              <Label className="font-body text-xs tracking-wider uppercase">Distributor Portal Link</Label>
              <Input value={form.distributor_link} onChange={e => setForm({ ...form, distributor_link: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Spotify Link</Label>
              <Input value={form.spotify_link} onChange={e => setForm({ ...form, spotify_link: e.target.value })} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Apple Music Link</Label>
              <Input value={form.apple_music_link} onChange={e => setForm({ ...form, apple_music_link: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="font-body text-xs tracking-wider uppercase">YouTube Link</Label>
              <Input value={form.youtube_link} onChange={e => setForm({ ...form, youtube_link: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Save Release'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}