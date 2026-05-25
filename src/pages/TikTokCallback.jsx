import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// This page handles the OAuth callback from TikTok
// TikTok redirects to: https://gannonwaye.com/tiktok-callback?code=...&state=...
// The page stores the code in localStorage so TikTokConnectionCard can pick it up

export default function TikTokCallback() {
  const [status, setStatus] = useState('processing');
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

    if (code) {
      // Store code for the opener window to pick up
      localStorage.setItem('tiktok_oauth_code', code);
      setStatus('success');
      // Close popup after brief delay
      setTimeout(() => {
        if (window.opener) {
          window.close();
        }
      }, 2000);
    } else {
      setError('No authorization code received from TikTok');
      setStatus('error');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        {status === 'processing' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-foreground font-semibold">Processing TikTok authorization...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
            <p className="text-foreground font-semibold">TikTok Connected!</p>
            <p className="text-sm text-muted-foreground">Authorization successful. This window will close automatically.</p>
            <p className="text-xs text-muted-foreground">If it doesn't close, you can close this tab manually.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto" />
            <p className="text-foreground font-semibold">Authorization Failed</p>
            {error && <p className="text-sm text-muted-foreground">{error}</p>}
            <Link to="/admin/tiktok-review-demo" className="text-xs text-primary hover:underline">
              Return to TikTok Review Demo
            </Link>
          </>
        )}
      </div>
    </div>
  );
}