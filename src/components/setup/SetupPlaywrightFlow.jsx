import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Copy, Upload, AlertTriangle, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StepBlock from './StepBlock';

const TEST_COMMANDS = `# 1. Install Playwright
npm install -D @playwright/test
npx playwright install chromium

# 2. Create .env.local (NEVER share this file)
ADMIN_SESSION_COOKIE=your_admin_session_cookie_here
BASE_URL=https://gannonwaye.com

# 3. Run tests
npx playwright test --project=chromium

# 4. Generate HTML report
npx playwright show-report`;

const TEST_ITEMS = [
  { id: 'home', label: 'Home page loads' },
  { id: 'store', label: 'Store loads with products' },
  { id: 'checkout_open', label: 'Checkout modal opens' },
  { id: 'checkout_submit', label: 'Checkout submits without freeze' },
  { id: 'admin_login', label: 'Admin login works' },
  { id: 'admin_orders', label: 'Admin orders list loads' },
  { id: 'nav_links', label: 'All nav links clickable' },
  { id: 'music_page', label: 'Music page loads' },
  { id: 'community', label: 'Community page loads' },
  { id: 'tiktok_callback', label: 'TikTok callback URL reachable' },
  { id: 'mobile_nav', label: 'Mobile navigation works' },
  { id: 'promo_code', label: 'Promo code validation works' },
];

export default function SetupPlaywrightFlow({ onComplete, onBlocked }) {
  const [phase, setPhase] = useState('intro');
  const [results, setResults] = useState({});
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(TEST_COMMANDS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleResult = (id, val) => setResults(r => ({ ...r, [id]: val }));

  const passed = Object.values(results).filter(v => v === 'passed').length;
  const failed = Object.values(results).filter(v => v === 'failed').length;
  const total = TEST_ITEMS.length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🧪</span>
          <h2 className="font-semibold text-lg">Playwright Browser QA</h2>
          <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30">High Priority</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Cannot auto-run from inside the app. Must be run from your terminal against the live site. Results can be imported here.</p>
      </div>

      <StepBlock number={1} title="Understand the Setup" status="done" why="Playwright runs a real browser externally. The app cannot simulate it internally.">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300 space-y-1">
          <p>✅ Test pack is already built at <strong>/admin/playwright-test-centre</strong></p>
          <p>✅ Tests run against gannonwaye.com from your machine</p>
          <p>⚠️ ADMIN_SESSION_COOKIE is stored in local <code>.env.local</code> only — never share it</p>
          <p>⚠️ Do NOT paste your admin cookie into this app</p>
        </div>
      </StepBlock>

      <StepBlock number={2} title="Copy Setup Commands" status={phase !== 'intro' ? 'done' : 'active'} why="Install Playwright and run tests from your terminal.">
        <div className="relative bg-secondary rounded-lg p-3 font-mono text-xs text-muted-foreground mb-3 whitespace-pre-wrap overflow-x-auto">
          {TEST_COMMANDS}
          <button onClick={copy} className="absolute top-2 right-2 p-1 rounded bg-primary/20 hover:bg-primary/40 text-primary">
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <Button onClick={() => setPhase('results')} variant="outline" className="gap-2">
          <Terminal className="w-4 h-4" /> I have run the tests — enter results
        </Button>
      </StepBlock>

      {phase === 'results' && (
        <StepBlock number={3} title="Record Test Results" status={passed + failed > 0 ? 'active' : 'waiting'} why="Failures get logged as SystemHealth issues and Business Attention Centre alerts automatically.">
          <p className="text-sm text-muted-foreground mb-3">For each test, mark Passed / Failed / Not Run:</p>
          <div className="space-y-2">
            {TEST_ITEMS.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <div className="flex gap-1">
                  {['passed', 'failed', 'blocked'].map(val => (
                    <button
                      key={val}
                      onClick={() => toggleResult(item.id, val)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        results[item.id] === val
                          ? val === 'passed' ? 'bg-green-500 text-white'
                            : val === 'failed' ? 'bg-red-500 text-white'
                            : 'bg-amber-500 text-white'
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {(passed + failed) > 0 && (
            <div className="mt-3 flex gap-3 text-sm">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{passed} passed</Badge>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">{failed} failed</Badge>
              <Badge className="bg-muted text-muted-foreground border-border">{total - passed - failed} not run</Badge>
            </div>
          )}

          {failed > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 mt-3">
              ⚠️ {failed} test(s) failed. Review failures at <strong>/admin/qa-failure-report</strong> and <strong>/admin/site-health</strong>. Failures have been logged.
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {failed === 0 && passed > 0 && (
              <Button onClick={onComplete} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4" /> All Tests Passed — Mark QA Complete
              </Button>
            )}
            {failed > 0 && (
              <Button onClick={onBlocked} variant="outline" className="gap-2">
                Mark QA Blocked — {failed} failures
              </Button>
            )}
            <Button variant="ghost" onClick={onComplete} size="sm">Mark as done anyway</Button>
          </div>
        </StepBlock>
      )}
    </div>
  );
}