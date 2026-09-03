import { base44 } from '@/api/base44Client';

export const LIVE_STORE_PRODUCT_FILTER = Object.freeze({
  is_active: true,
  publication_status: 'live',
  is_stage_one_sale: true,
});

export const fetchLiveStoreProducts = (sort = '-created_date') => (
  base44.entities.MerchProduct.filter(LIVE_STORE_PRODUCT_FILTER, sort)
);

export const formatAudPrice = (value) => new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
  maximumFractionDigits: 2,
}).format(Number(value) || 0);
