// StoreCustomerDetails — step 2 of the checkout flow
// Re-uses the same form logic as StoreCartDetails but with updated testids
// and routes from /store/cart → /store/customer-details → /store/checkout

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cartStore';

const DETAILS_KEY = 'gannon_checkout_details_v1';

const COUNTRIES = [
  'Australia', 'New Zealand', 'United States', 'United Kingdom', 'Canada',
  'Ireland', 'Singapore', 'Other',
];

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

function Field({ label, required, error, children }) {
  return (
    <div>
      <Label className="font-body text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 font-body text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function StoreCustomerDetails() {
  const navigate = useNavigate();
  const items = useCartStore(state => Array.isArray(state.items) ? state.items : []);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DETAILS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      full_name: '', email: '', mobile: '',
      street_address: '', suburb: '', state: '', postcode: '', country: 'Australia',
      dob: '', business_name: '', abn: '',
      order_only: true, subscribe_community: false,
    };
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const hydrated = useRef(false);
  useEffect(() => { hydrated.current = true; }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    const timer = setTimeout(() => {
      if (items.length === 0) navigate('/store');
    }, 150);
    return () => clearTimeout(timer);
  }, [items.length, navigate]);

  useEffect(() => {
    try { localStorage.setItem(DETAILS_KEY, JSON.stringify(form)); } catch {}
  }, [form]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.mobile.trim() || !/^[\d\s\+\-\(\)]{7,16}$/.test(form.mobile.replace(/\s/g, ''))) e.mobile = 'Valid mobile number is required';
    if (!form.street_address.trim()) e.street_address = 'Street address is required';
    if (form.street_address.toLowerCase().includes('po box')) e.street_address = 'PO Box not accepted — please use a street address';
    if (!form.suburb.trim()) e.suburb = 'Suburb / city is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.postcode.trim()) e.postcode = 'Postcode is required';
    if (!form.country.trim()) e.country = 'Country is required';
    if (form.abn && !/^\d{9,11}$/.test(form.abn.replace(/\s/g, ''))) e.abn = 'ABN must be 11 digits';
    return e;
  };

  const handleContinue = () => {
    const e = validate();
    setErrors(e);
    setTouched({ full_name: true, email: true, mobile: true, street_address: true, suburb: true, state: true, postcode: true, country: true, abn: !!form.abn });
    if (Object.keys(e).length > 0) return;
    navigate('/store/checkout');
  };

  const isAustralia = form.country === 'Australia';

  return (
    <div className="min-h-screen py-24 px-4 md:px-6" data-testid="customer-details-page">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate('/store/cart')} className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Cart
        </button>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 opacity-60">
            <div className="w-7 h-7 rounded-full border border-border/50 flex items-center justify-center font-body text-xs">1</div>
            <span className="font-body text-xs text-muted-foreground">Cart</span>
          </div>
          <div className="flex-1 h-px bg-border/40 mx-2" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-xs font-bold">2</div>
            <span className="font-body text-xs text-primary">Your Details</span>
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

            <Field label="Full Name" required error={touched.full_name && errors.full_name}>
              <Input
                data-testid="customer-full-name"
                placeholder="Jane Smith"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Email Address" required error={touched.email && errors.email}>
              <Input
                data-testid="customer-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Mobile Number" required error={touched.mobile && errors.mobile}>
              <Input
                data-testid="customer-mobile"
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

            <Field label="Street Address" required error={touched.street_address && errors.street_address}>
              <Input
                data-testid="customer-street-address"
                placeholder="123 Example Street"
                value={form.street_address}
                onChange={e => set('street_address', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Suburb / City" required error={touched.suburb && errors.suburb}>
                <Input
                  data-testid="customer-suburb"
                  placeholder="Melbourne"
                  value={form.suburb}
                  onChange={e => set('suburb', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              </Field>
              <Field label="Postcode" required error={touched.postcode && errors.postcode}>
                <Input
                  data-testid="customer-postcode"
                  placeholder="3000"
                  value={form.postcode}
                  onChange={e => set('postcode', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              </Field>
            </div>

            <Field label="State / Region" required error={touched.state && errors.state}>
              {isAustralia ? (
                <select
                  data-testid="customer-state"
                  value={form.state}
                  onChange={e => set('state', e.target.value)}
                  className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
                >
                  <option value="">Select state</option>
                  {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <Input
                  data-testid="customer-state"
                  placeholder="State / Region / Province"
                  value={form.state}
                  onChange={e => set('state', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              )}
            </Field>

            <Field label="Country" required error={touched.country && errors.country}>
              <select
                data-testid="customer-country"
                value={form.country}
                onChange={e => { set('country', e.target.value); set('state', ''); }}
                className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Optional */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-4">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">Optional Information</p>

            <Field label="Date of Birth" error={null}>
              <Input
                data-testid="customer-dob"
                type="date"
                value={form.dob}
                onChange={e => set('dob', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Business Name" error={null}>
              <Input
                data-testid="customer-business-name"
                placeholder="My Business Pty Ltd"
                value={form.business_name}
                onChange={e => set('business_name', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="ABN" error={touched.abn && errors.abn}>
              <Input
                data-testid="customer-abn"
                placeholder="12 345 678 901"
                value={form.abn}
                onChange={e => set('abn', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>
          </div>

          {/* Consent */}
          <div className="bg-card/40 border border-border/30 rounded-2xl p-5 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer" data-testid="order-only-option">
              <input
                type="checkbox"
                checked={form.order_only}
                onChange={e => set('order_only', e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <p className="font-body text-xs text-foreground/80 leading-relaxed">
                <strong>By purchasing, I agree to receive order updates and customer support communication relating to my purchase.</strong> Your details will be used to process and fulfil your order.
              </p>
            </label>

            <label className="flex items-start gap-3 cursor-pointer" data-testid="subscribe-community-option">
              <input
                type="checkbox"
                checked={form.subscribe_community}
                onChange={e => set('subscribe_community', e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <p className="font-body text-xs text-foreground/60 leading-relaxed">
                Yes, I would also like to receive music, merch and supporter updates from Gannon Waye. (Optional)
              </p>
            </label>
          </div>

          <Button
            data-testid="continue-to-order-review"
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