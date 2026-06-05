import { useState } from 'react';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import StepBlock from './StepBlock';
import SecureSecretInput from './SecureSecretInput';

const CAPS = [
  { id: 'daily_cap', label: 'Daily spend cap (AUD)', placeholder: 'e.g. 5' },
  { id: 'weekly_cap', label: 'Weekly spend cap (AUD)', placeholder: 'e.g. 20' },
  { id: 'monthly_cap', label: 'Monthly spend cap (AUD)', placeholder: 'e.g. 50' },
  { id: 'deep_research_limit', label: 'Max deep research queries/day', placeholder: 'e.g. 3' },
];

export default function SetupAIKeysFlow({ onComplete, onBlocked }) {
  const [phase, setPhase] = useState('caps');
  const [caps, setCaps] = useState({});
  const [hardStop, setHardStop] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [openaiSaved, setOpenaiSaved] = useState(false);
  const [perplexitySaved, setPerplexitySaved] = useState(false);
  const [openaiSkipped, setOpenaiSkipped] = useState(false);
  const [perplexitySkipped, setPerplexitySkipped] = useState(false);

  const capsComplete = CAPS.every(c => caps[c.id]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🤖</span>
          <h2 className="font-semibold text-lg">AI Model Keys + Cost Controls</h2>
          <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30">High Priority</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Cost controls must be set before keys are entered. Base44 InvokeLLM fallback is always available.</p>
      </div>

      <StepBlock number={1} title="Set Cost Controls First" status={capsComplete ? 'done' : 'active'} why="Without spend caps, AI usage can accumulate unexpected costs. Hard stops prevent runaway charges.">
        <div className="grid grid-cols-2 gap-3 mb-3">
          {CAPS.map(cap => (
            <div key={cap.id}>
              <label className="text-xs text-muted-foreground block mb-1">{cap.label}</label>
              <Input
                type="number"
                placeholder={cap.placeholder}
                value={caps[cap.id] || ''}
                onChange={e => setCaps(c => ({ ...c, [cap.id]: e.target.value }))}
                className="text-sm"
              />
            </div>
          ))}
        </div>
        <div className="space-y-2 mb-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            <input type="checkbox" checked={hardStop} onChange={e => setHardStop(e.target.checked)} className="w-3 h-3" />
            Hard stop enabled — block all AI calls when monthly cap is reached
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            <input type="checkbox" checked={requireApproval} onChange={e => setRequireApproval(e.target.checked)} className="w-3 h-3" />
            Require approval for queries above threshold
          </label>
        </div>
        {capsComplete && (
          <Button onClick={() => setPhase('keys')} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> Cost Controls Set — Continue to Keys
          </Button>
        )}
      </StepBlock>

      {phase === 'keys' && (
        <>
          <StepBlock number={2} title="OpenAI API Key" status={openaiSaved ? 'done' : openaiSkipped ? 'skipped' : 'active'} why="Used for advanced agent reasoning. Falls back to Base44 InvokeLLM if not set.">
            {!openaiSaved && !openaiSkipped && (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Get your key from: <button onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')} className="text-primary underline inline-flex items-center gap-1">platform.openai.com/api-keys <ExternalLink className="w-3 h-3" /></button>
                </p>
                <SecureSecretInput label="OPENAI_API_KEY" secretName="OPENAI_API_KEY" placeholder="sk-..." onSaved={() => setOpenaiSaved(true)} />
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setOpenaiSkipped(true)}>Skip for now — use Base44 fallback</Button>
              </>
            )}
            {(openaiSaved || openaiSkipped) && (
              <div className={`rounded p-2 text-sm ${openaiSaved ? 'text-green-300' : 'text-muted-foreground'}`}>
                {openaiSaved ? '✅ OpenAI key saved securely' : '⏭️ Skipped — Base44 InvokeLLM fallback will be used'}
              </div>
            )}
          </StepBlock>

          <StepBlock number={3} title="Perplexity API Key" status={perplexitySaved ? 'done' : perplexitySkipped ? 'skipped' : 'active'} why="Used for deep research queries. Falls back to Base44 InvokeLLM + internet search if not set.">
            {!perplexitySaved && !perplexitySkipped && (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Get your key from: <button onClick={() => window.open('https://www.perplexity.ai/settings/api', '_blank')} className="text-primary underline inline-flex items-center gap-1">perplexity.ai/settings/api <ExternalLink className="w-3 h-3" /></button>
                </p>
                <SecureSecretInput label="PERPLEXITY_API_KEY" secretName="PERPLEXITY_API_KEY" placeholder="pplx-..." onSaved={() => setPerplexitySaved(true)} />
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setPerplexitySkipped(true)}>Skip for now — use Base44 fallback</Button>
              </>
            )}
            {(perplexitySaved || perplexitySkipped) && (
              <div className={`rounded p-2 text-sm ${perplexitySaved ? 'text-green-300' : 'text-muted-foreground'}`}>
                {perplexitySaved ? '✅ Perplexity key saved securely' : '⏭️ Skipped — Base44 InvokeLLM with internet search will be used'}
              </div>
            )}
          </StepBlock>

          {(openaiSaved || openaiSkipped) && (perplexitySaved || perplexitySkipped) && (
            <StepBlock number={4} title="AI Status Summary" status="active" why="Confirms what works now and what requires keys.">
              <div className="space-y-2 text-sm mb-3">
                <StatusRow label="Base44 InvokeLLM" value="always available" ok />
                <StatusRow label="OpenAI" value={openaiSaved ? 'connected' : 'using fallback'} ok={openaiSaved} />
                <StatusRow label="Perplexity" value={perplexitySaved ? 'connected' : 'using fallback'} ok={perplexitySaved} />
                <StatusRow label="Cost controls" value={`Daily $${caps.daily_cap} / Monthly $${caps.monthly_cap}${hardStop ? ' + hard stop' : ''}`} ok />
              </div>
              <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4" /> Mark AI Keys Complete
              </Button>
            </StepBlock>
          )}
        </>
      )}
    </div>
  );
}

function StatusRow({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border">
      <span className="text-muted-foreground">{label}</span>
      <Badge className={`text-xs border ${ok ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>{value}</Badge>
    </div>
  );
}