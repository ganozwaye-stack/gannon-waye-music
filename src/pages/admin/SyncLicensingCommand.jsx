import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Music, Film, Tv, Radio, Target, ChevronRight, AlertTriangle, Copy, Star, FileText, Globe } from 'lucide-react';
import { toast } from 'sonner';

const READINESS_CHECKLIST = [
  { label: 'High-quality mastered WAV/FLAC files available', done: false, critical: true },
  { label: 'Clean instrumentals available for each track', done: false, critical: true },
  { label: 'Split sheets signed for all co-written tracks', done: false, critical: true },
  { label: 'ISRC codes registered for all tracks', done: false, critical: true },
  { label: 'Publishing rights confirmed (self-published or co-published)', done: false, critical: true },
  { label: 'Lyrics document prepared for all tracks', done: false, critical: false },
  { label: 'BPM, key, genre, mood metadata documented', done: false, critical: false },
  { label: 'Press bio and one-sheet prepared', done: false, critical: false },
  { label: 'Streaming links active on all major DSPs', done: false, critical: false },
  { label: 'Stems available for top priority tracks', done: false, critical: false },
];

const PLATFORMS = [
  { name: 'Musicbed', type: 'Licensing Marketplace', tier: 'Premium', notes: 'High-quality curated library. Application required. Focus on mood/feel descriptions.' },
  { name: 'Artlist', type: 'Licensing Marketplace', tier: 'Premium', notes: 'Popular with content creators. Flat-fee model. Submit through their artist portal.' },
  { name: 'Epidemic Sound', type: 'Licensing Marketplace', tier: 'Standard', notes: 'Large catalog. Review process. Consider how your tracks fit their creator audience.' },
  { name: 'Soundstripe', type: 'Licensing Marketplace', tier: 'Standard', notes: 'Creator-focused library. Submit tracks meeting their quality and mood criteria.' },
  { name: 'Sync licensing agents', type: 'Agent/Representative', tier: 'Relationships', notes: 'Agents take 20-30%. Require strong catalog. Need intro via mutual connection or cold pitch.' },
  { name: 'Music supervisors (Film/TV)', type: 'Direct Pitch', tier: 'Advanced', notes: 'Research supervisors who work on relevant shows/films. Personalise every pitch. Do not mass email.' },
  { name: 'Ad agencies', type: 'Direct Pitch', tier: 'Advanced', notes: 'Identify campaigns matching your sound. Pitch via music supervisor or direct to creative director.' },
  { name: 'Apple Music playlist pitching', type: 'DSP Pitch', tier: 'Gatekeeping', notes: 'Via distributor (Too Lost/TuneCore). Submit 7+ days before release date. Strong metadata required.' },
  { name: 'Spotify editorial pitching', type: 'DSP Pitch', tier: 'Gatekeeping', notes: 'Via Spotify for Artists. Submit 7+ days before release. One track per release cycle.' },
];

const PITCH_SAFETY = [
  { rule: 'Personalise every pitch — no copy-paste mass emails', safe: true },
  { rule: 'Research the supervisor/agency project history before pitching', safe: true },
  { rule: 'Describe mood, placement idea, and why it fits their project', safe: true },
  { rule: 'Attach only the specific track (not the whole catalog)', safe: true },
  { rule: 'Follow up once — not multiple times per week', safe: true },
  { rule: 'Include ISRC, split sheet confirmation, and license terms', safe: true },
  { rule: 'Send music/lyrics without permission to known people', safe: false },
  { rule: 'Mass email supervisors or ad agencies', safe: false },
  { rule: 'Claim "perfect fit" without specific evidence', safe: false },
  { rule: 'Promise exclusivity without legal review', safe: false },
  { rule: 'Sign a sync deal without music industry lawyer review', safe: false },
];

const SONG_TEST_FRAMEWORK = [
  { label: 'Hook lands within first 5 seconds', weight: 'Critical' },
  { label: 'Emotional impact is immediate and clear', weight: 'Critical' },
  { label: 'Production quality matches or exceeds reference tracks', weight: 'Critical' },
  { label: 'Lyrics are universal enough for broad placement potential', weight: 'High' },
  { label: 'Tempo and energy suit multiple mood categories', weight: 'High' },
  { label: 'Instrumental works well without vocals for TV/ad use', weight: 'High' },
  { label: 'Track has been tested with real listeners for emotional response', weight: 'Medium' },
  { label: 'Listener can identify genre/mood within 10 seconds', weight: 'Medium' },
  { label: 'Track fits at least 3 distinct placement scenarios', weight: 'Medium' },
];

export default function SyncLicensingCommand() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const copy = (text) => { navigator.clipboard.writeText(text); toast.success('Copied'); };

  const doneCount = READINESS_CHECKLIST.filter(i => i.done).length;
  const criticalDone = READINESS_CHECKLIST.filter(i => i.critical && i.done).length;
  const criticalTotal = READINESS_CHECKLIST.filter(i => i.critical).length;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-3">
        <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Sync Licensing Command</h1>
          <p className="text-sm text-muted-foreground mt-1">Publishing readiness, sync pitching, Apple playlist, ad agency writing, and supervisor workflow</p>
        </div>
      </div>

      <Card className="border-yellow-500/20 bg-yellow-500/3">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-200/80">
            Agents may prepare pitch drafts and research opportunities but must NOT contact publishers, music supervisors, ad agencies, or send music/lyrics externally without Gannon's explicit approval. All pitches go through Approval Queue first.
          </p>
        </CardContent>
      </Card>

      {/* Readiness score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{doneCount}/{READINESS_CHECKLIST.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Overall Readiness Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className={`text-3xl font-bold ${criticalDone === criticalTotal ? 'text-green-400' : 'text-red-400'}`}>{criticalDone}/{criticalTotal}</p>
            <p className="text-xs text-muted-foreground mt-1">Critical Items (required to pitch)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">0</p>
            <p className="text-xs text-muted-foreground mt-1">Pitches Sent (pending agent approval)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="readiness">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="readiness">Readiness</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="song-test">Song Testing</TabsTrigger>
          <TabsTrigger value="pitch-safety">Pitch Safety</TabsTrigger>
          <TabsTrigger value="related">Related Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="readiness" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Sync Readiness Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {READINESS_CHECKLIST.map((item, i) => (
                <div key={i} className={`flex items-start gap-3 border rounded-xl p-4 ${item.done ? 'border-green-500/20 bg-green-500/3' : 'border-border'}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${item.done ? 'bg-green-500/20 border-green-500/40' : 'border-border'}`}>
                    {item.done && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${item.done ? 'text-green-300' : 'text-foreground'}`}>{item.label}</p>
                  </div>
                  {item.critical && <Badge className="text-xs bg-red-500/20 text-red-300 shrink-0">Critical</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              {PLATFORMS.map(p => (
                <button key={p.name} onClick={() => setSelectedPlatform(p)} className="w-full text-left border border-border rounded-xl p-4 hover:border-primary/40 hover:bg-secondary/20 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <Badge className="text-xs bg-secondary text-muted-foreground">{p.tier}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.type}</p>
                </button>
              ))}
            </div>
            {selectedPlatform && (
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle className="text-base">{selectedPlatform.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex gap-2">
                    <Badge className="bg-secondary text-muted-foreground">{selectedPlatform.type}</Badge>
                    <Badge className="bg-blue-500/10 text-blue-400">{selectedPlatform.tier}</Badge>
                  </div>
                  <p className="text-foreground/80">{selectedPlatform.notes}</p>
                  <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">⚠️ Approval Required</p>
                    Any pitch or submission to {selectedPlatform.name} must go through the Approval Queue before being sent. Agents will prepare the draft — Gannon approves before anything leaves the system.
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copy(`Platform: ${selectedPlatform.name}\nType: ${selectedPlatform.type}\nNotes: ${selectedPlatform.notes}`)}>
                    <Copy className="w-3 h-3 mr-1" />Copy notes
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="song-test" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Song Testing Framework</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Use this to evaluate each track's sync and placement potential before pitching.</p>
              {SONG_TEST_FRAMEWORK.map((item, i) => (
                <div key={i} className="flex items-center gap-3 border border-border rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-sm">{item.label}</p>
                  </div>
                  <Badge className={`text-xs shrink-0 ${item.weight === 'Critical' ? 'bg-red-500/20 text-red-300' : item.weight === 'High' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-secondary text-muted-foreground'}`}>{item.weight}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pitch-safety" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Pitch Safety Rules</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {PITCH_SAFETY.map((rule, i) => (
                <div key={i} className={`flex items-start gap-3 border rounded-lg px-4 py-3 ${rule.safe ? 'border-green-500/20' : 'border-red-500/20 bg-red-500/3'}`}>
                  <span className={rule.safe ? 'text-green-400' : 'text-red-400'}>{rule.safe ? '✅' : '❌'}</span>
                  <p className="text-sm">{rule.rule}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: '/admin/publishing-deal-readiness', icon: FileText, label: 'Publishing Deal Readiness', desc: 'Publisher targets, co-writer strategy, rights prep' },
              { to: '/admin/music-supervisor-pitching', icon: Film, label: 'Music Supervisor Pitching', desc: 'Research supervisors and pitch workflow' },
              { to: '/admin/apple-playlist-pitching', icon: Music, label: 'Apple Playlist Pitching', desc: 'Pre-release pitch submission workflow' },
              { to: '/admin/catalogue-growth-command', icon: Star, label: 'Catalogue Growth', desc: 'Toplines, co-writes, and session strategy' },
              { to: '/admin/ad-agency-writing-command', icon: Tv, label: 'Ad Agency Writing', desc: 'Writing for brief, brand matching, pitch prep' },
              { to: '/admin/session-opportunity-command', icon: Radio, label: 'Session Opportunities', desc: 'Session musician and co-writer pipeline' },
              { to: '/admin/licensing-request-centre', icon: Globe, label: 'Licensing Request Centre', desc: 'Inbound licensing request tracking' },
              { to: '/admin/catalogue-readiness', icon: Target, label: 'Catalogue Readiness', desc: 'Track-by-track readiness assessment' },
            ].map(({ to, icon: Icon, label, desc }) => (
              <Link key={to} to={to}>
                <Card className="hover:border-primary/40 cursor-pointer h-full">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0 mt-0.5" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}