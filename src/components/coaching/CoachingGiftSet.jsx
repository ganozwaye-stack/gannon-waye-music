import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { STORE_CRASHED } from '@/config/storeStatus';

// Reuse the store's existing record. No local stock, duplicated SKU or assumed TYK sync.
const GIFT_SET_PRODUCT_ID = '69fbd261b760426cede1b7a3';

export default function CoachingGiftSet() {
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['coaching-existing-gift-set', GIFT_SET_PRODUCT_ID],
    queryFn: async () => {
      const records = await base44.entities.MerchProduct.filter({ id: GIFT_SET_PRODUCT_ID });
      return records.find(item => item.id === GIFT_SET_PRODUCT_ID && item.is_active === true &&
        item.publication_status === 'live' && item.is_stage_one_sale === true) || null;
    },
  });
  if (isLoading || isError || !product) return null;
  return (
    <section className="max-w-6xl mx-auto px-5 pb-16" aria-labelledby="coaching-gift-set-title">
      <div className="grid md:grid-cols-2 gap-8 rounded-3xl border border-border/40 bg-card/50 p-7 items-center">
        {product.image_url && <img src={product.image_url} alt={product.name}
          loading="lazy" className="w-full rounded-2xl object-contain" />}
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-primary mb-3">Physical journal gift set</p>
          <h2 id="coaching-gift-set-title" className="font-display text-3xl mb-4">{product.name}</h2>
          <p className="font-body text-base leading-relaxed text-foreground/80 mb-4">{product.description}</p>
          {Number.isFinite(product.sale_price) && <p className="font-body text-lg text-primary mb-4">
            A$ {product.sale_price.toFixed(2)}
          </p>}
          <p className="font-body text-sm text-muted-foreground mb-5">
            This physical gift set is separate from the six digital reflection journals.
          </p>
          {STORE_CRASHED ? <p className="font-body text-sm text-muted-foreground">
            Online ordering is currently unavailable.
          </p> : <Link className="font-body text-sm text-primary underline" to="/store">View the gift set in the store</Link>}
        </div>
      </div>
    </section>
  );
}
