import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cartStore';

const DETAILS_KEY = 'gannon_checkout_details_v1';
const DETAILS_MAX_AGE_MS = 2 * 60 * 60 * 1000;
const EMPTY_DETAILS = {
  full_name: '', email: '', mobile: '',
  street_address: '', suburb: '', state: '', postcode: '', country: 'Australia',
  order_support_consent: true,
};

function readStoredDetails() {
  try {
    const saved = sessionStorage.getItem(DETAILS_KEY);
    if (!saved) return EMPTY_DETAILS;
    const parsed = JSON.parse(saved);
    const savedAt = Number(parsed?._saved_at || 0);
    if (!savedAt || Date.now() - savedAt > DETAILS_MAX_AGE_MS) {
      sessionStorage.removeItem(DETAILS_KEY);
      return EMPTY_DETAILS;
    }
    const { _saved_at, ...details } = parsed;
    return { ...EMPTY_DETAILS, ...details };
  } catch {
    return EMPTY_DETAILS;
  }
}

const COUNTRIES = ['Australia'];

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

function Field({ label, htmlFor, required, error, children }) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 font-body text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function StoreCartDetails() {
  const navigate = useNavigate();
  const items = useCartStore(state => Array.isArray(state.items) ? state.items : []);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const [form, setForm] = useState(readStoredDetails);

  const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [touched, setTouched] = useState(/** @type {Record<string, boolean>} */ ({}));

  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  useEffect(() => {
    if (!hasHydrated) return;
    if (items.length === 0) navigate('/store');
  }, [hasHydrated, items.length, navigate]);

  // Retain checkout details only for this browser tab and expire them after two hours.
  useEffect(() => {
    try {
      sessionStorage.setItem(DETAILS_KEY, JSON.stringify({ ...form, _saved_at: Date.now() }));
    } catch {}
  }, [form]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validate = () => {
    const e = /** @type {Record<string, string>} */ ({});
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.mobile.trim() || !/^[\d\s+()-]{7,16}$/.test(form.mobile.replace(/\s/g, ''))) e.mobile = 'Valid mobile number is required';
    if (!form.street_address.trim()) e.street_address = 'Street address is required';
    if (form.street_address.toLowerCase().includes('po box')) e.street_address = 'PO Box not accepted — please use a street address';
    if (!form.suburb.trim()) e.suburb = 'Suburb / city is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.postcode.trim()) e.postcode = 'Postcode is required';
    if (form.country !== 'Australia') e.country = 'Stage one delivery is available within Australia only.';
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    setTouched({ full_name: true, email: true, mobile: true, street_address: true, suburb: true, state: true, postcode: true, country: true });
    if (Object.keys(e).length > 0) return;
    navigate('/store/checkout');
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-6" data-testid="cart-details-page">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate('/store')} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-xs font-bold">1</div>
            <span className="font-body text-xs text-primary">Your Details</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">2</div>
            <span className="font-body text-xs text-muted-foreground">Review Order</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">3</div>
            <span className="font-body text-xs text-muted-foreground">Payment</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span className="font-body text-xs text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</span>
        </div>

        <h1 className="font-display text-3xl text-foreground mb-8">Your Details</h1>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* Contact */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-4">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Contact Information</p>

            <Field label="Full Name" htmlFor="checkout-full-name" required error={touched.full_name && errors.full_name}>
              <Input
                id="checkout-full-name"
                name="full_name"
                autoComplete="name"
                data-testid="input-full-name"
                placeholder="Jane Smith"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Email Address" htmlFor="checkout-email" required error={touched.email && errors.email}>
              <Input
                id="checkout-email"
                name="email"
                autoComplete="email"
                data-testid="input-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Mobile Number" htmlFor="checkout-mobile" required error={touched.mobile && errors.mobile}>
              <Input
                id="checkout-mobile"
                name="mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                data-testid="input-mobile"
                placeholder="+61 400 000 000"
                value={form.mobile}
                onChange={e => set('mobile', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>
          </div>

          {/* Delivery */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-4">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Delivery Address</p>
            <p className="font-body text-xs text-muted-foreground">Current checkout is for Australian delivery only.</p>

            <Field label="Street Address" htmlFor="checkout-street-address" required error={touched.street_address && errors.street_address}>
              <Input
                id="checkout-street-address"
                name="street_address"
                autoComplete="street-address"
                data-testid="input-street-address"
                placeholder="123 Example Street"
                value={form.street_address}
                onChange={e => set('street_address', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Suburb / City" htmlFor="checkout-suburb" required error={touched.suburb && errors.suburb}>
                <Input
                  id="checkout-suburb"
                  name="suburb"
                  autoComplete="address-level2"
                  data-testid="input-suburb"
                  placeholder="Melbourne"
                  value={form.suburb}
                  onChange={e => set('suburb', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              </Field>
              <Field label="Postcode" htmlFor="checkout-postcode" required error={touched.postcode && errors.postcode}>
                <Input
                  id="checkout-postcode"
                  name="postcode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  data-testid="input-postcode"
                  placeholder="3000"
                  value={form.postcode}
                  onChange={e => set('postcode', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              </Field>
            </div>

            <Field label="State" htmlFor="checkout-state" required error={touched.state && errors.state}>
              <select
                id="checkout-state"
                name="state"
                autoComplete="address-level1"
                data-testid="input-state"
                value={form.state}
                onChange={e => set('state', e.target.value)}
                className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                <option value="">Select state</option>
                {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Country" htmlFor="checkout-country" required error={touched.country && errors.country}>
              <select
                id="checkout-country"
                name="country"
                autoComplete="country-name"
                data-testid="input-country"
                value={form.country}
                onChange={e => { set('country', e.target.value); set('state', ''); }}
                className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Consent */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                name="order_support_consent"
                type="checkbox"
                checked={form.order_support_consent}
                onChange={e => set('order_support_consent', e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <p className="font-body text-xs text-foreground/80 leading-relaxed">
                <strong>By purchasing, I agree to receive order updates and customer support communication relating to my purchase.</strong> Your details will be used only to process and fulfil your order, and to provide delivery and purchase support. This checkout does not subscribe you to marketing.
              </p>
            </label>

          </div>

          <Button
            data-testid="continue-to-review-button"
            onClick={handleContinue}
            className="w-full rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase py-6 gap-2"
          >
            Continue to Order Review
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-center font-body text-xs text-muted-foreground">
            🔒 Your information is secured and never sold.
          </p>
        </motion.div>
      </div>
    </div>
  );
}