import React, { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
        <h1 className="font-display text-3xl text-foreground">Payment Confirmed! 🤍</h1>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-left space-y-3">
          <p className="font-body text-sm text-foreground/80 leading-relaxed">
            ✅ Your payment has been received and your order has been confirmed.
          </p>
          <p className="font-body text-sm text-foreground/70 leading-relaxed">
            You'll receive a receipt confirmation from Stripe to your email shortly.
            Your order will be prepared for shipping.
          </p>
          {sessionId && (
            <p className="font-body text-xs text-muted-foreground mt-2">
              Reference: <span className="font-mono text-xs">{sessionId}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/orders">
            <Button className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2">
              <ShoppingBag className="w-4 h-4" /> View My Orders
            </Button>
          </Link>
          <Link to="/store">
            <Button variant="outline" className="w-full rounded-full font-body text-sm gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}