import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/types';

interface Props {
  item: CartItem;
}

export default function CartItemRow({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-bg-secondary">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-2"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.slug}`}
          className="font-medium text-text-primary hover:text-accent transition-colors text-sm line-clamp-2"
        >
          {item.name}
        </Link>
        {item.variantName && (
          <p className="text-text-muted text-xs mt-0.5">{item.variantName}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-colors text-sm"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="text-text-primary text-sm font-medium w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-colors text-sm"
              disabled={item.quantity >= item.maxStock}
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono font-semibold text-text-primary text-sm">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.productId, item.variantId)}
              className="text-text-muted hover:text-danger transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
