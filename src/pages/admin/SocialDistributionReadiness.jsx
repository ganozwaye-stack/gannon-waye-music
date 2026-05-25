import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, ArrowLeft, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PLATFORMS = [
  {
    name: 'TikTok',
    group: 'Video + Social',
    status: 'Fix before review',
    priority: 'Now',
    purpose: 'Login Kit and approved draft upload to the authorised Gannon Waye creator account.',
    keep: 'Login Kit, Content Posting API, user.info.basic, video.upload.',
    remove: 'Share Kit, Webhooks, user.info.stats, video.list, video.publish unless each is implemented and shown in the demo.',
    setup: 'Rotate exposed client secret, update app description, record real OAuth return, upload a draft through video.upload, then submit.',
    risk: 'Public posting and secrets are high risk. Draft upload only is safer.',
    route: '/admin/tiktok-review',
  },
  {
    name: 'Instagram Graph API',
    group: 'Meta',
    status: 'Needs Meta app/OAuth',
    priority: 'Next',
    purpose: 'Instagram Business/Creator profile insights, media listing, comments, and publishing if approved.',
    keep: 'Start with account connection, basic profile/media read, and draft/manual workflow.',
    remove: 'Avoid auto-DM, auto-comment, or public publish scopes until the exact UI can be demonstrated.',
    setup: 'Connect Instagram Professional account to a Facebook Page, create Meta app, add redirect URI, request only permissions used in app flow.',
    risk: 'Meta review requires the reviewer to see each permission used from your app, not just a static dashboard.',
    external: 'https://developers.facebook.com/products/instagram/apis/',
  },
  {
    name: 'Facebook Pages / Meta',
    group: 'Meta',
    status: 'Needs OAuth + Page access',
    priority: 'Next',
    purpose: 'Page publishing, Page insights, fan engagement, and linked Instagram workflows.',
    keep: 'Page read/insights first; publishing only after Approval Queue and reviewer-visible demo.',
    remove: 'Ads, automated engagement, or broad business permissions until there is a specific need.',
    setup: 'Create Meta app, connect Page, request minimum permissions, build approval-gated composer.',
    risk: 'Publishing and ads can affect public reputation or spend money.',
    external: 'https://developers.facebook.com/docs/pages-api/',
  },
  {
    name: 'YouTube Data API',
    group: 'Video + Social',
    status: 'Needs Google OAuth',
    priority: 'Next',
    purpose: 'Channel video list, upload workflow, Shorts metadata, and release content library.',
    keep: 'Read-only channel/video list first; upload scope only when the upload screen is ready.',
    remove: 'Do not request upload permission until the app has a clear upload/approval flow.',
    setup: 'Create Google Cloud OAuth app, enable YouTube Data API, add redirect URI, connect channel.',
    risk: 'Upload scope can publish public video and needs careful approval gating.',
    external: 'https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps',
  },
  {
    name: 'X / Twitter',
    group: 'Text + Social',
    status: 'Needs developer account',
    priority: 'Later',
    purpose: 'Post text updates, release announcements, and track account content if API access is available.',
    keep: 'tweet.read, users.read first. Add tweet.write and media.write only for approval-gated publishing.',
    remove: 'No engagement automation, bulk posting, or auto-replies.',
    setup: 'Create X developer app, enable OAuth 2.0, save client credentials, connect account.',
    risk: 'Write scopes publish publicly and API tier limits/costs may apply.',
    external: 'https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code',
  },
  {
    name: 'Pinterest',
    group: 'Visual Discovery',
    status: 'Needs Pinterest app review',
    priority: 'Later',
    purpose: 'Create boards/pins for release artwork, merch, quotes, and story visuals.',
    keep: 'boards:read and pins:read first. Add pins:write only when the pin composer is built.',
    remove: 'Ads and billing scopes unless paid campaigns are actively needed.',
    setup: 'Create Pinterest developer app, configure redirect URI, request scopes, use sandbox for testing.',
    risk: 'Write scopes can publish public pins.',
    external: 'https://developers.pinterest.com/docs/getting-started/set-up-authentication-and-authorization/',
  },
  {
    name: 'Too Lost / Toolost',
    group: 'Distribution',
    status: 'Needs platform answer',
    priority: 'Now',
    purpose: 'Sync release catalog, DSP links, UPC/ISRC, royalty reports, and release status into the admin system.',
    keep: 'Official API, partner feed, webhook, CSV export, or direct release links only.',
    remove: 'Do not scrape the account or store account password.',
    setup: 'Send the copy-ready support request below asking which official integration paths they support.',
    risk: 'Royalties and release metadata are sensitive business records.',
    route: '/admin/distributors',
  },
  {
    name: 'TuneCore / DSP Links',
    group: 'Distribution',
    status: 'Manual + export first',
    priority: 'Now',
    purpose: 'Release distribution, DSP link tracking, Spotify/Apple/YouTube music links, release date readiness.',
    keep: 'Manual release status and DSP link fields until official API/export is confirmed.',
    remove: 'No automatic submission or release changes without approval.',
    setup: 'Track release date, processing status, stores, UPC/ISRC, and live DSP URLs.',
    risk: 'Release submission changes are hard to undo.',
    route: '/admin/tunecore',
  },
  {
    name: 'Spotify / Apple Music for Artists',
    group: 'Artist Platforms',
    status: 'Mostly manual',
    priority: 'Next',
    purpose: 'Artist profile claiming, release links, analytics snapshots, and playlist pitching reminders.',
    keep: 'Manual dashboard links, checklist, and exported stats snapshots.',
    remove: 'Do not promise live API sync unless official access exists.',
    setup: 'Claim artist profiles after release delivery and add official links to the site.',
    risk: 'Profile claims and pitches require account-owner action.',
  },
];

const TOOLOST_MESSAGE = `Hello Too Lost team,

I am building the private Gannon Waye Music artist operations dashboard for my official website, gannonwaye.com.

I want to connect Too Lost safely so my internal admin system can track my own release catalog, DSP links, UPC/ISRC metadata, release status, royalty/export reports, and store links without scraping my account or sharing my login password.

Can you please confirm what official integration options are available?

1. Public API or partner API access
2. OAuth or API key authentication
3. Webhooks for release/status updates
4. CSV exports for royalty/catalog reporting
5. Direct release/store link format I can store in my dashboard
6. Any documentation, approval process, rate limits, or data-use rules

The integration would only be for my own artist account and internal business dashboard. It would not manage third-party accounts, bypass login security, scrape private pages, or publish releases automatically. Any release or financial action would remain manually approved by me.`;

const META_POSITIONING = `Official Gannon Waye creator workflow for content drafts, approvals, music release operations, fan engagement, and social publishing support. The system prepares drafts and analytics views for the authorised artist accounts only. Public posting, ad activity, and sensitive actions remain approval-gated and creator-controlled.`;

function cls(status) {
  if (status.includes('Fix')) return 'bg-red-500/20 text-red-300 border-red-500/30';
  if (status.includes('Needs')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  if (status.includes('Manual')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  return 'bg-secondary text-muted-foreground border-border';
}

export default function SocialDistributionReadiness() {
  const { toast } = useToast();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(PLATFORMS[0]);
  const groups = ['All', ...Array.from(new Set(PLATFORMS.map(p => p.group)))];
  const filtered = useMemo(() => filter === 'All' ? PLATFORMS : PLATFORMS.filter(p => p.group === filter), [filter]);
  const copy = (text) => { navigator.clipboard.writeText(text); toast({ title: 'Copied' }); };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display font-bold gradient-gold-text">Social + Distribution Readiness</h1>
            <p className="text-sm text-muted-foreground mt-1">A practical approval map for TikTok, Meta, YouTube, X, Pinterest, Too Lost, TuneCore, and artist platforms.</p>
          </div>
        </div>
        <Link to="/admin/integration-completion-centre?tab=TikTok%20%2F%20Social"><Button variant="outline">Integration Centre</Button></Link>
      </div>

      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-200">Vital before submission</p>
            <p className="text-red-100/80">Rotate exposed secrets. For TikTok, remove every product/scope not shown in the actual demo. The current demo is not final unless it shows real OAuth return and video.upload draft flow.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          ['TikTok fix', 'Remove unused scopes/products', 'text-red-300'],
          ['Meta setup', 'Prepare OAuth and app review', 'text-yellow-300'],
          ['Distribution', 'Ask Too Lost for official API/export path', 'text-blue-300'],
          ['Safety rule', 'No auto-posting or paid usage without approval', 'text-green-300'],
        ].map(([label, value, color]) => (
          <Card key={label} className="cursor-pointer hover:border-primary/40">
            <CardContent className="p-4">
              <CheckCircle2 className={`w-5 h-5 ${color}`} />
              <p className={`text-sm font-semibold mt-2 ${color}`}>{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {groups.map(group => (
          <Button key={group} size="sm" variant={filter === group ? 'default' : 'outline'} onClick={() => setFilter(group)}>
            {group} ({group === 'All' ? PLATFORMS.length : PLATFORMS.filter(p => p.group === group).length})
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2 lg:col-span-1">
          {filtered.map(platform => (
            <Card key={platform.name} className="cursor-pointer hover:border-primary/40" onClick={() => setSelected(platform)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{platform.name}</p>
                  <Badge className={cls(platform.status)}>{platform.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{platform.purpose}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />{selected.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge className={cls(selected.status)}>{selected.status}</Badge>
              <Badge variant="outline">{selected.group}</Badge>
              <Badge variant="outline">Priority: {selected.priority}</Badge>
            </div>
            <div><p className="text-xs text-muted-foreground">Purpose</p><p>{selected.purpose}</p></div>
            <div><p className="text-xs text-muted-foreground">Keep / request first</p><p>{selected.keep}</p></div>
            <div><p className="text-xs text-muted-foreground">Remove / avoid for now</p><p>{selected.remove}</p></div>
            <div><p className="text-xs text-muted-foreground">Exact next setup step</p><p>{selected.setup}</p></div>
            <div><p className="text-xs text-muted-foreground">Risk control</p><p>{selected.risk}</p></div>
            <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground">
              Source chain: Social platform {"->"} OAuth/credential {"->"} Approval Queue {"->"} Draft/analytics workflow {"->"} Business Attention Centre {"->"} public posting only after creator approval.
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.route && <Link to={selected.route}><Button variant="outline" size="sm">Open app page</Button></Link>}
              {selected.external && <a href={selected.external} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" />Official docs</Button></a>}
              <Button variant="outline" size="sm" onClick={() => copy(`${selected.name}\n\nPurpose: ${selected.purpose}\n\nKeep: ${selected.keep}\n\nRemove/Avoid: ${selected.remove}\n\nNext step: ${selected.setup}\n\nRisk: ${selected.risk}`)}><Copy className="w-3 h-3 mr-1" />Copy setup notes</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Copy-ready Too Lost request</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <pre className="text-xs whitespace-pre-wrap bg-secondary/50 rounded-lg p-3 max-h-72 overflow-y-auto">{TOOLOST_MESSAGE}</pre>
            <Button variant="outline" size="sm" onClick={() => copy(TOOLOST_MESSAGE)}><Copy className="w-3 h-3 mr-1" />Copy Too Lost message</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reusable social app positioning</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <pre className="text-xs whitespace-pre-wrap bg-secondary/50 rounded-lg p-3">{META_POSITIONING}</pre>
            <Button variant="outline" size="sm" onClick={() => copy(META_POSITIONING)}><Copy className="w-3 h-3 mr-1" />Copy positioning</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}