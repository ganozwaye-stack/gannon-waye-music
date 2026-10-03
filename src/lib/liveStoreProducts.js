import { base44 } from '@/api/base44Client';
import { normalizeLiveStoreProducts } from './normalizeLiveStoreProducts.js';

export const LIVE_STORE_PRODUCT_FILTER = Object.freeze({
  is_active: true,
  publication_status: 'live',
  is_stage_one_sale: true,
});

export const fetchLiveStoreProducts = async (sort = '-created_date') => {
  const response = await base44.entities.MerchProduct.filter(LIVE_STORE_PRODUCT_FILTER, sort);
  // Never invent fallback products, prices or stock when data is absent.
  return normalizeLiveStoreProducts(response);
};

export const formatAudPrice = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  maximumFractionDigits: 2,
}).format(Number(value) || 0);
