import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, ShieldCheck } from 'lucide-react';

const approvedSources = [
  'Approved family stories',
  'Approved eulogy transcript',
  'Approved funeral speeches',
  'Approved Sonia sayings',
  'Approved photo captions',
  'Approved voice message transcripts',
];

export default function SoniaMemoryChatAdmin() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const sourceText = useMemo(() => approvedSources.join(', '), []);

  const testReply = () => {
    if (!question.trim()) return;
    setResponse('This is the safe first version of Sonia Memory Chat. It will only answer from approved memories once the archive is connected. For now, collect the source material first: ' + sourceText + '.');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow">Sonia Memory Chat</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">Memory Chat Admin</h1>
        <p className="text-sm text-muted-foreground max-w-3xl">A private admin testing area for a memory companion that answers only from approved family material. It must never invent Sonia’s words or pretend to literally be her.</p>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Safety rule</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>This is a memory companion, not a replacement for Sonia. It should speak gently, cite the type of memory it is using, and say when it does not know.</p>
          <p>No synthetic Sonia voice is enabled in this phase. Voice cloning requires explicit family approval and clear labelling.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4 text-primary" />Approved source library</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {approvedSources.map(source => <Badge key={source} variant="outline" className="mr-2 mb-2">{source}</Badge>)}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" />Test chat shell</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Textarea rows={5} placeholder="Ask a test question for the future memory chat" value={question} onChange={event => setQuestion(event.target.value)} />
            <Button onClick={testReply}>Test safe reply</Button>
            {response && <div className="border border-border/50 rounded-lg p-4 text-sm text-muted-foreground">{response}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
