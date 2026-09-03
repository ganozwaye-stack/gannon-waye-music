import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, LoaderCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useCartStore } from '@/lib/cartStore';

const DETAILS_KEY = 'gannon_checkout_details_v1';
const SESSION_ID_PATTERN = /^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/;

export default function CheckoutSuccess() {
  const [reference, setReference] = useState('');
  const [verification, setVerification] = useState({
    status: 'verifying',
    message: 'Confirming the payment directly with Stripe...',
  });
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = String(params.get('session_id') || '').trim();

    if (!SESSION_ID_PATTERN.test(sessionId)) {
      setReference('');
      setVerification({
        status: 'not_verified',
        message: 'This page does not contain a valid Stripe checkout reference. No payment is being claimed as received.',
      });
      return undefined;
    }

    setReference(`Ending ${sessionId.slice(-8)}`);

    let cancelled = false;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Payment verification timed out.')), 15000)
    );

    Promise.race([
      base44.functions.invoke('verifyCheckoutSession', { session_id: sessionId }),
      timeout,
    ]).then(response => {
      if (cancelled) return;
      const result = response?.data || {};

      if (!result.verified) {
        setVerification({
          status: 'not_verified',
          message: 'Stripe has not confirmed this payment as complete. Do not retry payment until you check the original Stripe page or contact support.',
        });
        return;
      }

      clearCart();
      try {
        sessionStorage.removeItem(DETAILS_KEY);
      } catch {}

      if (result.order_recorded) {
        setVerification({
          status: 'verified',
          message: 'Stripe has confirmed your payment and your order has been recorded.',
        });
      } else {
        setVerification({
          status: 'reconciling',
          message: 'Stripe has confirmed your payment. The order record is still being reconciled, so please do not pay again.',
        });
      }
    }).catch(() => {
      if (cancelled) return;
      setVerification({
        status: 'unavailable',
        message: 'We could not verify the payment right now. Your cart has not been cleared. Please do not submit another payment until you check Stripe or contact support.',
      });
    });

    return () => {
      cancelled = true;
    };
  }, [clearCart]);

  const verified = verification.status === 'verified' || verification.status === 'reconciling';
  const title = verification.status === 'verifying'
    ? 'Verifying Payment'
    : verified
      ? 'Payment Confirmed'
      : 'Payment Not Confirmed';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" data-testid="checkout-success-page">
      <div className="max-w-md w-full text-center space-y-6" aria-live="polite">
        {verification.status === 'verifying' ? (
          <LoaderCircle className="w-16 h-16 text-primary mx-auto animate-spin" aria-hidden="true" />
        ) : verified ? (
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto" aria-hidden="true" />
        ) : (
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto" aria-hidden="true" />
        )}

        <h1 className="font-display text-3xl text-foreground">{title}</h1>
        <p className="font-body text-base text-muted-foreground">{verification.message}</p>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-left space-y-3">
          {verified ? (
            <>
              <p className="font-body text-sm text-foreground/80 leading-relaxed">
                A transactional receipt should be sent to the email used at checkout.
              </p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed">
                Keep the masked reference below if you need order support.
              </p>
            </>
          ) : (
            <p className="font-body text-sm text-foreground/80 leading-relaxed">
              A return to this page alone is not proof of payment. Confirmation is shown only after a direct server-side Stripe check.
            </p>
          )}
          {reference && (
            <p className="font-body text-xs text-muted-foreground mt-2">
              Stripe reference: <span className="font-mono text-xs">{reference}</span>
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
