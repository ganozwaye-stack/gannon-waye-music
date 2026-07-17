import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle, Circle, Loader2, Truck, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CARRIERS = ['Australia Post', 'StarTrack', 'Sendle', 'DHL', 'FedEx', 'Other'];

const CHECKLIST_LABELS = {
  step1_fetch_order: 'Fetch & validate order',
  step2_guard_status: 'Guard: not already shipped/cancelled',
  step3_update_order: 'Update order status to "shipped"',
  step4_send_email: 'Send customer shipping notification email',
  step5_sheet_synced: 'Sync to Google Sheet (All Orders tab)',
  step6_audit_log: 'Create AuditLog record',
  step7_admin_notification: 'Create AdminNotification',
};

export default function OrderFulfilmentPanel({ order, onFulfilled }) {
  const [tracking, setTracking] = useState(order?.tracking_number || '');
  const [carrier, setCarrier] = useState('Australia Post');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const alreadyFulfilled = ['shipped', 'delivered', 'cancelled', 'duplicate'].includes(order?.status);

  const handleFulfil = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await base44.functions.invoke('fulfilOrderAndNotify', {
        order_id: order.id,
        tracking_number: tracking || undefined,
        carrier: carrier || undefined,
        estimated_delivery: estimatedDelivery || undefined,
      });
      if (res.data.success) {
        setResult(res.data);
        onFulfilled?.();
      } else {
        setError(res.data.error || 'Fulfilment failed.');
      }
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    }
    setLoading(false);
  };

  return (
    <div style={{ border: '2px solid rgba(245,208,110,0.3)', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(245,208,110,0.1), rgba(201,168,76,0.05))', padding: '16px 20px', borderBottom: '1px solid rgba(245,208,110,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Truck className="w-5 h-5" style={{ color: '#f5d06e' }} />
        <div>
          <p style={{ color: '#f5d06e', fontWeight: 700, fontSize: '14px', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>One-Button Fulfilment</p>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>Marks shipped · Emails customer · Syncs Sheet · Logs all steps</p>
        </div>
      </div>

      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)' }}>

        {/* Already fulfilled guard */}
        {alreadyFulfilled && !result && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle className="w-4 h-4" style={{ color: '#ef4444', flexShrink: 0 }} />
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>
              This order is already <strong>"{order.status}"</strong> — it cannot be re-fulfilled.
            </p>
          </div>
        )}

        {/* Success result */}
        {result && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ color: '#22c55e', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>✅ {result.message}</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {Object.entries(result.checklist || {}).map(([key, passed]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {passed
                    ? <CheckCircle className="w-4 h-4" style={{ color: '#22c55e', flexShrink: 0 }} />
                    : <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b', flexShrink: 0 }} />}
                  <span style={{ fontSize: '13px', color: passed ? '#c9e9c9' : '#fbbf24' }}>
                    {CHECKLIST_LABELS[key] || key}
                  </span>
                </div>
              ))}
            </div>
            {result.customer_email_sent && (
              <p style={{ color: '#86efac', fontSize: '12px', marginTop: '10px' }}>📧 Shipping email sent to {order.customer_email}</p>
            )}
            {result.google_sheet_synced && (
              <p style={{ color: '#86efac', fontSize: '12px', marginTop: '4px' }}>📊 Row appended to Google Sheet "All Orders"</p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>❌ {error}</p>
          </div>
        )}

        {/* Pending checklist (before fulfil) */}
        {!result && !alreadyFulfilled && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#888', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>Will perform:</p>
            <div style={{ display: 'grid', gap: '6px' }}>
              {Object.entries(CHECKLIST_LABELS).map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Circle className="w-4 h-4" style={{ color: '#444', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#888' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input fields */}
        {!result && !alreadyFulfilled && (
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Tracking Number (optional)
              </label>
              <Input
                value={tracking}
                onChange={e => setTracking(e.target.value)}
                placeholder="e.g. EH123456789AU"
                className="bg-secondary/30 border-border/40"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Carrier (optional)
              </label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger className="bg-secondary/30 border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', color: '#888', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Estimated Delivery (optional)
              </label>
              <Input
                type="date"
                value={estimatedDelivery}
                onChange={e => setEstimatedDelivery(e.target.value)}
                className="bg-secondary/30 border-border/40"
              />
            </div>
          </div>
        )}

        {/* BIG GOLD BUTTON */}
        {!result && !alreadyFulfilled && (
          <button
            onClick={handleFulfil}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
              background: loading ? 'rgba(245,208,110,0.3)' : 'linear-gradient(135deg, #B8860B, #D4AF37, #FFF8DC, #D4AF37, #B8860B)',
              color: loading ? '#888' : '#111',
              fontSize: '15px', fontWeight: 800, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(212,175,55,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#888' }} />
                Fulfilling…
              </>
            ) : (
              <>✅ Fulfil This Order &amp; Notify Customer</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}