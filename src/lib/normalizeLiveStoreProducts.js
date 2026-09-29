/** Normalize SDK list envelopes and keep the public catalogue fail closed. */
export function normalizeLiveStoreProducts(response) {
  const candidates = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.entities)
        ? response.entities
        : [];

  return candidates.filter(product => (
    product !== null &&
    typeof product === 'object' &&
    !Array.isArray(product) &&
    typeof product.id === 'string' && product.id.length > 0 &&
    typeof product.name === 'string' &&
    (product.description == null || typeof product.description === 'string') &&
    typeof product.sale_price === 'number' &&
    Number.isFinite(product.sale_price) && product.sale_price > 0 &&
    product.is_active === true &&
    product.publication_status === 'live' &&
    product.is_stage_one_sale === true
  ));
}
