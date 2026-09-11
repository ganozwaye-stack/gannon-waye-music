import { useId } from 'react';

function formatPrice(product) {
  const value = Number(product?.sale_price ?? product?.price ?? 0);
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

export default function CompleteTheSetOption({
  product,
  completeSetProduct,
  purchaseChoice,
  onChoiceChange,
  onViewDetails,
}) {
  const groupName = useId();

  if (!completeSetProduct) return null;

  const bundleAvailable = Number(completeSetProduct.stock_quantity) > 0;

  return (
    <fieldset
      data-testid="complete-set-option"
      className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3"
    >
      <legend className="px-1 font-body text-[10px] font-semibold tracking-[0.16em] uppercase text-primary">
        Complete the Set
      </legend>
      <p className="font-body text-[10px] leading-relaxed text-muted-foreground">
        Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
      </p>

      <div className="mt-2 space-y-2">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2 hover:border-primary/40">
          <span className="flex items-center gap-2">
            <input
              data-testid="purchase-choice-item"
              type="radio"
              name={groupName}
              value="item"
              checked={purchaseChoice === 'item'}
              onChange={() => onChoiceChange('item')}
              className="accent-primary"
            />
            <span className="font-body text-xs text-foreground">This item</span>
          </span>
          <span className="font-body text-xs text-foreground">${formatPrice(product)} AUD</span>
        </label>

        <label className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${bundleAvailable ? 'cursor-pointer border-border/40 hover:border-primary/40' : 'cursor-not-allowed border-border/20 opacity-50'}`}>
          <span className="flex items-center gap-2">
            <input
              data-testid="purchase-choice-set"
              type="radio"
              name={groupName}
              value="set"
              checked={purchaseChoice === 'set'}
              disabled={!bundleAvailable}
              onChange={() => onChoiceChange('set')}
              className="accent-primary"
            />
            <span className="font-body text-xs text-foreground">Winter Writing & Comfort Bundle</span>
          </span>
          <span className="font-body text-xs text-primary">${formatPrice(completeSetProduct)} AUD</span>
        </label>
      </div>

      <a
        data-testid="complete-set-link"
        href={`#store-product-${completeSetProduct.id}`}
        onClick={onViewDetails}
        className="mt-2 inline-flex font-body text-[10px] font-semibold tracking-wide text-primary underline underline-offset-4 hover:text-primary/80"
      >
        View the Winter Writing & Comfort Bundle
      </a>
    </fieldset>
  );
}
