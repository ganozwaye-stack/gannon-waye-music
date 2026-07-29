import React, { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { ShoppingBag, RefreshCw, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

let stripePromise = null;

async function getStripe() {
  if (!stripePromise) {
    const res = await base44.functions.invoke('getStripeConfig', {});
    stripePromise = loadStripe(res.data.publishableKey);
  }
  return stripePromise;
}

function PaymentForm({ total, mode, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const submittedRef = useRef(false);
  const isSetup = mode === 'setup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || submittedRef.current) return;

    submittedRef.current = true;
    setLoading(true);

    try {
      if (isSetup) {
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: { return_url: window.location.origin + '/store' },
          redirect: 'if_required',
        });

        if (error) {
          onError(error.message || 'Card setup failed. Please try again.');
        } else if (setupIntent?.status === 'succeeded') {
          onSuccess({ id: setupIntent.id, type: 'setup', setupIntentId: setupIntent.id });
          return; // keep button disabled — order creation in progress
        } else {
          onError('Card setup incomplete. Please try again.');
        }
      } else {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: window.location.origin + '/store' },
          redirect: 'if_required',
        });

        if (error) {
          onError(error.message || 'Payment failed. Please try again.');
        } else if (paymentIntent?.status === 'succeeded') {
          onSuccess(paymentIntent);
          return; // keep button disabled — order creation in progress
        } else if (paymentIntent?.status === 'processing') {
          onError('Payment is processing — please wait a moment and check your email for confirmation.');
          return;
        } else {
          onError('Payment status unknown. Please do not retry — check your email for confirmation.');
        }
      }
    } catch (err) {
      onError('Something went wrong. You have not been charged. Please try again.');
    } finally {
      submittedRef.current = false;
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSetup ? (
        <div className="bg-secondary/30 border border-border/40 rounded-xl p-3 text-center">
          <p className="font-body text-xs text-foreground/70 leading-relaxed">
            🔒 Enter your card details below to secure your pre-order. <strong>No charge today.</strong>
          </p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Payment of <span className="text-primary font-semibold">${total.toFixed(2)} AUD</span> will be processed on <strong>June 5, 2026</strong>.
          </p>
        </div>
      ) : (
        <div className="bg-secondary/30 border border-border/40 rounded-xl p-3 text-center">
          <p className="font-body text-xs text-foreground/70 leading-relaxed">
            🔒 Enter your card details below. Your details are processed securely by Stripe — never stored by us.
          </p>
        </div>
      )}

      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase mt-4"
      >
        <ShoppingBag className="w-4 h-4 mr-2" />
        {loading
          ? (isSetup ? 'Securing pre-order…' : 'Processing payment…')
          : isSetup
            ? `Pre-order — Charge $${total.toFixed(2)} on June 5`
            : `Pay $${total.toFixed(2)} AUD`
        }
      </Button>
    </form>
  );
}

export default function StripePaymentForm({ amount, customerEmail, customerName, productName, metadata, onSuccess, onError, promoCode, mode = 'payment' }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [intentError, setIntentError] = useState(null);
  const initRef = useRef(false);

  const init = async () => {
    setLoadingIntent(true);
    setIntentError(null);
    initRef.current = true;

    // 15-second timeout guard
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Checkout timed out. Please try again.')), 15000)
    );

    try {
      const [stripe, intentRes] = await Promise.race([
        Promise.all([
          getStripe(),
          base44.functions.invoke('createPaymentIntent', {
            amount,
            currency: 'aud',
            customerEmail,
            customerName,
            productName,
            metadata,
            mode,
          }),
        ]),
        timeout,
      ]);

      if (!intentRes?.data?.clientSecret) {
        throw new Error('Checkout session could not be created. Please try again.');
      }

      setStripeInstance(stripe);
      setClientSecret(intentRes.data.clientSecret);
    } catch (err) {
      setIntentError(err.message || 'Could not prepare checkout. You have not been charged. Please try again.');
    } finally {
      setLoadingIntent(false);
    }
  };

  useEffect(() => {
    init();
  }, [amount, mode]);

  if (loadingIntent) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="font-body text-xs text-muted-foreground">Preparing secure checkout…</p>
      </div>
    );
  }

  if (intentError) {
    return (
      <div className="space-y-3 py-4">
        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm text-destructive font-medium">Checkout could not be initialised</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{intentError}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">You have <strong>not</strong> been charged.</p>
          </div>
        </div>
        <Button variant="outline" onClick={init} className="w-full gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      </div>
    );
  }

  const appearance = /** @type {const} */ ({
    theme: 'night',
    variables: {
      colorPrimary: '#c9a84c',
      colorBackground: '#12151c',
      colorText: '#ede8da',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px',
    },
  });

  return (
    <Elements stripe={stripeInstance} options={{ clientSecret, appearance }}>
      <PaymentForm total={amount} mode={mode} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
