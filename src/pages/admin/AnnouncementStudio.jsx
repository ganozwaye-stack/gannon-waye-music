import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Send, Megaphone, CheckCircle2, Loader2, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const THANKYOU_ANNOUNCEMENT = `A message from Gannon

THANKYOU for your support everyone.

What an amazing journey it has been already, and what an incredible journey it will continue to be.

I can't explain how surreal it has felt to receive your feedback, to be welcomed with such a warm embrace, and to hear the stories people have trusted me with.

THANKYOU was born from a deeply personal chapter of my life, but watching it connect with others has reminded me why I created it in the first place.

Please remember, there is also a safe space on the website where we can connect, share, support and be part of something real together.

Join the community at:
gannonwaye.com/community

With love,
Gannon`;

const SOCIAL_CAPTION = `A message from Gannon 🤍

THANKYOU for your support everyone.

What an amazing journey it has been already, and what an incredible journey it will continue to be.

I can't explain how surreal it has felt to receive your feedback — to be welcomed with such a warm embrace, and to hear the stories people have trusted me with.

THANKYOU was born from a deeply personal chapter of my life, but watching it connect with others has reminded me why I created it in the first place.

There is a safe space on the website where we can all connect, share and support each other.

Join us at: gannonwaye.com/community 🌿

With love,
Gannon

#GannonWaye #ThankYou #Community #SafeSpace #IndieMusic #AustralianMusic #NewMusic #Gratitude`;

const EMAIL_SUBJECT = `A message from Gannon — THANKYOU 🤍`;
const EMAIL_BODY = `<!DOCTYPE html>
<html>
<body style="background:#0e1117;color:#f0ead6;font-family:Georgia,serif;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://media.base44.com/images/public/69eb7905ca6eb4180010f794/172f64a6b_0fac46594_generated_image-Edited.png" alt="Gannon Waye" style="height:50px;width:auto;" />
  </div>
  <h1 style="color:#f5d06e;font-size:28px;text-align:center;font-family:Georgia,serif;">THANKYOU 🤍</h1>
  <p style="color:#c9b99a;font-size:16px;text-align:center;font-style:italic;">A message from Gannon</p>
  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:16px;padding:28px;margin:28px 0;line-height:1.8;">
    <p>THANKYOU for your support everyone.</p>
    <p>What an amazing journey it has been already, and what an incredible journey it will continue to be.</p>
    <p>I can't explain how surreal it has felt to receive your feedback, to be welcomed with such a warm embrace, and to hear the stories people have trusted me with.</p>
    <p>THANKYOU was born from a deeply personal chapter of my life, but watching it connect with others has reminded me why I created it in the first place.</p>
    <p>Please remember, there is also a safe space on the website where we can connect, share, support and be part of something real together.</p>
  </div>
  <div style="text-align:center;margin:28px 0;">
    <a href="https://gannonwaye.com/community" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#f5d06e);color:#060c06;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;font-family:sans-serif;">
      Join the Community 🌿
    </a>
  </div>
  <p style="text-align:center;color:#f5d06e;font-size:18px;font-family:Georgia,serif;font-style:italic;">With love,<br/>Gannon</p>
  <p style="text-align:center;color:#555;font-size:11px;margin-top:32px;">
    You're receiving this as a supporter of Gannon Waye Music.<br/>
    <a href="https://gannonwaye.com/email-preferences" style="color:#888;">Manage email preferences</a>
  </p>
</div>
</body>
</html>`;

export default function AnnouncementStudio() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState(THANKYOU_ANNOUNCEMENT);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied!` });
  };

  const postToCommunitMut = useMutation({
    mutationFn: () => base44.entities.FanPost.create({
      author_name: 'Gannon Waye',
      author_email: 'gannonwayemusic@gmail.com',
      content: postContent,
      status: 'approved',
      moderation_status: 'approved',
      is_pinned: true,
    }),
    onSuccess: () => {
      setPosted(true);
      queryClient.invalidateQueries(['fanPosts']);
      toast({ title: 'Posted to community! 🤍' });
    },
  });

  const sendToApprovalMut = useMutation({
    mutationFn: () => base44.entities.ApprovalQueue.create({
      agent_name: 'Announcement Studio',
      action_title: 'Send THANKYOU email blast to all subscribers',
      action_description: `Subject: ${EMAIL_SUBJECT}\n\nSend the full THANKYOU announcement email to all subscribers. Review email body before approving.`,
      risk_type: ['reputation', 'commitment'],
      risk_level: 'medium',
      status: 'pending',
      proposed_output: EMAIL_BODY,
    }),
    onSuccess: () => toast({ title: 'Email blast sent to Approval Queue — check /admin/approval-queue' }),
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-gold-text">Announcement Studio</h1>
          <p className="text-muted-foreground text-sm mt-1">THANKYOU announcement — ready to post, copy and send</p>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">Ready to Deploy</Badge>
      </div>

      {/* Community Post */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Post to Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            className="min-h-[220px] font-body text-sm leading-relaxed"
          />
          <div className="flex gap-3 flex-wrap">
            {posted ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Posted to community!
                <Link to="/community" target="_blank">
                  <Button size="sm" variant="outline" className="text-xs rounded-full">View Post →</Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={() => postToCommunitMut.mutate()}
                disabled={postToCommunitMut.isPending}
                className="gradient-gold-button border-0 rounded-full gap-2"
              >
                {postToCommunitMut.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Posting...</> : <><Send className="w-4 h-4" />Post to Community</>}
              </Button>
            )}
            <Button variant="outline" onClick={() => copy(postContent, 'Community post')} className="rounded-full gap-2">
              <Copy className="w-4 h-4" /> Copy Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Caption */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-purple-400" /> Social Media Caption
            <Badge className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">TikTok · Instagram · Facebook</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-secondary/30 rounded-xl p-4 max-h-64 overflow-y-auto">
            {SOCIAL_CAPTION}
          </pre>
          <Button variant="outline" onClick={() => copy(SOCIAL_CAPTION, 'Social caption')} className="rounded-full gap-2">
            <Copy className="w-4 h-4" /> Copy Caption
          </Button>
        </CardContent>
      </Card>

      {/* Email blast */}
      <Card className="border-yellow-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="w-4 h-4 text-yellow-400" /> Email Blast — Subscriber List
            <Badge className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Requires Approval</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">Subject Line</p>
            <p className="font-body text-sm text-foreground">{EMAIL_SUBJECT}</p>
          </div>
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            This will send the full THANKYOU announcement to all email subscribers. For safety, this goes to the Approval Queue first — you approve before anything sends.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => sendToApprovalMut.mutate()}
              disabled={sendToApprovalMut.isPending}
              className="border-yellow-500/30 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-full gap-2"
              variant="outline"
            >
              {sendToApprovalMut.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Queuing...</> : <><Send className="w-4 h-4" />Send to Approval Queue</>}
            </Button>
            <Button variant="outline" onClick={() => copy(EMAIL_SUBJECT, 'Email subject')} className="rounded-full gap-2 text-xs">
              <Copy className="w-3 h-3" /> Copy Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Story Studio link */}
      <Card className="border-border/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Instagram Story Templates</p>
            <p className="text-xs text-muted-foreground mt-0.5">Story slides for the merch drop, bundle deal, and THANKYOU announcement</p>
          </div>
          <Link to="/admin/instagram-story-studio">
            <Button size="sm" variant="outline" className="rounded-full gap-2">
              Open Studio →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}