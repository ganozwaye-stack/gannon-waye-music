import { Link } from 'react-router-dom';

// This is an explicit application hold, not an HTTP/server failure.
// Do not invent a stack trace, request ID, notification or order-safety claim.
export default function StoreCrashed() {
  return (
    <section className="min-h-[60svh] px-6 py-16 max-w-3xl mx-auto text-left" role="status" data-testid="store-checkout-hold">
      <h1 className="font-display text-3xl gradient-gold-text">Checkout is temporarily unavailable</h1>
      <p className="font-body mt-4 text-foreground/80">You can browse the collection while checkout checks are completed. No payment has been requested on this page.</p>
      <Link to="/store" className="inline-block mt-6 underline text-primary">Browse the collection</Link>
    </section>
  );
}
