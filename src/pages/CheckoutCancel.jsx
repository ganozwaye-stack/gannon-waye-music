import { Link } from 'react-router-dom';
import { XCircle, ShoppingBag, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <XCircle className="w-16 h-16 text-muted-foreground mx-auto" />
        <h1 className="font-display text-3xl text-foreground">Checkout Cancelled</h1>

        <div className="bg-card/40 border border-border/30 rounded-xl p-5 text-left space-y-3">
          <p className="font-body text-sm text-foreground/80 leading-relaxed">
            No payment was processed. Your cart items are still saved.
          </p>
          <p className="font-body text-sm text-foreground/60 leading-relaxed">
            You can return to the store at any time to complete your order.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/store">
            <Button className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase gap-2">
              <ShoppingBag className="w-4 h-4" /> Return to Store
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full rounded-full font-body text-sm gap-2">
              <Home className="w-4 h-4" /> Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}