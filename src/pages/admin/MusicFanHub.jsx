// @ts-nocheck
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  Users, Music, BookOpen, Mail, Send, Award, Heart,
  Trash2, RefreshCw, Film, Loader2
} from 'lucide-react';

const STORY_THEMES = [
  'grief and mum', 'THANKYOU story', 'survival', 'breaking cycles',
  'toxic family', 'self-worth', 'music recovery', 'rebuilding life',
  'business comeback', 'future vision'
];

export default function MusicFanHub() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('crm');

  // Story Vault state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTheme, setNewTheme] = useState('grief and mum');
  const [newSensitivity, setNewSensitivity] = useState('public');
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [vaultOutline, setVaultOutline] = useState('');

  // Fetch subscribers / supporters
  const { data: subscribers = [], isLoading: isLoadingSub } = useQuery({
    queryKey: ['subscribers-hub'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date'),
    initialData: [],
  });

  // Fetch Story Vault entries from KnowledgeVault (category: 'story')
  const { data: memories = [], isLoading: isLoadingMem } = useQuery({
    queryKey: ['story-memories'],
    queryFn: () => base44.entities.KnowledgeVault.filter({ category: 'story' }, '-created_date', 100),
    initialData: [],
  });

  // Add memory mutation
  const addMemory = useMutation({
    mutationFn: () => base44.entities.KnowledgeVault.create({
      title: newTitle,
      content: newContent,
      category: 'story',
      tags: [newTheme, newSensitivity],
      summary: `${newTheme} - Sensitivity: ${newSensitivity}`
    }),
    onSuccess: () => {
      qc.invalidateQueries(['story-memories']);
      setNewTitle('');
      setNewContent('');
      toast({ title: 'Memory added to Story Vault ✓' });
    }
  });

  // Delete memory
  const deleteMemory = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeVault.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(['story-memories']);
      toast({ title: 'Memory removed' });
    }
  });

  // Generate 10-15 minute script outline
  const generateEpisodeOutline = async (memory) => {
    setGeneratingOutline(true);
    setVaultOutline('');
    try {
      const prompt = `You are Gannon Waye's writing assistant. Create a detailed 10-15 minute episode script outline and a 20-second TikTok hook clip script based on the following life memory.

      Theme: ${memory.summary}
      Memory content: ${memory.content}

      Format the output with:
      1. Episode Title
      2. 20-Second Scroll-Stopping TikTok Hook Script (word-for-word)
      3. Episode Scene Checklist (10-15 min layout)
      4. Key Emotional Focus / Vulnerability prompt for free-speech input.

      Keep the tone authentic, emotionally raw, vulnerable, and respectful. Use no AI-sounding corporate clichés.`;

      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      setVaultOutline(res);
      toast({ title: 'Episode outline draft generated ✓' });
    } catch (e) {
      toast({ title: 'AI script generation failed', variant: 'destructive' });
    }
    setGeneratingOutline(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Fan Relationship Engine</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Music & Fan Hub</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Manage subscriber registries, releases, newsletter campaigns, and your Story Vault database.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border/40 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5 p-1 h-auto">
          <TabsTrigger value="crm" className="text-xs py-2"><Users className="w-3.5 h-3.5 mr-1 text-primary" /> CRM Registry</TabsTrigger>
          <TabsTrigger value="story-vault" className="text-xs py-2"><BookOpen className="w-3.5 h-3.5 mr-1 text-yellow-400" /> Story Vault</TabsTrigger>
          <TabsTrigger value="releases" className="text-xs py-2"><Music className="w-3.5 h-3.5 mr-1 text-green-400" /> Releases</TabsTrigger>
          <TabsTrigger value="newsletter" className="text-xs py-2"><Mail className="w-3.5 h-3.5 mr-1 text-purple-400" /> Newsletter</TabsTrigger>
          <TabsTrigger value="quick-links" className="text-xs py-2"><Send className="w-3.5 h-3.5 mr-1" /> All Fan Tools</TabsTrigger>
        </TabsList>

        {/* ─── TAB: CRM OVERVIEW ──────────────────────────────────────── */}
        <TabsContent value="crm" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Recent Supporter Signups</CardTitle>
                <CardDescription className="text-xs">Direct outreach portal and engagement tracking.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSub ? (
                  <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
                ) : subscribers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs">No signups found.</div>
                ) : (
                  <div className="space-y-3">
                    {subscribers.slice(0, 5).map(sub => (
                      <div key={sub.id} className="p-3 bg-secondary/30 rounded-xl border border-border/40 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{sub.name || 'Anonymous Supporter'}</p>
                          <p className="text-[10px] text-muted-foreground">{sub.email} · Found via: {sub.how_found || 'Direct'}</p>
                        </div>
                        <Badge className="bg-primary/20 text-primary border border-primary/30">
                          Joined {new Date(sub.created_date).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Supporter Actions</CardTitle>
                <CardDescription className="text-xs">Quick shortcuts for supporter interactions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/subscribers'}>
                  <Users className="w-4 h-4 mr-2 text-primary" /> Manage CRM Profiles
                </Button>
                <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/supporters'}>
                  <Heart className="w-4 h-4 mr-2 text-red-500" /> View Supporter Contributions
                </Button>
                <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/thank-you-cards'}>
                  <Award className="w-4 h-4 mr-2 text-yellow-400" /> Draft Fan Thank You Cards
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: STORY VAULT & EPISODE ENGINE ───────────────────────── */}
        <TabsContent value="story-vault" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Add Life Memory / Evidence</CardTitle>
                <CardDescription className="text-xs">Log letters, transcripts, or notes to structure into video episodes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-white">Memory Title</Label>
                  <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Sonia text about THANKYOU in Portuguese" className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Theme / Segment</Label>
                  <Select value={newTheme} onValueChange={setNewTheme}>
                    <SelectTrigger className="bg-secondary/40 border-border/40 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STORY_THEMES.map(theme => (
                        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Sensitivity Gate</Label>
                  <Select value={newSensitivity} onValueChange={setNewSensitivity}>
                    <SelectTrigger className="bg-secondary/40 border-border/40 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Release Safe</SelectItem>
                      <SelectItem value="private">Private Archive</SelectItem>
                      <SelectItem value="legal-sensitive">Legal / Sensitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-white">Memory Details / Portuguese Letter Copy</Label>
                  <Textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Type transcripts or Portuguese dialogues..." rows={5} className="bg-secondary/40 text-xs border-border/40" />
                </div>
                <Button onClick={() => addMemory.mutate()} disabled={!newTitle || !newContent || addMemory.isPending} className="w-full gradient-gold-button border-0 text-xs">
                  {addMemory.isPending ? 'Logging...' : 'Save to Story Vault'}
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/40">
              <CardHeader>
                <CardTitle className="font-display text-lg text-white">Vault Content & Episode Outlines</CardTitle>
                <CardDescription className="text-xs">Compile saved moments into 10–15 minute YouTube outlines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingMem ? (
                  <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary" /></div>
                ) : memories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-xs">No memories loaded in database.</div>
                ) : (
                  <div className="space-y-3">
                    {memories.map(mem => (
                      <div key={mem.id} className="p-3 bg-secondary/20 rounded-xl border border-border/20 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-white">{mem.title}</p>
                          <div className="flex gap-1.5">
                            <Badge className="bg-yellow-500/10 text-yellow-400 text-[9px] border-0">{mem.tags?.[0]}</Badge>
                            <Badge className="bg-blue-500/10 text-blue-400 text-[9px] border-0">{mem.tags?.[1]}</Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-[11px] line-clamp-3">{mem.content}</p>
                        <div className="flex justify-between pt-2 border-t border-border/10">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] border-border/40"
                            onClick={() => generateEpisodeOutline(mem)}
                          >
                            Generate Episode Script & Hook
                          </Button>
                          <button onClick={() => deleteMemory.mutate(mem.id)} className="text-muted-foreground/40 hover:text-destructive transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {generatingOutline && (
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/40 text-center text-xs space-y-2">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                    <p>AI Engine compiling Portuguese notes and timelines into a structured 10-15 minute episode script...</p>
                  </div>
                )}

                {vaultOutline && (
                  <Card className="border-yellow-500/20 bg-yellow-500/5 mt-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-white">Generated Episode Script Outline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <pre className="p-3 bg-secondary/40 rounded-lg text-[10px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                        {vaultOutline}
                      </pre>
                      <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { navigator.clipboard.writeText(vaultOutline); toast({ title: 'Script Outline Copied' }); }}>
                        Copy Script for Recording
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: RELEASES ─────────────────────────────────────────── */}
        <TabsContent value="releases" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = '/admin/releases'}>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                  Track Catalogue <Music className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Manage single releases, audio stems, artwork, and streaming distribution platforms.</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = '/admin/videos'}>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                  Videos & Visuals <Film className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Upload and configure YouTube links or promotional video reels.</p>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = '/admin/mastering'}>
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                  Mastering Console <Award className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Verify WAV/MP3 stereo width, dynamic range estimates, and streaming loudness targets.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB: NEWSLETTER ────────────────────────────────────────── */}
        <TabsContent value="newsletter" className="space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-display text-lg text-white">Newsletter Engine</CardTitle>
              <CardDescription className="text-xs">Quick portal to send updates, release details, or merchandise offers directly to subscribers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/newsletter'}>
                <Mail className="w-4 h-4 mr-2 text-purple-400" /> Send a New Email Newsletter Campaign
              </Button>
              <Button variant="outline" className="w-full text-xs text-left justify-start border-border/40" onClick={() => window.location.href = '/admin/reveal-newsletter'}>
                <Award className="w-4 h-4 mr-2 text-yellow-400" /> Draft Sonia Memorial Celebration Newsletter
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB: QUICK LINKS ────────────────────────────────────────── */}
        <TabsContent value="quick-links" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Email Preferences', desc: 'Configure global sender domains and DKIM settings.', link: '/admin/settings' },
              { title: 'Fan Highlight Wall', desc: 'Approve and highlight fan comments on the public page.', link: '/admin/fans' },
              { title: 'Birthday Discounts', desc: 'Set up anniversary automated coupon distribution.', link: '/admin/birthdays' }
            ].map(item => (
              <Card key={item.title} className="hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.location.href = item.link}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-white flex items-center justify-between">
                    {item.title} <Send className="w-3.5 h-3.5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
