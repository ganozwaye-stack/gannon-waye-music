import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function VideoManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ platform: 'instagram', url: '', title: '', thumbnail_url: '', is_featured: false, sort_order: 0 });

  const { data: videos } = useQuery({
    queryKey: ['socialVideos'],
    queryFn: () => base44.entities.SocialVideo.list('sort_order'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SocialVideo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialVideos'] });
      setShowForm(false);
      setForm({ platform: 'instagram', url: '', title: '', thumbnail_url: '', is_featured: false, sort_order: 0 });
      toast({ title: 'Video added!' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SocialVideo.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialVideos'] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, is_featured }) => base44.entities.SocialVideo.update(id, { is_featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialVideos'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-foreground">Social Videos</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage Instagram Reels & TikToks shown on your site</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 rounded-full font-body text-sm tracking-wider uppercase">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {/* Help text */}
      <div className="bg-secondary/40 border border-border/40 rounded-xl p-4 mb-6">
        <p className="font-body text-sm text-muted-foreground">
          <strong className="text-foreground">How to add a video:</strong> Copy the link to any Instagram Reel or TikTok video and paste it below. 
          Toggle <strong className="text-foreground">Featured</strong> to show it on the Home page preview.
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground font-body">No videos added yet.</div>
      ) : (
        <div className="space-y-3">
          {videos.map(video => (
            <div key={video.id} className="flex items-center gap-4 bg-card border border-border/40 rounded-xl p-4">
              <div className="flex-shrink-0">
                <Badge className={video.platform === 'instagram' ? 'bg-pink-500/10 text-pink-400 border-0' : 'bg-foreground/10 text-foreground border-0'}>
                  {video.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">{video.title || video.url}</p>
                <p className="font-body text-xs text-muted-foreground truncate">{video.url}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Star className={`w-3.5 h-3.5 ${video.is_featured ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                  <Switch
                    checked={!!video.is_featured}
                    onCheckedChange={(checked) => toggleFeatured.mutate({ id: video.id, is_featured: checked })}
                  />
                  <span className="font-body text-xs text-muted-foreground">Featured</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(video.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Video Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border/40 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Platform</Label>
              <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram Reel</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Video URL *</Label>
              <Input
                placeholder={form.platform === 'instagram' ? 'https://www.instagram.com/reel/...' : 'https://www.tiktok.com/@gann0nwaye/video/...'}
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Title / Caption (optional)</Label>
              <Input
                placeholder="Short description..."
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Thumbnail URL (optional)</Label>
              <Input
                placeholder="https://..."
                value={form.thumbnail_url}
                onChange={e => setForm({ ...form, thumbnail_url: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_featured}
                onCheckedChange={v => setForm({ ...form, is_featured: v })}
              />
              <Label className="font-body text-sm">Show on Home page</Label>
            </div>
            <Button
              className="w-full rounded-full font-body tracking-wider uppercase"
              onClick={() => createMutation.mutate(form)}
              disabled={!form.url || createMutation.isPending}
            >
              {createMutation.isPending ? 'Adding...' : 'Add Video'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}