import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

function firstUsableString(values) {
  return values.flat().find(value => typeof value === 'string' && value.trim().length > 0)?.trim() || null;
}

function getProductImageSrc(product) {
  return firstUsableString([
    product?.image_url,
    product?.images,
    product?.images_array,
    product?.back_image_url,
  ]);
}

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CartItemImage({
  product,
  alt,
  className = 'w-20 h-20 object-cover rounded-lg bg-secondary/50 shrink-0',
  fallbackClassName = '',
  testId = 'cart-item-image',
}) {
  const [failed, setFailed] = useState(false);
  const src = getProductImageSrc(product);
  const label = alt || product?.name || 'Product';

  if (src && !failed) {
    return (
      <img
        data-testid={testId}
        src={src}
        alt={label}
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      data-testid={`${testId}-fallback`}
      role="img"
      aria-label={`${label} image pending`}
      className={fallbackClassName || joinClasses(className, 'border border-border/20 flex items-center justify-center')}
    >
      <ShoppingBag className="w-7 h-7 text-muted-foreground/35" aria-hidden="true" />
    </div>
  );
}
