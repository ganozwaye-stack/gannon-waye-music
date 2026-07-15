import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Copy, Check, Users, Loader2, Mail, History, Plus, Trash2 } from 'lucide-react';

const WELCOME_TEMPLATE = {
  subject: "Welcome. You're part of something real 🤍",
  body: `Hi there,

I don't know exactly what brought you here. Maybe it was a post, a reel, a song, a feeling. But whatever it was, I'm so glad you found your way to this page. And I mean that from the very bottom of my heart.

Welcome. You belong here.

I'm about to release my debut single, "Thank You". This song didn't come from nowhere. It came from one of the hardest chapters of my life.

Through professional help, therapy, support, and the courage to sit with the uncomfortable parts of myself, I began to rebuild. And through that rebuilding, music became something different for me. It stopped being a dream I was chasing and became a lifeline I was holding onto.

"Thank You" is that lifeline made into a song.

It's not a bitter song. It's not an angry song. It's actually a song of gratitude. Gratitude for the pain that forced me to grow. Gratitude for the people who held me when I couldn't hold myself.

So when I tell you that releasing this single is the most meaningful thing I have ever done, I mean it on a level that goes far beyond music.

This is me saying: I made it through. I'm still here. And I have something to say.

All my love,

Gannon 🤍`
};

const EMPTY_NEWSLETTER = {
  subject: '',
  body: '',
};

export default function FanNewsletterDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState('compose');
  const [newsletter, setNewsletter] = useState(EMPTY_NEWSLETTER);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: subscribers = [] } = useQuery({
    queryKey: ['emailSubscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
  });

  const { data: sentHistory = [] } = useQuery({
    queryKey: ['sentNewsletters'],
    queryFn: () => base44.entities.EmailSubscriber.filter({ source: 'newsletter_broadcast' }),
  });

  const set = (field, val) => setNewsletter(n => ({ ...n, [field]: val }));

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${newsletter.subject}\n\n${newsletter.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAll = async () => {
    if (!newsletter.subject || !newsletter.body) {
      toast({ title: 'Missing content', description: 'Subject and body are required.', variant: 'destructive' });
      return;
    }
    if (subscribers.length === 0) {
      toast({ title: 'No subscribers yet', description: 'Nobody has signed up yet.', variant: 'destructive' });
      return;
    }
    setSending(true);
    let successCount = 0;
    let failCount = 0;
    for (const sub of subscribers) {
      try {
        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: newsletter.subject,
          body: newsletter.body,
        });
        successCount++;
      } catch (e) {
        failCount++;
      }
    }
    setSending(false);
    toast({
      title: `Sent to ${successCount} subscriber${successCount !== 1 ? 's' : ''}! 🤍`,
      description: failCount > 0 ? `${failCount} failed to send.` : undefined,
    });
    setNewsletter(EMPTY_NEWSLETTER);
  };

  const loadTemplate = () => setNewsletter(WELCOME_TEMPLATE);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin · Private</p>
          <h1 className="font-display text-2xl text-foreground">Fan Newsletter</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Compose and send newsletters to your subscribers</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/60 border border-border/40 rounded-full px-4 py-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-body text-sm text-foreground">
            <strong>{subscribers.length}</strong> subscriber{subscribers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('compose')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs transition-all ${mode === 'compose' ? 'bg-primary text-primary-foreground' : 'border border-border/40 text-muted-foreground hover:border-primary/40'}`}
        >
          <Mail className="w-3.5 h-3.5" /> Compose
        </button>
        <button
          onClick={() => setMode('history')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs transition-all ${mode === 'history' ? 'bg-primary text-primary-foreground' : 'border border-border/40 text-muted-foreground hover:border-primary/40'}`}
        >
          <History className="w-3.5 h-3.5" /> History
        </button>
      </div>

      {mode === 'compose' && (
        <>
          {/* Template button */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadTemplate} className="gap-2">
              <Plus className="w-3.5 h-3.5" /> Load Welcome Template
            </Button>
            <span className="text-xs text-muted-foreground/50">or compose from scratch</span>
          </div>

          {/* Compose form */}
          <div className="space-y-3">
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Subject</label>
              <Input
                value={newsletter.subject}
                onChange={e => set('subject', e.target.value)}
                placeholder="Your newsletter subject line..."
                className="bg-secondary/50"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Body</label>
              <Textarea
                value={newsletter.body}
                onChange={e => set('body', e.target.value)}
                placeholder="Write your newsletter content here..."
                className="bg-secondary/50 min-h-[400px] font-body text-sm leading-relaxed"
              />
            </div>
            <p className="text-xs text-muted-foreground/50">{newsletter.body.length} characters</p>
          </div>

          {/* Preview */}
          {newsletter.body && (
            <div className="bg-card border border-border/40 rounded-2xl p-5">
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2">Preview</p>
              <p className="font-body text-sm font-semibold text-foreground mb-3">{newsletter.subject}</p>
              <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{newsletter.body}</pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-full font-body text-sm tracking-wider uppercase border-foreground/20"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
            <Button
              className="gap-2 rounded-full font-body text-sm tracking-wider uppercase flex-1 sm:flex-none"
              onClick={handleSendAll}
              disabled={sending || !newsletter.subject || !newsletter.body}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending to {subscribers.length} subscribers...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to All {subscribers.length > 0 ? `(${subscribers.length})` : ''} Subscribers
                </>
              )}
            </Button>
          </div>

          {subscribers.length === 0 && (
            <p className="font-body text-xs text-muted-foreground text-center">
              No subscribers yet. Share your site so fans can sign up!
            </p>
          )}
        </>
      )}

      {mode === 'history' && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Newsletter send history will appear here as you send broadcasts.</p>
          {sentHistory.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No newsletters sent yet.</p>
            </div>
          ) : (
            sentHistory.map(s => (
              <div key={s.id} className="bg-card border border-border/40 rounded-xl p-4">
                <p className="text-sm font-semibold text-foreground">{s.email}</p>
                <p className="text-xs text-muted-foreground">{new Date(s.created_date).toLocaleString('en-AU')}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}