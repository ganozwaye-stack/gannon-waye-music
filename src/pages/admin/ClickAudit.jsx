import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, XCircle, Search, ExternalLink } from 'lucide-react';

const ROUTE_AUDIT = [
  // Public
  { page: 'Home', route: '/', elements: ['Hero CTA → /store', 'Navigation links', 'StoreWorldTeaser → /store-world'], status: 'working' },
  { page: 'Store', route: '/store', elements: ['Product cards → Add to Cart', 'Winter Bundle Hero → /store/cart-details', 'Sticky checkout → /store/cart-details', 'Support CTA → /back-this'], status: 'working' },
  { page: 'Store World', route: '/store-world', elements: ['Product hotspots → modal/navigate', 'Product card grid → modal/navigate', 'Shop All Merch → /store', 'View Cart → /store/cart-details'], status: 'working' },
  { page: 'Cart Details', route: '/store/cart-details', elements: ['Checkout button → /store/checkout or Stripe', 'Back to store → /store', 'Remove items'], status: 'working' },
  { page: 'Checkout', route: '/store/checkout', elements: ['Stripe payment form', 'Success → /checkout-success', 'Cancel → /checkout-cancel'], status: 'working' },
  { page: 'Checkout Success', route: '/checkout-success', elements: ['View orders → /orders', 'Back to store → /store'], status: 'working' },
  { page: 'Mums Garden', route: '/mums-garden', elements: ['Visit full tribute → /mum', 'Return to boutique → /store-world'], status: 'working' },
  { page: 'Mum Tribute', route: '/mum', elements: ['Full memorial content', 'Navigation back'], status: 'working' },
  { page: 'Current Single', route: '/current-single', elements: ['Spotify link', 'Apple Music link', 'Store CTA'], status: 'working' },
  { page: 'Back This', route: '/back-this', elements: ['Support tiers', 'Payment flow'], status: 'working' },
  { page: 'Community', route: '/community', elements: ['Post form', 'Fan posts list', 'Report', 'Crisis support links'], status: 'working' },
  { page: 'Lyrics', route: '/lyrics', elements: ['Release accordions', 'Lyrics modal/scroller'], status: 'working' },
  { page: 'Contact', route: '/contact', elements: ['Contact form submit', 'Social links'], status: 'working' },
  { page: 'FAQ', route: '/faq', elements: ['Accordion items', 'Store CTA'], status: 'working' },
  { page: 'Privacy Policy', route: '/privacy-policy', elements: ['Internal links'], status: 'working' },
  { page: 'Terms of Service', route: '/terms-of-service', elements: ['Internal links'], status: 'working' },
  // Admin
  { page: 'Admin Dashboard', route: '/admin', elements: ['Mission Control → /admin/mission-control', 'Financials → /admin/financials', 'Orders → /admin/orders', 'Approval Queue → /admin/approval-queue', 'Releases → /admin/releases'], status: 'working' },
  { page: 'Priority Commander', route: '/admin/priority-commander', elements: ['Approval Queue link', 'Task complete/defer/escalate', 'Refresh', 'Filter controls'], status: 'working' },
  { page: 'Click Audit', route: '/admin/click-audit', elements: ['Route table', 'Search filter', 'Status filters', 'External links'], status: 'working' },
  { page: 'Orders', route: '/admin/orders', elements: ['Order rows → detail dialog', 'Status update', 'Track shipment', 'Receipt email'], status: 'working' },
  { page: 'Merch Management', route: '/admin/merch', elements: ['Product cards', 'Edit dialog', 'Create product', 'Delete product'], status: 'working' },
  { page: 'Approval Queue', route: '/admin/approval-queue', elements: ['Approve/reject buttons', 'Filter by status'], status: 'working' },
  { page: 'Promo Codes', route: '/admin/promo-codes', elements: ['Create code', 'Edit code', 'Toggle active'], status: 'working' },
  { page: 'Subscribers', route: '/admin/subscribers', elements: ['Subscriber list', 'Export', 'Send email'], status: 'working' },
  { page: 'Site Settings', route: '/admin/settings', elements: ['Save settings', 'Upload images'], status: 'working' },
  { page: 'Mission Control', route: '/admin/mission-control', elements: ['Panel links', 'Quick actions'], status: 'working' },
  { page: 'Payment Diagnostics', route: '/admin/payment-diagnostics', elements: ['Stripe test', 'Webhook rotate'], status: 'working' },
  { page: 'Stripe Command Centre', route: '/admin/stripe-command-centre', elements: ['Revenue metrics', 'Order list'], status: 'working' },
  { page: 'Webhook Health', route: '/admin/webhook-health', elements: ['Status indicators', 'Test webhook'], status: 'working' },
  { page: 'Merch Visual Lab', route: '/admin/merch-visual-lab', elements: ['Asset upload', 'Composition builder', 'Export'], status: 'working' },
  { page: 'Social Schedule Queue', route: '/admin/social-schedule-queue', elements: ['Post cards', 'Approve/reject', 'Metricool sync'], status: 'working' },
  { page: 'Content Command', route: '/admin/content-command', elements: ['Generate content', 'Approve drafts'], status: 'working' },
];

const STATUS_CONFIG = {
  working: { icon: CheckCircle2, color: '#22c55e', label: 'Working' },
  broken: { icon: XCircle, color: '#ef4444', label: 'Broken' },
  partial: { icon: AlertTriangle, color: '#f59e0b', label: 'Partial' },
  'display-only': { icon: AlertTriangle, color: '#6b7280', label: 'Display Only' },
};

export default function ClickAudit() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = ROUTE_AUDIT.filter(r => {
    const matchSearch = !search || r.page.toLowerCase().includes(search.toLowerCase()) || r.route.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    working: ROUTE_AUDIT.filter(r => r.status === 'working').length,
    broken: ROUTE_AUDIT.filter(r => r.status === 'broken').length,
    partial: ROUTE_AUDIT.filter(r => r.status === 'partial').length,
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px 64px' }}>
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: '#C9A84C', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '6px' }}>System QA</p>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Click Audit</h1>
        <p style={{ color: '#888', fontSize: '13px' }}>{ROUTE_AUDIT.length} routes mapped · {counts.working} working · {counts.broken} broken</p>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Working', count: counts.working, color: '#22c55e' },
          { label: 'Broken', count: counts.broken, color: '#ef4444' },
          { label: 'Partial', count: counts.partial, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}33`, textAlign: 'center' }}>
            <p style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.count}</p>
            <p style={{ fontSize: '11px', color: '#888' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#555' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pages or routes..."
            style={{ width: '100%', paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '6px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'working', 'broken', 'partial'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '7px 14px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', textTransform: 'capitalize',
              background: statusFilter === s ? '#C9A84C' : '#1a1a1a',
              color: statusFilter === s ? '#111' : '#888',
              border: `1px solid ${statusFilter === s ? '#C9A84C' : '#333'}`,
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              {['Page', 'Route', 'Interactive Elements', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#666', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              const sc = STATUS_CONFIG[row.status] || STATUS_CONFIG.working;
              const Ic = sc.icon;
              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>{row.page}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Link to={row.route} style={{ color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                      <code style={{ background: 'rgba(201,168,76,0.08)', padding: '2px 6px', borderRadius: '4px' }}>{row.route}</code>
                      <ExternalLink style={{ width: '10px', height: '10px', opacity: 0.5 }} />
                    </Link>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#888', fontSize: '12px' }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {row.elements.map((el, j) => <li key={j} style={{ marginBottom: '2px' }}>· {el}</li>)}
                    </ul>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: sc.color, fontSize: '11px', fontWeight: 600 }}>
                      <Ic style={{ width: '13px', height: '13px' }} /> {sc.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}