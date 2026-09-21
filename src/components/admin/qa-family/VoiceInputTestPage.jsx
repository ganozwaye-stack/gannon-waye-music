import { useState } from 'react';
import VoiceInput from '@/components/voice/VoiceInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Mic } from 'lucide-react';

export default function VoiceInputTestPage() {
  const [transcript1, setTranscript1] = useState('');
  const [transcript2, setTranscript2] = useState('');
  const [transcript3, setTranscript3] = useState('');

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-display font-bold gradient-gold-text">Voice Input Test</h1>
        <p className="text-muted-foreground text-sm mt-1">Test voice-to-text on all form types</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-primary" />
            Textarea Test (Admin Forms)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <VoiceInput onTranscript={setTranscript1} />
            <span className="text-xs text-muted-foreground">Click mic, speak, text appears below</span>
          </div>
          <Textarea
            placeholder="Voice transcript will appear here..."
            value={transcript1}
            onChange={(e) => setTranscript1(e.target.value)}
            className="h-32"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-primary" />
            Input Test (Short Text)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <VoiceInput onTranscript={setTranscript2} />
            <span className="text-xs text-muted-foreground">Click mic, speak</span>
          </div>
          <Input
            placeholder="Voice transcript will appear here..."
            value={transcript2}
            onChange={(e) => setTranscript2(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-primary" />
            Content Creation Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <VoiceInput onTranscript={setTranscript3} />
          </div>
          <Textarea
            placeholder="Draft content with voice..."
            value={transcript3}
            onChange={(e) => setTranscript3(e.target.value)}
            className="h-48"
          />
          <p className="text-xs text-muted-foreground">
            Works on: Admin forms, public forms, chat interfaces, content creation, agent chat, approval queue items
          </p>
        </CardContent>
      </Card>
    </div>
  );
}