import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Webhook } from 'lucide-react';

export default function WebhookHealth() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold gradient-gold-text">Webhook Health</h1>
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Webhook className="w-4 h-4 text-primary" />Webhook Status</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Monitor and manage webhook endpoints across all integrations.</p>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/payment-diagnostics"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Payment Diagnostics</Button></Link>
            <Link to="/admin/stripe-command-centre"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="w-3 h-3" />Stripe Command Centre</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}