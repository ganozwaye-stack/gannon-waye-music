import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, Loader2, LockKeyhole, Sparkles } from 'lucide-react';

const OWNER_EMAILS = new Set([
  'ganozwaye@gmail.com',
  'gannonwayemusic@gmail.com',
]);

const inputClass = 'bg-background font-body text-sm';
const labelClass = 'block font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1.5';

function exact(v) {
  return String(v ?? '').trim();
}

// ONE PRESS LAUNCH PACKET STUDIO. The owner picks a private release and
// presses one button to draft the whole launch packet: design, merch with
// manufacturer specs, and the campaign calendar. Everything is generated as a
// private draft; nothing goes live, posts, sends or schedules itself.
export default function LaunchPacketStudio() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [releaseId, setReleaseId] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const isOwner = OWNER_EMAILS.has(exact(user?.email).toLowerCase());

  const { data: releases = [], isLoading } = useQuery({
    queryKey: ['launchPacketReleases'],
    queryFn: () => base44.entities.Release.list('-updated_date', 100),
    initialData: [],
  });

  useEffect(() => {
    if (!releaseId && releases.length) {
      const firstPrivate = releases.find((r) => r.is_published !== true);
      if (firstPrivate) setReleaseId(firstPrivate.id);
    }
  }, [releaseId, releases]);

  const selected = useMemo(
    () => releases.find((r) => r.id === releaseId) || null,
    [releases, releaseId],
  );

  const generate = async () => {
    if (!selected || selected.is_published === true) {
      toast({ title: 'Choose a private release first', variant: 'destructive' });
      return;
    }
    if (!acknowledged) {
      toast({ title: 'Confirm the private-draft acknowledgement first', variant: 'destructive' });
      return;
    }
    setGenerating(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke('generateReleaseLaunchPacket', {
        release_id: releaseId,
        launch_packet_acknowledged: acknowledged,
      });
      setResult(res.data);
      toast({ title: 'Launch packet drafted', description: 'Everything is a private draft awaiting your review.' });
    } catch (err) {
      toast({
        title: 'Packet generation held',
        description: err?.response?.data?.error || err?.message || 'Unknown error',
        variant: 'destructive',
      });
    }
    setGenerating(false);
  };

  if (!isOwner) {
    return (
      <Card className="mx-auto max-w-3xl border-destructive/40">
        <CardContent className="flex gap-3 p-6">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <h1 className="font-display text-2xl text-foreground">Launch Packet Studio</h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              This studio is held for the two configured release owners. It does not expose packet generation to this sign-in.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.28em] text-primary">Owner-only launch machine</p>
          <h1 className="mt-1 font-display text-3xl text-foreground">One Press Launch Packet</h1>
          <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-muted-foreground">
            One press drafts the entire launch packet for a private release: press release, playlist pitch, fan email copy,
            social posts, merch concepts with manufacturer design specs you can take to a supplier, and a dated campaign calendar.
            Everything is created as a private draft. Nothing publishes, posts, sends or schedules itself.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-primary">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Private drafts only
        </Badge>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5">
          <div>
            <label htmlFor="lps-release" className={labelClass}>Release</label>
            <select
              id="lps-release"
              value={releaseId}
              onChange={(e) => setReleaseId(e.target.value)}
              className={`mt-1.5 w-full rounded-md border border-input px-3 py-2 ${inputClass}`}
              disabled={isLoading || generating}
            >
              <option value="">Choose a private release</option>
              {releases.map((r) => (
                <option key={r.id} value={r.id}>
                  {(r.title || 'Untitled') + (r.version_label ? ' · ' + r.version_label : '') + (r.is_published ? ' (public, skip)' : '')}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 border border-primary/20 bg-primary/5 rounded-lg">
            <p className="font-body text-xs text-foreground">
              This generates private draft records only: campaign copy, merch concepts with manufacturer specs, and calendar slots.
            </p>
            <label className="mt-3 flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 accent-[#d4af37]"
              />
              <span className="font-body text-xs text-foreground">
                I understand this only drafts private records for my review. It does not publish, deliver, post, email or schedule anything.
              </span>
            </label>
          </div>

          <Button
            type="button"
            onClick={generate}
            disabled={generating || !acknowledged || !releaseId}
            className="w-full gradient-gold-button rounded-full py-2.5 font-body text-xs tracking-wider uppercase"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Drafting your launch packet…' : 'One press: generate full launch packet'}
          </Button>
        </CardContent>
      </Card>

      {result?.ok && (
        <Card className="border-primary/35">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="font-body text-sm font-medium text-foreground">
                Launch packet drafted for {result.title}. Every piece is a private draft.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Press release', result.created?.press ? 'Drafted' : 'Not created'],
                ['Playlist pitch', result.created?.pitch ? 'Drafted' : 'Not created'],
                ['Fan email copy', result.created?.fan_email ? 'Drafted' : 'Not created'],
                ['Social post drafts', `${result.created?.social_count || 0} drafted`],
                ['Merch concepts', `${result.created?.merch_count || 0} drafted`],
                ['Calendar slots', `${result.created?.calendar_count || 0} drafted`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border/50 bg-secondary/10 p-3">
                  <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-1 font-body text-sm text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {Array.isArray(result.manufacturer_specs) && result.manufacturer_specs.length > 0 && (
              <div>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Manufacturer design specs, take these to your supplier
                </p>
                <div className="space-y-2">
                  {result.manufacturer_specs.map((spec) => (
                    <div key={spec.id} className="rounded-lg border border-border/50 bg-secondary/10 p-3">
                      <p className="font-body text-sm text-foreground">
                        {spec.name}
                        <span className="text-muted-foreground"> · {spec.asset_type} · {spec.print_method || 'print method tbc'} · {spec.template_size || 'size tbc'}</span>
                      </p>
                      <p className="mt-1 font-body text-xs text-muted-foreground whitespace-pre-wrap">{spec.spec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Link to="/admin/content-studio" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Review content drafts</Link>
              <Link to="/admin/merch-designs" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Review merch designs</Link>
              <Link to="/admin/release-promo-command" className="font-body text-xs tracking-wider uppercase border border-primary/40 text-primary rounded-full px-3 py-1.5 hover:bg-primary/10">Review campaign calendar</Link>
            </div>

            <p className="font-body text-[11px] text-muted-foreground">
              Nothing above is live. Publication still runs through the Release Control Desk gates: review, approve, then Go Live on release day.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}