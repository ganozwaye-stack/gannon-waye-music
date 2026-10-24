import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { BarChart3, Loader2, Facebook, Instagram } from 'lucide-react';

export default function AnalyticsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async (channel) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await base44.functions.invoke('socialStudioInsights', { channel });
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ig = data && data.channel === 'instagram' ? data : null;
  const fb = data && data.channel === 'facebook_pages' ? data : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Analytics</h2>
        <Button type="button" size="sm" variant="outline" disabled={loading} onClick={() => load('instagram')}>
          <Instagram className="w-4 h-4" /> Load Instagram
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={loading} onClick={() => load('facebook_pages')}>
          <Facebook className="w-4 h-4" /> Load Facebook Pages
        </Button>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      <p className="text-xs text-muted-foreground">
        Only connected channels are shown, and only numbers the provider actually reports. Figures refresh roughly daily on the provider side.
      </p>

      {error && (
        <div className="text-sm rounded-md px-3 py-2 border border-destructive/40 text-destructive bg-destructive/10">{error}</div>
      )}

      {ig && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-display text-primary">{ig.account.followers_count}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-display text-primary">{ig.account.media_count}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <div className="text-2xl font-display text-primary">{ig.account.follows_count}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-2">Recent posts</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Likes</th>
                  <th className="p-2">Comments</th>
                </tr>
              </thead>
              <tbody>
                {ig.media.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="p-2 text-foreground max-w-xs truncate">{m.caption || '(no caption)'}</td>
                    <td className="p-2 text-center text-muted-foreground text-xs">{m.media_type}</td>
                    <td className="p-2 text-center text-primary">{m.like_count}</td>
                    <td className="p-2 text-center text-primary">{m.comments_count}</td>
                  </tr>
                ))}
                {ig.media.length === 0 && (
                  <tr><td colSpan="4" className="p-3 text-center text-muted-foreground text-xs">No posts returned by the provider.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fb && (
        <div className="space-y-2">
          {fb.pages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No managed pages returned. The account may not have any Pages connected.</p>
          ) : (
            fb.pages.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
                <span className="text-sm text-foreground">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.fan_count} likes · {p.followers_count} followers</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}