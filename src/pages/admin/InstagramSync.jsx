import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Send, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function InstagramSync() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPost, setLastPost] = useState(null);

  const handlePost = async () => {
    if (!imageUrl.trim() || !caption.trim()) {
      toast({ title: 'Image URL and caption are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke('postToInstagram', {
        image_url: imageUrl.trim(),
        caption: caption.trim(),
      });
      setLastPost(res.data);
      toast({ title: 'Posted to Instagram successfully!' });
      setImageUrl('');
      setCaption('');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to post to Instagram';
      toast({ title: msg, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin OS</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Instagram Sync</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Post music and merch updates directly to your Instagram Business account.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge className="bg-green-500/15 text-green-400 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
        </Badge>
        <span className="font-body text-xs text-muted-foreground">Instagram Business account is linked and ready.</span>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="font-display text-lg flex items-center gap-2">
            <Instagram className="w-5 h-5 text-primary" /> New Instagram Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://media.base44.com/..."
                className="flex-1 bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
            <p className="font-body text-[10px] text-muted-foreground/60 mt-1">
              Paste a public image URL. Must be accessible by Instagram servers.
            </p>
          </div>

          {imageUrl.trim() && (
            <div className="rounded-xl overflow-hidden border border-border/40 max-w-xs">
              <img src={imageUrl.trim()} alt="Preview" className="w-full aspect-square object-cover" />
            </div>
          )}

          <div>
            <label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={5}
              maxLength={2200}
              placeholder="Write your caption here..."
              className="w-full bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none"
            />
            <p className="font-body text-[10px] text-muted-foreground/60 mt-1 text-right">
              {caption.length}/2200
            </p>
          </div>

          <Button
            onClick={handlePost}
            disabled={loading || !imageUrl.trim() || !caption.trim()}
            className="rounded-full gap-2 font-body text-xs tracking-wider uppercase gradient-gold-button border-0"
          >
            {loading ? (
              <>Posting...</>
            ) : (
              <><Send className="w-3.5 h-3.5" /> Post to Instagram</>
            )}
          </Button>
        </CardContent>
      </Card>

      {lastPost && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-sm text-foreground font-semibold">Posted successfully!</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Media ID: {lastPost.media_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-muted-foreground">
          <strong className="text-amber-400">Note:</strong> Instagram requires a public image URL. Upload your image first via Quick Upload, then paste the URL here.
        </p>
      </div>
    </div>
  );
}