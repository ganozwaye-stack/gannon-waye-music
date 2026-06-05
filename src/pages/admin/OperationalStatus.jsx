import React from 'react';
import { AlertTriangle, CheckCircle2, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PLATFORM_CONSTRAINTS } from '@/lib/platformConstraints';

export default function OperationalStatus() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl text-foreground">Operational Status</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Infrastructure constraints & safety limits</p>
      </div>

      <div className="bg-amber-900/20 border border-amber-600/30 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <p className="font-display text-sm text-amber-100 font-semibold">Pre-Commercial Status</p>
            <p className="font-body text-xs text-amber-200/70 mt-1">
              Platform is hardened for launch with 1-2 concurrent users. Not production-ready for commercial scale (10+ concurrent orders/min). Plan infrastructure rebuild for Month 2.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Max Concurrent Orders', value: PLATFORM_CONSTRAINTS.MAX_CONCURRENT_ORDERS_PER_USER, status: 'warning' },
          { label: 'Order Lock (mins)', value: PLATFORM_CONSTRAINTS.ORDER_LOCK_DURATION_MINUTES, status: 'ok' },
          { label: 'Max Products', value: PLATFORM_CONSTRAINTS.MAX_PRODUCTS, status: 'ok' },
          { label: 'Email Idempotence', value: 'Enabled', status: 'ok' },
        ].map((stat) => (
          <Card key={stat.label} className={stat.status === 'warning' ? 'border-amber-600/30 bg-amber-900/10' : ''}>
            <CardContent className="p-4">
              <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-center gap-2">
                <p className="font-display text-2xl text-foreground">{stat.value}</p>
                {stat.status === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display text-lg text-foreground mb-4">Infrastructure Hardening Applied</h3>
          <ul className="space-y-2">
            {[
              '✅ Per-customer order locking (prevents concurrent orders)',
              '✅ Idempotence keys on all side effects (safe retries)',
              '✅ OAuth token pre-refresh (prevents expiry)',
              '✅ GDPR consent check (email opt-in)',
              '✅ Optimistic locking on inventory (race condition detection)',
              '✅ Booking state machine (enforced workflows)',
              '⚠️ Single event queue (not persistent — plan upgrade)',
              '⚠️ No distributed transactions (plan for Month 2)',
              '⚠️ No circuit breaker (external API failures stop orders)',
            ].map((item, i) => (
              <li key={i} className="font-body text-sm text-foreground/70">{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/10 border border-blue-600/30">
        <CardContent className="p-6">
          <Shield className="w-5 h-5 text-blue-500 mb-2" />
          <h3 className="font-display text-sm text-blue-200 font-semibold mb-2">Safe to Launch</h3>
          <p className="font-body text-xs text-blue-200/70">
            This platform is safe to launch with documented constraints. Monitor for race conditions in the first week. Infrastructure rebuild planned for Month 2 to support commercial scale.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}