import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Send, Copy, Check, Users } from 'lucide-react';

const NEWSLETTER_SUBJECT = "🎶 The moment is here. \"Thank You\" — Artwork Reveal & Release Date";

const NEWSLETTER_BODY = `Hi beautiful human,

I've been counting down to this moment for a long time. And now, here we are.

Today I am officially revealing the artwork for my debut single, "Thank You", along with the release date. This isn't just a song. It's the most honest thing I've ever created. And I can't wait for you to finally see the full picture.

🎨 THE ARTWORK IS LIVE

Head to gannonwaye.com right now to see the cover for the very first time. I'm genuinely emotional about this. The artwork captures something I couldn't put into words — and somehow, it says everything.

📅 RELEASE DATE: JUNE 5, 2026

Mark it. Save it. Tell someone you care about. "Thank You" arrives on June 5, 2026. Visit the store for current availability and any active promotion terms.

---

🤍 TO EVERY SINGLE ONE OF YOU WHO JOINED THIS COMMUNITY:

Thank you. From the very bottom of my heart.

Whether you found me through a post, a reel, a shared story, or just a feeling that something here was worth your time — I am so grateful. You showed up before a single note was publicly played. That means everything.

This community is something truly special to me. It is a safe space — a place built on support, encouragement, and kindness. That is not negotiable. Anyone who jeopardises the warmth of this space — through negativity, unkindness, or anything misaligned with love — will be promptly removed and reported. We protect each other here. Always.

---

TO THOSE OF YOU GOING THROUGH SOMETHING HARD RIGHT NOW:

I see you. I wrote this song from the middle of my own darkness — and I want you to know that the darkness does not win. You are not alone. You are not broken. You are in the middle of your story, not at the end of it. Hold on. Let this music find you.

If you ever need support, please reach out to someone you trust, or contact Lifeline on 13 11 14 (Australia).

---

🔥 EXCITING THINGS THAT HAVE HAPPENED:

• The countdown to today began with hundreds of you joining the Inner Circle — before a single note was officially released. That blew my mind.

• Fan media, messages, and support have been pouring in from across the country and beyond.

• The merch store is now open with pre-orders — tees, tote bags, CDs, and more are all available. The first orders are in. History is being made!

• The Thank You card personal message has been written and designed — every order will come with a handwritten-style note from me.

• The artwork reveal countdown was running on your screens, your feeds, your phones. You were all part of building the anticipation.

---

🗓️ THE NEXT 12 MONTHS:

This is just the beginning. "Thank You" is the first of many. Over the next 12 months, you can expect:

→ More music. More stories. More vulnerability.
→ A growing album that documents this chapter of becoming.
→ Live performances — I am working toward getting in front of you in person.
→ Behind-the-scenes content, personal reflections, and things I've never shared publicly before.
→ A community that keeps growing, keeps lifting, keeps showing up for each other.

I want us all to be more connected 12 months from now than we are today. I want this to feel like something we built together.

---

💛 A SMALL DARE FOR YOU (AND FOR ME):

I'm asking you to dare me on socials. Send me challenges, dares, questions, or ideas for content you want to see. If you have the courage to ask, I'll see if I have the courage to answer. hahaha

Tag me @gann0nwaye or DM me. Let's see what happens.

---

Finally — thank you for being here. For staying. For believing in something before the world had a chance to catch up.

This is for you.

All my love,

Gannon 🤍

P.S. June 5 is coming. Share this with someone who needs to hear it before the world catches on. Let's get "Thank You" heard. 🎶

gannonwaye.com`;

export default function RevealNewsletter() {
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
      toast({ title: 'No subscribers yet', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await base44.functions.invoke('sendRevealNewsletter', {});
      const { sent, failed } = res.data || {};
      setSent(true);
      toast({ title: `Sent to ${sent} subscriber${sent !== 1 ? 's' : ''}! 🎉${failed ? ` (${failed} failed)` : ''}` });
    } catch (e) {
      toast({ title: 'Failed to send. Check Gmail connector.', variant: 'destructive' });
    }
    setSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">May 10 Reveal</p>
          <h1 className="font-display text-2xl text-foreground">Reveal Day Newsletter</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Artwork reveal, release date announcement &amp; community love letter</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/60 border border-border/40 rounded-full px-4 py-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="font-body text-sm text-foreground">
            <strong>{subscribers.length}</strong> subscriber{subscribers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="bg-secondary/40 border border-border/40 rounded-xl px-5 py-4 mb-4">
        <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Subject</p>
        <p className="font-body text-sm text-foreground">{NEWSLETTER_SUBJECT}</p>
      </div>

      <div className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 mb-6 overflow-y-auto max-h-[60vh]">
        <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
          {NEWSLETTER_BODY}
        </pre>
      </div>

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
          className="gap-2 rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase flex-1 sm:flex-none"
          onClick={handleSendAll}
          disabled={sending || sent}
        >
          {sending ? (
            <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Sending...</>
          ) : sent ? (
            <><Check className="w-4 h-4" /> Sent!</>
          ) : (
            <><Send className="w-4 h-4" /> Send to All {subscribers.length > 0 ? `(${subscribers.length})` : ''} Subscribers</>
          )}
        </Button>
      </div>
    </div>
  );
}