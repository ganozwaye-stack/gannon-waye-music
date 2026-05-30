import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const FIELD_GROUPS = [
  {
    title: 'Business Identity',
    fields: [
      { key: 'business_name', label: 'Business Name', placeholder: 'Gannon Waye Music' },
      { key: 'artist_name', label: 'Artist Name', placeholder: 'Gannon Waye' },
      { key: 'abn_optional', label: 'ABN (optional)', placeholder: 'XX XXX XXX XXX' },
      { key: 'business_address_optional', label: 'Business Address (optional)', placeholder: 'Optional — do not include personal home address' },
    ],
  },
  {
    title: 'Public Contact Emails',
    warning: 'These emails appear publicly. Do NOT use personal Gmail unless explicitly approved. Confirm preferred email before saving.',
    fields: [
      { key: 'public_support_email', label: 'Customer Support Email', placeholder: 'Confirm with Gannon before setting', type: 'email' },
      { key: 'public_contact_email', label: 'General Contact Email', placeholder: 'Confirm with Gannon before setting', type: 'email' },
      { key: 'orders_email', label: 'Orders Email', placeholder: 'Confirm with Gannon before setting', type: 'email' },
      { key: 'press_email', label: 'Press Email', placeholder: 'Optional', type: 'email' },
    ],
  },
  {
    title: 'Website & Store URLs',
    fields: [
      { key: 'website_url', label: 'Website URL', placeholder: 'https://gannonwaye.com' },
      { key: 'store_url', label: 'Store URL', placeholder: 'https://gannonwaye.com/store' },
      { key: 'spotify_artist_url', label: 'Spotify Artist URL', placeholder: 'https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz' },
    ],
  },
  {
    title: 'Social Links',
    fields: [
      { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
      { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@...' },
      { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
      { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
    ],
  },
  {
    title: 'Stripe & Payments',
    fields: [
      { key: 'stripe_public_business_name', label: 'Stripe Public Business Name', placeholder: 'Gannon Waye Music' },
      { key: 'stripe_support_email_instruction', label: 'Stripe Support Email Note (internal)', placeholder: 'e.g. Set in Stripe Dashboard > Settings > Business details' },
    ],
  },
  {
    title: 'Legal & Campaign Copy',
    fields: [
      { key: 'donation_statement', label: 'Donation Statement', placeholder: '10% of proceeds donated to 1800RESPECT.' },
      { key: 'legal_footer_statement', label: 'Legal Footer Statement', placeholder: 'Independent artist store operated by Gannon Waye Music.' },
    ],
  },
];

const STRIPE_STEPS = [
  'Go to Stripe Dashboard (dashboard.stripe.com)',
  'Select "Gannon Waye Music" account — NOT "Too Lost"',
  'Make sure you are in LIVE mode (not Sandbox/Test)',
  'Go to Settings → Business details',
  'Update "Customer support email" / "Support email"',
  'Check Settings → Branding — confirm business name',
  'Check Settings → Customer emails → Receipts',
  'Save all changes',
  'Send a test receipt from a test transaction to confirm',
  '⚠ Do NOT share live Secret Key anywhere except Base44 Secrets vault',
];

function validateEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function validateUrl(v) { return !v || v.startsWith('http'); }

export default function BusinessProfileSettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const { data: records = [] } = useQuery({
    queryKey: ['BusinessProfileSettings'],
    queryFn: () => base44.entities.BusinessProfileSettings.list('-updated_date', 1),
  });

  useEffect(() => {
    if (records[0]) setForm(records[0]);
  }, [records]);

  const existing = records[0];

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existing) return base44.entities.BusinessProfileSettings.update(existing.id, data);
      return base44.entities.BusinessProfileSettings.create(data);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['BusinessProfileSettings'] }); setSaved(true); setTimeout(() => setSaved(false), 3000); },
  });

  const validate = () => {
    const e = {};
    ['public_support_email', 'public_contact_email', 'orders_email', 'press_email'].forEach(k => {
      if (!validateEmail(form[k])) e[k] = 'Invalid email format';
    });
    ['website_url', 'store_url', 'spotify_artist_url', 'instagram_url', 'tiktok_url', 'youtube_url', 'facebook_url'].forEach(k => {
      if (!validateUrl(form[k])) e[k] = 'URL must start with http';
    });
    if (form.donation_statement?.toLowerCase().includes('official partner')) {
      e.donation_statement = 'Do not imply official partnership — use exact approved wording';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await saveMutation.mutateAsync({ ...form, updated_by: 'admin' });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Business Profile Settings</h1>
        <p className="text-sm text-muted-foreground">Source of truth for all public business details. Changes to public emails and legal copy require Gannon approval before publishing.</p>
      </div>

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <div className="flex gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300">Do not use ganozwaye@gmail.com publicly</p>
            <p className="text-xs text-muted-foreground mt-1">This personal Gmail address must NOT appear as a public customer support or contact email without Gannon's explicit approval. Leave email fields blank until confirmed.</p>
          </div>
        </div>
      </div>

      {FIELD_GROUPS.map(group => (
        <div key={group.title} className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-2">{group.title}</h2>
          {group.warning && (
            <div className="flex gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200/80">{group.warning}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.fields.map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                <Input
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  value={form[f.key] || ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className={errors[f.key] ? 'border-red-500' : ''}
                />
                {errors[f.key] && <p className="text-xs text-red-400 mt-1">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Saving...' : 'Save Business Profile'}
        </Button>
        {saved && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Saved
          </div>
        )}
      </div>

      {/* Stripe Receipt Checklist */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Fix Stripe Receipt Support Email</h2>
            <p className="text-xs text-muted-foreground mt-1">The email shown on Stripe receipts is set in the Stripe Dashboard — not in this app. Follow these steps to update it.</p>
          </div>
          <a href="https://dashboard.stripe.com/settings/business-details" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline">
            Open Stripe <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <ol className="space-y-2">
          {STRIPE_STEPS.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground/80">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <p className="text-xs text-red-300">
            <strong>Security:</strong> Never paste live Stripe Secret Key into ChatGPT, frontend code, or any AI tool.
            Only the publishable key (pk_live_...) may appear client-side. Secret keys and webhook secrets must remain in Base44 Secrets vault only.
          </p>
        </div>
      </div>
    </div>
  );
}