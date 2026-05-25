import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, XCircle, RefreshCw, Shield } from 'lucide-react';

// Stripe Mode Detector — safe, never shows secret values
// Reads mode from integrationHealthCheck response only

export default function StripeModeDetector({ onModeDetected }) {
  const [mode, setMode] = useState(null); // 'test' | 'live' | 'mismatch' | 'missing' | 'unknown'
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState('');

  const detect = async () => {
    setLoading(true);
    setMode('unknown');
    try {
      const res = await base44.functions.invoke('integrationHealthCheck', {});
      const checks = res.data?.checks || [];
      const alerts = res.data?.alerts || [];

      const skCheck = checks.find(c => c.platform === 'Stripe Secret Key');
      const mismatchAlert = alerts.find(a => a.type === 'stripe_pk_test' || a.type?.includes('mismatch'));

      if (!skCheck) {
        setMode('missing');
        setDetail('STRIPE_SECRET_KEY not found or not configured.');
      } else if (mismatchAlert || (skCheck.status === 'live' && alerts.some(a => a.message?.includes('test mode')))) {
        setMode('mismatch');
        setDetail('STRIPE_SECRET_KEY is LIVE but STRIPE_PUBLISHABLE_KEY is in TEST mode. Do not process any payments until resolved.');
      } else if (skCheck.status === 'test') {
        setMode('test');
        setDetail('Both keys are in test mode. Safe to use Stripe test cards.');
      } else if (skCheck.status === 'live') {
        setMode('live');
        setDetail('Both keys are in live mode. Do NOT use test cards. Use a real controlled purchase only.');
      } else {
        setMode('unknown');
        setDetail('Could not determine Stripe mode from health check response.');
      }
    } catch (e) {
      setMode('unknown');
      setDetail(`Health check failed: ${e.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    detect();
  }, []);

  useEffect(() => {
    if (mode && onModeDetected) onModeDetected(mode);
  }, [mode]);

  const configs = {
    test: {
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
      badge: 'bg-green-500/20 text-green-200 border-green-500/40',
      label: 'Test Mode',
      border: 'border-green-500/30 bg-green-500/5',
      instruction: 'Safe to use Stripe test card: 4242 4242 4242 4242 / exp 12/26 / CVC 123',
    },
    live: {
      icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
      badge: 'bg-orange-500/20 text-orange-200 border-orange-500/40',
      label: 'Live Mode',
      border: 'border-orange-500/30 bg-orange-500/5',
      instruction: 'DO NOT use test cards. Use a real approved low-value purchase, or create a temporary $1.00 test product approved by Gannon.',
    },
    mismatch: {
      icon: <XCircle className="w-4 h-4 text-red-400" />,
      badge: 'bg-red-500/20 text-red-200 border-red-500/40',
      label: 'MISMATCH — DO NOT TEST',
      border: 'border-red-500/40 bg-red-500/10',
      instruction: 'CRITICAL: Secret key and publishable key are in different modes. Do not process any payments. Fix in Base44 Secrets dashboard before proceeding.',
    },
    missing: {
      icon: <XCircle className="w-4 h-4 text-red-400" />,
      badge: 'bg-red-500/20 text-red-200 border-red-500/40',
      label: 'Missing Keys',
      border: 'border-red-500/40 bg-red-500/10',
      instruction: 'Stripe keys are not configured. Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in Base44 Secrets.',
    },
    unknown: {
      icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
      badge: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
      label: 'Unknown',
      border: 'border-yellow-500/30 bg-yellow-500/5',
      instruction: 'Cannot determine Stripe mode. Run integrationHealthCheck before attempting any checkout test.',
    },
  };

  const cfg = configs[mode] || configs.unknown;

  return (
    <Card className={`border ${cfg.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold text-foreground">Stripe Mode</span>
            {loading ? (
              <Badge className="bg-secondary text-muted-foreground border-border"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Detecting...</Badge>
            ) : (
              <div className="flex items-center gap-1">
                {cfg.icon}
                <Badge className={cfg.badge}>{cfg.label}</Badge>
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={detect} disabled={loading}>
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />Recheck
          </Button>
        </div>
        {!loading && mode && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-muted-foreground">{detail}</p>
            <p className={`text-xs font-medium ${mode === 'test' ? 'text-green-300' : mode === 'live' ? 'text-orange-300' : 'text-red-300'}`}>
              {cfg.instruction}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}