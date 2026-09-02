import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cartStore';

const DETAILS_KEY = 'gannon_checkout_details_v1';

const COUNTRIES = ['Australia'];

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

export default function StoreCartDetails() {
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
      order_support_consent: true, marketing_opt_in: false,
    };
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);
  useEffect(() => {
    if (!hasHydrated) return;
    if (items.length === 0) navigate('/store');
  }, [hasHydrated, items.length, navigate]);

  // Persist form to localStorage as user types
  useEffect(() => {
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify(form));
    } catch {}
  }, [form]);

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validate = () => {
    const e = {};
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

            <Field label="Full Name" required error={touched.full_name && errors.full_name}>
              <Input
                data-testid="input-full-name"
                placeholder="Jane Smith"
                value={form.full_name}
                onChange={e => set('full_name', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Email Address" required error={touched.email && errors.email}>
              <Input
                data-testid="input-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <Field label="Mobile Number" required error={touched.mobile && errors.mobile}>
              <Input
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

            <Field label="Street Address" required error={touched.street_address && errors.street_address}>
              <Input
                data-testid="input-street-address"
                placeholder="123 Example Street"
                value={form.street_address}
                onChange={e => set('street_address', e.target.value)}
                className="bg-secondary/50 border-border/40 focus:border-primary/40"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Suburb / City" required error={touched.suburb && errors.suburb}>
                <Input
                  data-testid="input-suburb"
                  placeholder="Melbourne"
                  value={form.suburb}
                  onChange={e => set('suburb', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              </Field>
              <Field label="Postcode" required error={touched.postcode && errors.postcode}>
                <Input
                  data-testid="input-postcode"
                  placeholder="3000"
                  value={form.postcode}
                  onChange={e => set('postcode', e.target.value)}
                  className="bg-secondary/50 border-border/40 focus:border-primary/40"
                />
              </Field>
            </div>

            <Field label="State" required error={touched.state && errors.state}>
              <select
                data-testid="input-state"
                value={form.state}
                onChange={e => set('state', e.target.value)}
                className="w-full bg-secondary/50 border border-border/40 rounded-md px-3 py-2 font-body text-sm text-foreground focus:outline-none focus:border-primary/40"
              >
                <option value="">Select state</option>
                {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Country" required error={touched.country && errors.country}>
              <select
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
                type="checkbox"
                checked={form.order_support_consent}
                onChange={e => set('order_support_consent', e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <p className="font-body text-xs text-foreground/80 leading-relaxed">
                <strong>By purchasing, I agree to receive order updates and customer support communication relating to my purchase.</strong> Your details will be used to process and fulfil your order, and to provide delivery and purchase support. You can unsubscribe from marketing at any time.
              </p>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                data-testid="checkbox-marketing-opt-in"
                type="checkbox"
                checked={form.marketing_opt_in}
                onChange={e => set('marketing_opt_in', e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <p className="font-body text-xs text-foreground/60 leading-relaxed">
                Yes, I would also like to receive music, merch and supporter updates from Gannon Waye. (Optional)
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