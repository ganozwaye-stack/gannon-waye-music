import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Mail, Send, Copy, Check, Users } from 'lucide-react';

const NEWSLETTER_SUBJECT = "Welcome. You're part of something real 🤍";

const NEWSLETTER_BODY = `Hi there,

I don't know exactly what brought you here. Maybe it was a post, a reel, a song, a feeling. But whatever it was, I'm so glad you found your way to this page. And I mean that from the very bottom of my heart.

Welcome. You belong here.

I want to share something with you, because you've trusted me with your inbox and I think you deserve to know what this moment actually means to me.

I'm about to release my debut single, "Thank You", on the 10th of May 2026. And I know that might sound like just another release date, another countdown, another announcement. But for me? This is everything.

This song didn't come from nowhere. It came from one of the hardest chapters of my life.

For a long time, I was in a relationship where I experienced abuse. I stayed longer than I should have, not because I was weak, but because I genuinely didn't know what I deserved. I had spent so many years shrinking myself, quieting my own voice, moulding to what someone else needed me to be, that I had lost sight of who I actually was.

Leaving was hard. Healing has been harder in some ways. But it has also been the most profound, life-changing, and ultimately empowering thing I have ever done for myself.

Through professional help, therapy, support, and the courage to sit with the uncomfortable parts of myself, I began to rebuild. And through that rebuilding, music became something different for me. It stopped being a dream I was chasing and became a lifeline I was holding onto.

"Thank You" is that lifeline made into a song.

It's not a bitter song. It's not an angry song. It's actually (and this surprised even me) a song of gratitude. Gratitude for the pain that forced me to grow. Gratitude for the people who held me when I couldn't hold myself. Gratitude for the version of me that refused to disappear, even when everything in my life was telling me to.

I didn't truly love myself until I was 33. Before that, I woke up every day wishing I could be someone else. That fear of abandonment ran my life. Then something shifted and for the first time, I didn't want to be anyone else.

That shift is what this song is about.

So when I tell you that releasing this single is the most meaningful thing I have ever done, I mean it on a level that goes far beyond music.

This is me saying: I made it through. I'm still here. And I have something to say.

The artwork and official release date will be revealed on the 10th of May. I can't wait to share it with you. It's beautiful, and it means more to me than I can put into words right now.

I would love for you to be there when it drops. To listen. To share it. To let it find whoever needs to hear it.

If that's you, if you're in the middle of your own rebuilding, I just want you to know that this song was written for you too.

You are not alone in this.

Thank you for being here. Genuinely.

All my love,

Gannon 🤍

P.S. The artwork reveal is May 10th. Keep an eye on your inbox and socials. Something beautiful is coming. 🎶`;

export default function FanNewsletterDashboard() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const { data: subscribers } = useQuery({
    queryKey: ['emailSubscribers'],
    queryFn: () => base44.entities.EmailSubscriber.list(),
    initialData: [],
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${NEWSLETTER_SUBJECT}\n\n${NEWSLETTER_BODY}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendAll = async () => {
    if (subscribers.length === 0) {
      toast({ title: 'No subscribers yet', description: 'Nobody has signed up yet.', variant: 'destructive' });
      return;
    }
    setSending(true);
    let successCount = 0;
    for (const sub of subscribers) {
      try {
        await base44.integrations.Core.SendEmail({
          to: sub.email,
          subject: NEWSLETTER_SUBJECT,
          body: NEWSLETTER_BODY,
        });
        successCount++;
      } catch (e) {
        console.error('Failed to send to', sub.email, e);
      }
    }
    setSending(false);
    setSent(true);
    toast({ title: `Sent to ${successCount} subscriber${successCount !== 1 ? 's' : ''}! 🤍` });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Newsletter</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Your welcome newsletter, ready to send</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/60 border border-border/40 rounded-full px-4 py-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-body text-sm text-foreground">
            <strong>{subscribers.length}</strong> subscriber{subscribers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Subject line */}
      <div className="bg-secondary/40 border border-border/40 rounded-xl px-5 py-4 mb-4">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Subject</p>
        <p className="font-body text-sm text-foreground">{NEWSLETTER_SUBJECT}</p>
      </div>

      {/* Body preview */}
      <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-6 overflow-y-auto max-h-[60vh]">
        <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
          {NEWSLETTER_BODY}
        </pre>
      </div>

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
          disabled={sending || sent}
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Sending...
            </>
          ) : sent ? (
            <>
              <Check className="w-4 h-4" /> Sent!
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
        <p className="font-body text-xs text-muted-foreground mt-4 text-center">
          No subscribers yet. Share your site so fans can sign up!
        </p>
      )}
    </div>
  );
}