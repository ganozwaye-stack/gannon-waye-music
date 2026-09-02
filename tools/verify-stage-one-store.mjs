import fs from 'node:fs';
import path from 'node:path';
import { calculateShippingQuote } from '../base44/shared/shippingQuote.js';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function requireText(content, needle, message) {
  if (!content.includes(needle)) throw new Error(message);
}

const store = read('src/pages/Store.jsx');
const details = read('src/pages/StoreCartDetails.jsx');
const checkout = read('src/pages/StoreCheckout.jsx');
const backend = read('base44/functions/createCheckoutSession/entry.ts');
const receipt = read('base44/functions/sendOrderReceipt/entry.ts');
const localClient = read('src/api/base44Client.js');

requireText(store, "MerchProduct.filter({ is_active: true, publication_status: 'live', is_stage_one_sale: true }", 'The public store no longer fails closed to the two owner-approved stage one products.');
requireText(details, "const COUNTRIES = ['Australia'];", 'Stage one customer details are no longer restricted to Australian delivery.');
requireText(checkout, "shipping_country: 'Australia'", 'The checkout no longer sends the stage one Australian delivery gate.');
requireText(checkout, "displayed_shipping_amount", 'The checkout no longer sends the displayed delivery amount for server comparison.');
requireText(backend, "inventory_source !== 'owned_stock'", 'The checkout no longer enforces verified owned stock for stage one.');
requireText(backend, "calculateShippingQuote", 'Stripe checkout is not using the shared live shipping calculation.');
requireText(backend, "shipping_address_collection: { allowed_countries: ['AU'] }", 'Stripe is no longer restricted to Australian stage one delivery.');
requireText(backend, "automatic_tax: { enabled: false }", 'Automatic tax was enabled even though GST is not charged.');
requireText(backend, "gst_amount_aud: '0.00'", 'The Stripe metadata no longer records that GST is not charged.');
requireText(receipt, '<span>GST</span><span>Not charged</span>', 'The customer receipt no longer states that GST is not charged.');
requireText(localClient, "is_stage_one_sale: true", 'Local development data does not mirror the owner-approved stage one product gate.');

const shippingRules = [
  {
    id: 'merch-au',
    name: 'Merch Standard',
    region: 'australia',
    product_type: 'merch',
    min_quantity: 1,
    max_quantity: null,
    base_rate: 12.5,
    additional_item_rate: 2.5,
    free_shipping_threshold: 100,
    is_active: true,
    status: 'live',
  },
  {
    id: 'bundle-au',
    name: 'Bundle Standard',
    region: 'australia',
    product_type: 'bundle',
    min_quantity: 1,
    max_quantity: null,
    base_rate: 17.5,
    additional_item_rate: 3.5,
    free_shipping_threshold: 120,
    is_active: true,
    status: 'live',
  },
];

const fakeBase44 = {
  asServiceRole: {
    entities: {
      ShippingRateRule: {
        filter: async query => shippingRules.filter(rule => Object.entries(query).every(([key, value]) => rule[key] === value)),
      },
    },
  },
};

const hoodie = await calculateShippingQuote({
  base44: fakeBase44,
  destination: 'australia',
  items: [{ category: 'apparel', quantity: 1 }],
  cartSubtotalCents: 9800,
});
if (!hoodie.ok || hoodie.shippingCostCents !== 1250) throw new Error(`Hoodie delivery test failed: ${JSON.stringify(hoodie)}`);

const bundle = await calculateShippingQuote({
  base44: fakeBase44,
  destination: 'australia',
  items: [{ category: 'bundle', quantity: 1 }],
  cartSubtotalCents: 5900,
});
if (!bundle.ok || bundle.shippingCostCents !== 1750) throw new Error(`Bundle delivery test failed: ${JSON.stringify(bundle)}`);

const combined = await calculateShippingQuote({
  base44: fakeBase44,
  destination: 'australia',
  items: [{ category: 'apparel', quantity: 1 }, { category: 'bundle', quantity: 1 }],
  cartSubtotalCents: 15700,
});
if (!combined.ok || combined.shippingCostCents !== 0 || !combined.freeShipping) throw new Error(`Combined order threshold test failed: ${JSON.stringify(combined)}`);

const international = await calculateShippingQuote({
  base44: fakeBase44,
  destination: 'international',
  items: [{ category: 'apparel', quantity: 1 }],
  cartSubtotalCents: 9800,
});
if (international.ok || international.method !== 'international_blocked_stage_one') throw new Error(`International stage one gate failed: ${JSON.stringify(international)}`);

console.log('Stage one store and shipping rules verified.');
