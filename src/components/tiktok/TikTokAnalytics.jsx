import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Loader2, Eye, Heart, MessageCircle, Share2, Play, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TikTokAnalytics({ connected = false }) {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const fetchStats = async () => {
    if (!connected) { toast({ title: 'Connect TikTok first', variant: 'destructive' }); return; }
    setLoadingStats(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_user_stats' });
      if (res.data?.success) {
        setStats(res.data.user);
        setLastSync(new Date());
      } else {
        toast({ title: res.data?.error || 'Failed to fetch stats', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: err.message || 'Stats fetch failed', variant: 'destructive' });
    }
    setLoadingStats(false);
  };

  const fetchVideos = async () => {
    if (!connected) { toast({ title: 'Connect TikTok first', variant: 'destructive' }); return; }
    setLoadingVideos(true);
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'get_video_list' });
      if (res.data?.success) {
        setVideos(res.data.videos);
        setLastSync(new Date());
      } else {
        toast({ title: res.data?.error || 'Failed to fetch videos', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: err.message || 'Video list fetch failed', variant: 'destructive' });
    }
    setLoadingVideos(false);
  };

  return (
    <div className="space-y-4">
      {/* Account Stats — user.info.stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Account Statistics
              <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">user.info.stats</Badge>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={fetchStats} disabled={loadingStats || !connected}>
              {loadingStats ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Sync
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!connected && (
            <p className="text-xs text-muted-foreground">Connect TikTok account to view statistics.</p>
          )}
          {connected && !stats && (
            <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={fetchStats} disabled={loadingStats}>
              {loadingStats ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3 h-3" />}
              Fetch Account Stats
            </Button>
          )}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Followers', value: stats.follower_count?.toLocaleString() || '—', icon: '👥' },
                { label: 'Following', value: stats.following_count?.toLocaleString() || '—', icon: '➕' },
                { label: 'Total Likes', value: stats.likes_count?.toLocaleString() || '—', icon: '❤️' },
                { label: 'Videos', value: stats.video_count?.toLocaleString() || '—', icon: '🎬' },
              ].map(s => (
                <div key={s.label} className="bg-secondary/30 rounded-lg p-3 text-center">
                  <p className="text-lg">{s.icon}</p>
                  <p className="text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video List — video.list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" /> Recent Videos
              <Badge className="bg-purple-500/20 text-purple-300 text-xs">video.list</Badge>
            </div>
            <Button size="sm" variant="ghost" className="h-6 text-xs gap-1" onClick={fetchVideos} disabled={loadingVideos || !connected}>
              {loadingVideos ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Sync
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!connected && (
            <p className="text-xs text-muted-foreground">Connect TikTok account to view videos.</p>
          )}
          {connected && !videos && (
            <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={fetchVideos} disabled={loadingVideos}>
              {loadingVideos ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              Fetch Video List
            </Button>
          )}
          {videos && videos.length === 0 && (
            <p className="text-xs text-muted-foreground">No videos found on this account.</p>
          )}
          {videos && videos.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {videos.map(v => (
                <div key={v.id} className="flex items-center gap-3 border border-border rounded-lg p-2.5 hover:bg-secondary/30 transition-colors">
                  {v.cover_image_url && (
                    <img src={v.cover_image_url} alt={v.title} className="w-12 h-16 object-cover rounded shrink-0" />
                  )}
                  {!v.cover_image_url && (
                    <div className="w-12 h-16 bg-secondary rounded shrink-0 flex items-center justify-center">
                      <Play className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{v.title || v.video_description || 'Untitled'}</p>
                    <p className="text-xs text-muted-foreground">{v.duration}s</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" />{v.view_count?.toLocaleString() || 0}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" />{v.like_count?.toLocaleString() || 0}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" />{v.comment_count?.toLocaleString() || 0}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Share2 className="w-2.5 h-2.5" />{v.share_count?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                  {v.share_url && (
                    <a href={v.share_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline shrink-0">View</a>
                  )}
                </div>
              ))}
            </div>
          )}
          {lastSync && (
            <p className="text-xs text-muted-foreground/50 mt-2">Last synced: {lastSync.toLocaleTimeString()}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}