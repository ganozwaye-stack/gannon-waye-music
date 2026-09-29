import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import { STOREFRONT_ART_LOCK } from '@/config/storefrontArtLock';
import SourcingProductCard from './SourcingProductCard';

// The micro-brand dropshipping Sourcing Board: the locked boutique store world
// up top, then every live product with its design, its numbers and the owner
// recorded colour options from the dropshipping supplier, all in one place for
// planning orders. House style: no em dashes.
export default function SourcingBoardTab() {
  const [products, setProducts] = useState(null);
  const [supplierProducts, setSupplierProducts] = useState([]);

  useEffect(() => {
    base44.entities.MerchProduct.filter({ is_active: true, publication_status: 'live' }, 'name', 100)
      .then(setProducts)
      .catch(() => setProducts([]));
    base44.entities.SupplierProduct.list()
      .then(setSupplierProducts)
      .catch(() => setSupplierProducts([]));
  }, []);

  if (!products) {
    return (
      <div className="flex items-center justify-center py-20" role="status" aria-live="polite">
        <Loader2 className="w-6 h-6 animate-spin text-primary/70" />
      </div>
    );
  }

  return (
    <div>
      {/* The locked boutique world, shown untouched and unobscured */}
      <div className="mb-8">
        <div className="rounded-2xl overflow-hidden border border-primary/25">
          <img src={STOREFRONT_ART_LOCK.imageUrl} alt="The locked boutique store world" className="w-full block" />
        </div>
        <p className="font-body text-[11px] text-muted-foreground mt-2">
          The locked boutique world. Every card below is a live product in this world.
        </p>
      </div>

      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <h2 className="font-display text-2xl text-foreground">Live Products &amp; Supplier Colours</h2>
        <p className="font-body text-xs text-muted-foreground">{products.length} live on the store</p>
      </div>

      {products.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No live products yet. Products go live through the Merch Designs approval flow.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map(p => (
            <SourcingProductCard
              key={p.id}
              product={p}
              supplierProduct={supplierProducts.find(s => s.merch_product_id === p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}