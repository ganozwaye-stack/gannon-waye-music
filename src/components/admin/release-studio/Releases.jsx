import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Music, ShieldCheck, ArrowRight } from 'lucide-react';
import ReleaseCountdownSection from '@/components/admin/dashboard/ReleaseCountdownSection';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

function hasFullPublicReleaseGate(release) {
  return Boolean(
    release
      && release.is_published === true
      && release.publishing_safe === true
      && release.status === 'released'
      && release.public_release_approval_status === 'approved'
      && OWNER_EMAILS.has(String(release.public_release_approved_by || '').trim().toLowerCase())
      && release.public_release_approved_at,
  );
}

export default function Releases() {
  const { data: releases = [] } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('-created_date'),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Release register</h1>
          <p className="mt-1 max-w-2xl font-body text-sm text-muted-foreground">
            This legacy register is read-only. Click any release to open it in the Release Control Desk, where it can be edited, reviewed and released.
          </p>
        </div>
        <Button asChild className="gap-2 rounded-full font-body text-sm">
          <a href="/admin/new-release-studio">Create private release draft</a>
        </Button>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex gap-3 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-body text-sm font-medium text-foreground">Public release safety hold</p>
            <p className="mt-1 font-body text-xs text-muted-foreground">
              Public state can only be changed through the controlled release workflow after exact owner confirmation.
              A release with any missing gate remains private or incomplete here.
            </p>
          </div>
        </CardContent>
      </Card>

      <ReleaseCountdownSection />

      <div className="space-y-4">
        {releases.map((release) => {
          const isPublic = hasFullPublicReleaseGate(release);
          return (
            <Link key={release.id} to={`/admin/release-control?release=${release.id}`} className="block group">
            <Card className="border-border/40 bg-card transition-colors group-hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary/50">
                  {release.artwork_url ? (
                    <img src={release.artwork_url} alt={release.title} className="h-full w-full object-cover" />
                  ) : (
                    <Music className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{release.title}</h2>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                      {release.type || 'single'}
                    </Badge>
                    <Badge className="bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">
                      {(release.status || 'idea').replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={isPublic ? 'bg-chart-2/20 text-chart-2 text-[10px]' : 'bg-muted text-muted-foreground text-[10px]'}>
                      {isPublic ? 'Public gate verified' : 'Private or incomplete gate'}
                    </Badge>
                  </div>
                  <p className="mt-1 font-body text-xs text-muted-foreground">
                    {release.release_date ? new Date(release.release_date).toLocaleDateString('en-AU') : 'No release date recorded'}
                    {release.version_label ? ` · ${release.version_label}` : ''}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
            </Link>
          );
        })}
        {releases.length === 0 && (
          <p className="py-12 text-center font-body text-muted-foreground">No release records yet.</p>
        )}
      </div>
    </div>
  );
}