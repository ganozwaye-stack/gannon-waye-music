import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

// TikTok redirects here: https://gannonwaye.com/tiktok-callback?code=...&state=...
//
// Two flows:
//   A. Popup flow:  window.opener exists → store code in localStorage → close popup
//                   TikTokConnectionCard's storage listener picks it up & exchanges
//   B. Same-tab flow: no opener → exchange code directly here → redirect back

export default function TikTokCallback() {
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorParam) {
      setError(errorDescription || errorParam);
      setStatus('error');
      return;
    }

    if (!code) {
      setError('No authorization code received from TikTok.');
      setStatus('error');
      return;
    }

    // Determine flow
    const isPopup = !!window.opener;

    if (isPopup) {
      // Flow A: Popup — hand the code to the opener via localStorage
      try {
        localStorage.setItem('tiktok_oauth_code', code);
      } catch (_) {}
      setMessage('Authorization received. Closing...');
      setStatus('success');
      setTimeout(() => {
        try { window.close(); } catch (_) {}
      }, 1500);
    } else {
      // Flow B: Same-tab redirect — exchange code here, then redirect back
      setMessage('Exchanging authorization code with TikTok...');
      exchangeCode(code);
    }
  }, []);

  const exchangeCode = async (code) => {
    try {
      const res = await base44.functions.invoke('tiktokOAuth', { action: 'exchange_code', code });
      if (res.data?.success) {
        const name = res.data.display_name || res.data.username || 'TikTok Creator';
        setMessage(`Connected as ${name}. Redirecting...`);
        setStatus('success');
        // Signal the review page to refresh status on return
        sessionStorage.setItem('tiktok_just_connected', '1');
        setTimeout(() => {
          window.location.href = '/tiktok-platform-review';
        }, 1800);
      } else {
        setError(res.data?.error || 'Token exchange failed. Check backend logs.');
        setStatus('error');
      }
    } catch (err) {
      setError(err.message || 'Token exchange request failed.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-foreground font-semibold">Processing TikTok authorization...</p>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
            <p className="text-foreground font-semibold">TikTok Connected!</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground/60">
              Tokens are stored server-side only — never visible in this browser.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <p className="text-foreground font-semibold">Authorization Failed</p>
            {error && <p className="text-sm text-muted-foreground">{error}</p>}
            <a
              href="/tiktok-platform-review"
              className="text-xs text-primary hover:underline block"
            >
              ← Return to TikTok Platform Review
            </a>
          </>
        )}
      </div>
    </div>
  );
}