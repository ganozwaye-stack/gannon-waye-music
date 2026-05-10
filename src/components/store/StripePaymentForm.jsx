import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { base44 } from '@/api/base44Client';

let stripePromise = null;

async function getStripe() {
  if (!stripePromise) {
    const res = await base44.functions.invoke('getStripeConfig', {});
    stripePromise = loadStripe(res.data.publishableKey);
  }
  return stripePromise;
}

function PaymentForm({ total, mode, onSuccess, onError, promoCode }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isSetup = mode === 'setup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setLoading(true);
    setIsProcessing(true);

    if (isSetup) {
      // SetupIntent — save card only, NO charge today
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.origin + '/store' },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message);
        setLoading(false);
        setIsProcessing(false);
      } else if (setupIntent?.status === 'succeeded') {
        onSuccess({ id: setupIntent.id, type: 'setup', setupIntentId: setupIntent.id });
      } else {
        onError('Card setup incomplete. Please try again.');
        setLoading(false);
        setIsProcessing(false);
      }
      return;
    }

    // Immediate PaymentIntent flow
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/store' },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message);
      setLoading(false);
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    } else if (paymentIntent?.status === 'processing') {
      onError('Payment is processing. Please wait...');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSetup && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
          <p className="font-body text-xs text-primary leading-relaxed">
            🔒 Your card details are saved securely. <strong>No charge today.</strong> Payment of ${total.toFixed(2)} AUD processed on <strong>June 1, 2026</strong>.
          </p>
        </div>
      )}
      {promoCode && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary">Promo Applied</p>
            <p className="font-display text-sm text-foreground">{promoCode.code}</p>
          </div>
          <p className="font-display text-lg text-primary">-${promoCode.discount.toFixed(2)}</p>
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
          ? (isSetup ? 'Saving card...' : 'Processing...')
          : isSetup
            ? `Pre-order — Pay $${total.toFixed(2)} on June 1`
            : `Pay $${total.toFixed(2)}`
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

  useEffect(() => {
    const init = async () => {
      try {
        const [stripe, intentRes] = await Promise.all([
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
        ]);
        setStripeInstance(stripe);
        setClientSecret(intentRes.data.clientSecret);
      } catch (err) {
        setIntentError('Could not initialise payment. Please try again.');
      }
      setLoadingIntent(false);
    };
    init();
  }, [amount, mode]);

  if (loadingIntent) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (intentError) {
    return <p className="font-body text-sm text-destructive text-center py-4">{intentError}</p>;
  }

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#c9a84c',
      colorBackground: '#12151c',
      colorText: '#ede8da',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '8px',
    },
  };

  return (
    <Elements stripe={stripeInstance} options={{ clientSecret, appearance }}>
      <PaymentForm total={amount} mode={mode} onSuccess={onSuccess} onError={onError} promoCode={promoCode} />
    </Elements>
  );
}