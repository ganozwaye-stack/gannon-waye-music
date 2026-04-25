import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, Save, Trash2 } from 'lucide-react';

export default function SiteSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState({});

  const { data: settings } = useQuery({
    queryKey: ['siteSettings'], queryFn: () => base44.entities.SiteSettings.list(), initialData: [],
  });

  useEffect(() => {
    if (settings[0]) setForm(settings[0]);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings[0]) return base44.entities.SiteSettings.update(settings[0].id, data);
      return base44.entities.SiteSettings.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast({ title: 'Settings saved' });
    },
  });

  const handleUpload = async (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading({ ...uploading, [field]: true });
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm({ ...form, [field]: file_url });
    setUploading({ ...uploading, [field]: false });
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-foreground">Site Settings</h1>
        <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="gap-2 rounded-full font-body text-sm">
          <Save className="w-4 h-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="bg-card border-border/40">
          <CardHeader><CardTitle className="font-display text-lg">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Artist Name</Label>
              <Input value={form.artist_name || ''} onChange={e => update('artist_name', e.target.value)} />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Bio</Label>
              <Textarea value={form.bio || ''} onChange={e => update('bio', e.target.value)} className="min-h-[120px]" />
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Profile Image</Label>
              <div className="flex items-center gap-4 mt-1">
                {form.profile_image_url && <img src={form.profile_image_url} alt="profile" className="w-16 h-16 rounded-full object-cover" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload('profile_image_url', e)} />
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <span><Upload className="w-3 h-3" /> {uploading.profile_image_url ? 'Uploading...' : 'Upload'}</span>
                  </Button>
                </label>
              </div>
            </div>
            <div>
              <Label className="font-body text-xs tracking-wider uppercase">Hero Image</Label>
              <div className="flex items-center gap-4 mt-1">
                {form.hero_image_url && <img src={form.hero_image_url} alt="hero" className="w-32 h-16 rounded-lg object-cover" />}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleUpload('hero_image_url', e)} />
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <span><Upload className="w-3 h-3" /> {uploading.hero_image_url ? 'Uploading...' : 'Upload'}</span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40">
          <CardHeader><CardTitle className="font-display text-lg">Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'instagram_url', label: 'Instagram' },
              { key: 'facebook_url', label: 'Facebook' },
              { key: 'twitter_url', label: 'X / Twitter' },
              { key: 'tiktok_url', label: 'TikTok' },
              { key: 'youtube_url', label: 'YouTube' },
              { key: 'spotify_url', label: 'Spotify' },
              { key: 'apple_music_url', label: 'Apple Music' },
            ].map(s => (
              <div key={s.key}>
                <Label className="font-body text-xs tracking-wider uppercase">{s.label}</Label>
                <Input value={form[s.key] || ''} onChange={e => update(s.key, e.target.value)} placeholder={`https://...`} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/40">
           <CardHeader><CardTitle className="font-display text-lg">Contact</CardTitle></CardHeader>
           <CardContent>
             <div>
               <Label className="font-body text-xs tracking-wider uppercase">Contact Email</Label>
               <Input value={form.email_contact || ''} onChange={e => update('email_contact', e.target.value)} placeholder="hello@gannonwaye.com" />
             </div>
           </CardContent>
         </Card>

         <Card className="bg-destructive/5 border border-destructive/20">
           <CardHeader><CardTitle className="font-display text-lg text-destructive">Danger Zone</CardTitle></CardHeader>
           <CardContent>
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="destructive" size="sm" className="gap-2">
                   <Trash2 className="w-4 h-4" /> Delete Account
                 </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Delete Account</AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. All site data will be permanently deleted.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <div className="flex gap-3">
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={() => base44.auth.logout()} className="bg-destructive hover:bg-destructive/90">
                     Delete
                   </AlertDialogAction>
                 </div>
               </AlertDialogContent>
             </AlertDialog>
           </CardContent>
         </Card>
        </div>
        </div>
        );
        }