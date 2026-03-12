import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '@/types';

interface Props {
  item: CartItem;
}

export default function CartItemRow({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-5 p-5">
      {/* Image */}
      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-bg-tertiary border border-border">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-2"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <Link
            to={`/products/${item.slug}`}
            className="font-medium text-text-primary hover:text-accent transition-colors text-sm leading-snug line-clamp-2"
          >
            {item.name}
          </Link>
          {item.variantName && (
            <p className="text-text-muted text-xs mt-0.5">{item.variantName}</p>
          )}
          <p className="text-text-muted text-xs mt-1 font-mono">
            ${item.price.toFixed(2)} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-1 bg-bg-tertiary border border-border rounded-xl p-1">
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 transition-all"
            >
              <Minus size={12} />
            </button>
            <span className="text-text-primary text-sm font-semibold font-mono w-7 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 transition-all"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-text-primary">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.productId, item.variantId)}
              className="text-text-muted hover:text-danger transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
