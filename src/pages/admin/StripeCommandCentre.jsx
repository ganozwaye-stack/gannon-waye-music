import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function StripeCommandCentre() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold gradient-gold-text">Stripe Command Centre</h1>
      <Card>
        <CardHeader><CardTitle className="text-sm">Stripe Management</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Manage Stripe payments, webhooks, and diagnostics.</p>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/payment-diagnostics"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Payment Diagnostics</Button></Link>
            <Link to="/admin/stripe-live-report"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Live Report</Button></Link>
            <Link to="/admin/webhook-health"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Webhook Health</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}