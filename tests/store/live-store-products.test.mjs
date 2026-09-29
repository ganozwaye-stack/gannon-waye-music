import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { normalizeLiveStoreProducts } from '../../src/lib/normalizeLiveStoreProducts.js';

const live = { id: 'verified-hoodie', name: 'Hoodie', is_active: true, publication_status: 'live', is_stage_one_sale: true, sale_price: 98, stock_quantity: 14 };

for (const [name, wrap] of [['array', x => x], ['data', x => ({ data: x })], ['entities', x => ({ entities: x })]]) {
  test(`preserves verified products from ${name} response without changing price or stock`, () => {
    const rows = normalizeLiveStoreProducts(wrap([live]));
    assert.deepEqual(rows, [live]);
    assert.equal(rows[0], live);
    assert.deepEqual(rows.map(p => p.name), ['Hoodie']);
  });
}

test('empty and malformed responses never restore fallback stock', () => {
  for (const response of [undefined, null, false, 3, 'invalid', {}, [], { data: {} }, { entities: 'invalid' }, { data: { entities: [live] } }]) {
    assert.deepEqual(normalizeLiveStoreProducts(response), []);
  }
});

test('mixed envelopes exclude malformed, draft, inactive and unapproved-stage records', () => {
  const invalid = [null, [], 4, 'x', {}, { ...live, id: null }, { ...live, name: 7 }, { ...live, is_active: false }, { ...live, publication_status: 'draft' }, { ...live, is_stage_one_sale: false }];
  assert.deepEqual(normalizeLiveStoreProducts({ data: [...invalid, live] }), [live]);
});

test('malformed description cannot crash the downstream site search', () => {
  const rows = normalizeLiveStoreProducts([live, { ...live, description: 123 }]);
  assert.deepEqual(rows, [live]);
  assert.deepEqual(rows.filter(p => p.name?.toLowerCase().includes('mug') || p.description?.toLowerCase().includes('mug')), []);
});

test('unverified or non-positive prices never become a displayed zero-dollar product', () => {
  for (const sale_price of [undefined, null, '', '98', 'invalid', NaN, Infinity, 0, -1]) {
    assert.deepEqual(normalizeLiveStoreProducts([{ ...live, sale_price }]), []);
  }
  assert.equal(normalizeLiveStoreProducts([live])[0].sale_price, 98);
});

test('shared fetch normalizes all supported responses and keeps query gates and sort', async () => {
  const source = await readFile(new URL('../../src/lib/liveStoreProducts.js', import.meta.url), 'utf8');
  const executable = source.replace(/^import .*;\n/gm, '').replaceAll('export ', '');
  for (const response of [[live], { data: [live] }, { entities: [live] }, {}]) {
    let argumentsSeen;
    const base44 = { entities: { MerchProduct: { filter: async (...args) => { argumentsSeen = args; return response; } } } };
    const fetch = new Function('base44', 'normalizeLiveStoreProducts', `${executable}\nreturn fetchLiveStoreProducts;`)(base44, normalizeLiveStoreProducts);
    assert.deepEqual(await fetch('name'), normalizeLiveStoreProducts(response));
    assert.deepEqual(argumentsSeen, [{ is_active: true, publication_status: 'live', is_stage_one_sale: true }, 'name']);
  }
});

test('SDK errors propagate so React Query can report failure', async () => {
  const source = await readFile(new URL('../../src/lib/liveStoreProducts.js', import.meta.url), 'utf8');
  const executable = source.replace(/^import .*;\n/gm, '').replaceAll('export ', '');
  const base44 = { entities: { MerchProduct: { filter: async () => { throw new Error('unavailable'); } } } };
  const fetch = new Function('base44', 'normalizeLiveStoreProducts', `${executable}\nreturn fetchLiveStoreProducts;`)(base44, normalizeLiveStoreProducts);
  await assert.rejects(fetch(), /unavailable/);
});
