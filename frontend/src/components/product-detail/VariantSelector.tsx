import { cn } from '@/utils/cn';
import type { ProductVariantResponse } from '@/types';

interface Props {
  variants: ProductVariantResponse[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  basePrice: number;
}

export default function VariantSelector({ variants, selectedId, onSelect, basePrice }: Props) {
  const active = variants.filter(v => v.isActive);
  if (!active.length) return null;

  return (
    <div>
      <p className="text-text-secondary text-sm font-medium mb-3">Select Option</p>
      <div className="flex flex-wrap gap-2">
        {active.map((v) => {
          const isSelected = selectedId === v.id;
          const isOutOfStock = v.stockQuantity === 0;
          const price = basePrice + v.priceModifier;
          return (
            <button
              key={v.id}
              disabled={isOutOfStock}
              onClick={() => onSelect(v.id)}
              className={cn(
                'px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-border text-text-secondary hover:border-border-hover',
                isOutOfStock && 'opacity-40 line-through cursor-not-allowed'
              )}
            >
              <span>{v.name}</span>
              <span className="ml-2 font-mono text-xs text-text-muted">
                ${price.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
