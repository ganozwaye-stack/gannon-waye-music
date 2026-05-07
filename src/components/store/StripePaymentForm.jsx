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

function PaymentForm({ total, onSuccess, onError, promoCode }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/store' },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message);
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function StripePaymentForm({ amount, customerEmail, customerName, productName, metadata, onSuccess, onError, promoCode }) {
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
  }, [amount]);

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
      <PaymentForm total={amount} onSuccess={onSuccess} onError={onError} promoCode={promoCode} />
    </Elements>
  );
}