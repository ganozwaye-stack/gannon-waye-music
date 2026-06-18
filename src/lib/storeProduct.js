export const POSTER_PRODUCT_ID = '6a2d595ef7bb7ff53258cdfe';
export const POSTER_PRODUCT_SLUG = 'respect-is-earned-assorted-wall-poster-pricing-from-19';

export const POSTER_PRODUCT_FALLBACK = {
  id: POSTER_PRODUCT_ID,
  name: 'Respect Is Earned: Assorted Wall Poster Pricing from $19',
  description:
    'Premium lyric wall art. A self-worth statement piece and official music release collector item. Made to order in A4, A3, A2 and A1.',
  category: 'poster',
  sale_price: 19,
  stock_quantity: 100,
  is_active: true,
  promo_eligible: true,
  sizes_available: ['A4 — $19', 'A3 — $29', 'A2 — $39', 'A1 — $59'],
  image_url:
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/a54656262_5e2e49fe-b4c2-448f-9390-35847282f185.png',
  images_array: [
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/a54656262_5e2e49fe-b4c2-448f-9390-35847282f185.png',
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/5eadb61eb_3cc92327-85e8-4975-9798-8ab605e3fea5.png',
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/f20e4dc31_d76efdba-9035-43ee-b021-a6110ccc3c91.png',
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/28dcfe864_27a4687d-57f7-4aee-a72a-6a3f83e262a0.png',
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/9b8d40e58_b576c5e1-1b07-4045-9dd4-7fbbde34b256.png',
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/69a97f570_19e1b087-3885-49a3-84b4-c21bc66e2c14.png',
    'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/8d365fec0_e49c41f2-adf8-472d-89be-9a7e2de20aa4.png',
  ],
};

export function slugifyProductName(value = '') {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductVariants(product) {
  if (Array.isArray(product?.variants) && product.variants.length > 0) {
    return product.variants
      .map((variant) => {
        const label = variant.label || variant.size || variant.name;
        const price = Number(variant.price ?? variant.sale_price);
        if (!label || !Number.isFinite(price)) return null;
        return { label, price, value: String(label) };
      })
      .filter(Boolean);
  }

  return (product?.sizes_available || [])
    .map((option) => {
      const value = String(option);
      const match = value.match(/^(.*?)\s*[—–-]\s*\$?\s*(\d+(?:\.\d+)?)\s*$/);
      if (!match) {
        return {
          label: value,
          price: Number(product?.sale_price ?? product?.price ?? 0),
          value,
        };
      }
      return { label: match[1].trim(), price: Number(match[2]), value };
    })
    .filter((variant) => variant.label);
}

export function productMatchesRoute(product, routeValue = '') {
  const normalized = decodeURIComponent(routeValue).toLowerCase();
  if (String(product?.id || '').toLowerCase() === normalized) return true;
  if (slugifyProductName(product?.name) === normalized) return true;

  return (
    String(product?.id) === POSTER_PRODUCT_ID &&
    ['thankyou-respect-poster-2026', POSTER_PRODUCT_SLUG].includes(normalized)
  );
}

export function productWithVariantPrice(product, variant) {
  if (!variant) return product;
  return {
    ...product,
    sale_price: variant.price,
    price_note: `${variant.label} — $${variant.price} AUD`,
    selected_variant: variant.label,
  };
}
