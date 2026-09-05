import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Too Lost OAuth callback. The authorize screen redirects here with ?code=...;
// the code is exchanged server-side for tokens stored in the TooLostConnection
// entity — no API token is ever kept as a platform secret.
export default function TooLostCallback() {
  const [status, setStatus] = useState('working');
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    const code = params.get('code');
    const state = params.get('state');
    const savedState = sessionStorage.getItem('toolost_oauth_state');

    if (oauthError) {
      setError(`Too Lost returned an error: ${oauthError}`);
      setStatus('failed');
      return;
    }
    if (!code) {
      setError('No authorization code was received from Too Lost.');
      setStatus('failed');
      return;
    }
    if (savedState && state && savedState !== state) {
      setError('The security check did not match. Please start the connection again.');
      setStatus('failed');
      sessionStorage.removeItem('toolost_oauth_state');
      return;
    }

    base44.functions
      .invoke('tooLostOAuth', { action: 'exchange', code })
      .then(() => setStatus('connected'))
      .catch((err) => {
        setError(err?.response?.data?.error || err?.message || 'The connection could not be completed.');
        setStatus('failed');
      })
      .finally(() => sessionStorage.removeItem('toolost_oauth_state'));
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center border border-border/40 rounded-2xl p-8 bg-card/40">
        {status === 'working' && (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="font-body text-sm text-muted-foreground mt-4">Connecting your Too Lost account…</p>
          </>
        )}
        {status === 'connected' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
            <h1 className="font-display text-2xl text-foreground mt-3">Too Lost connected</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Your account is linked. New releases now sync straight from the New Release Studio.
            </p>
            <Link to="/admin/new-release-studio" className="inline-block mt-5 gradient-gold-button rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase">
              Open New Release Studio
            </Link>
          </>
        )}
        {status === 'failed' && (
          <>
            <XCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h1 className="font-display text-2xl text-foreground mt-3">Connection failed</h1>
            <p className="font-body text-sm text-muted-foreground mt-2">{error}</p>
            <Link to="/admin/distributors" className="inline-block mt-5 border border-border/50 rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase text-muted-foreground">
              Back to Distributors
            </Link>
          </>
        )}
      </div>
    </div>
  );
}