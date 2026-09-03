import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';

const safeReturnPath = (rawValue) => {
  if (!rawValue || !rawValue.startsWith('/') || rawValue.startsWith('//')) {
    return '/admin/dashboard';
  }

  try {
    const parsed = new URL(rawValue, window.location.origin);
    if (parsed.origin !== window.location.origin || parsed.pathname === '/login') {
      return '/admin/dashboard';
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/admin/dashboard';
  }
};

export default function Login() {
  const returnTo = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return safeReturnPath(params.get('returnTo') || params.get('from_url'));
  }, []);

  const beginSignIn = () => {
    base44.auth.redirectToLogin(returnTo);
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Owner sign-in"
      subtitle="Secure access for the Gannon Waye administration area"
      footer="No password or security code is collected by this website page."
    >
      <p className="text-sm leading-6 text-muted-foreground mb-6">
        Continue to Base44&apos;s secure sign-in service. After you sign in, you will return to the page you requested.
      </p>

      <Button type="button" className="w-full h-12" onClick={beginSignIn}>
        Continue to secure sign-in
      </Button>

      <Button asChild variant="ghost" className="w-full mt-3">
        <Link to="/">
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Return to the public site
        </Link>
      </Button>
    </AuthLayout>
  );
}
