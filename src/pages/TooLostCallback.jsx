import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TooLostCallback() {
  const started = useRef(false);
  const [status, setStatus] = useState('working');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    const code = params.get('code');
    const state = params.get('state');
    window.history.replaceState({}, document.title, window.location.pathname);

    if (oauthError) {
      setError(`Too Lost returned an error: ${oauthError}`);
      setStatus('failed');
      return;
    }
    if (!code || !state) {
      setError('Too Lost did not return a complete authorization response. Please start again from Distributor Hub.');
      setStatus('failed');
      return;
    }

    base44.functions
      .invoke('tooLostOAuth', { action: 'exchange', code, state })
      .then(() => {
        try {
          localStorage.setItem('toolost_oauth_connected_at', String(Date.now()));
        } catch {
          // Distributor Hub also polls automatically, so storage notification is optional.
        }
        if (window.opener) {
          window.opener.postMessage({ type: 'toolost-oauth-complete' }, '*');
        }
        setStatus('connected');
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err?.message || 'The connection could not be completed.');
        setStatus('failed');
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center border border-border/40 rounded-2xl p-8 bg-card/40">
        {status === 'working' && (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="font-body text-sm text-muted-foreground mt-4">Connecting your Too Lost account...</p>
          </>
        )}
        {status === 'connected' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
            <h1 className="font-display text-2xl text-foreground mt-3">Too Lost connected</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Your account is linked securely. Distributor Hub will refresh automatically and renew the connection when needed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 mt-5">
              <Link to="/admin/distributors" className="gradient-gold-button rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase">
                Return to Distributor Hub
              </Link>
              <Link to="/admin/new-release-studio" className="border border-border/50 rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase text-muted-foreground">
                Open New Release Studio
              </Link>
            </div>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h1 className="font-display text-2xl text-foreground mt-3">Connection failed</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">{error}</p>
            <Link to="/admin/distributors" className="inline-block mt-5 border border-border/50 rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase text-muted-foreground">
              Back to Distributor Hub
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

