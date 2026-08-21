import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccess() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session_id'));
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" data-testid="checkout-success-page">
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
        <h1 className="font-display text-3xl text-foreground">Payment Received</h1>
        <p className="font-body text-base text-muted-foreground">Thank you for supporting the Thank You project.</p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-left space-y-3">
          <p className="font-body text-sm text-foreground/80 leading-relaxed">
            ✅ Your payment or pre-order has been received. A confirmation email will be sent to the email used at checkout.
          </p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed">
            If you do not receive an email within a few minutes, please contact us through the website.
          </p>
          {sessionId && (
            <p className="font-body text-xs text-muted-foreground mt-2">
              Reference: <span className="font-mono text-xs">{sessionId}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/store">
            <Button className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2">
              <ShoppingBag className="w-4 h-4" /> Return to Store
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full rounded-full font-body text-sm gap-2">
              <ArrowLeft className="w-4 h-4" /> Back Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" className="w-full rounded-full font-body text-xs text-muted-foreground gap-2">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}