import { useCart } from '@/hooks/useCart';
import { ShieldCheck } from 'lucide-react';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export function getCheckoutTotals(subtotal: number) {
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { shipping, tax, total };
}

export default function CheckoutOrderSummary() {
  const { items, cartSubtotal } = useCart();
  const { shipping, tax, total } = getCheckoutTotals(cartSubtotal);

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border p-6 space-y-6">
      <h3 className="text-text-primary font-semibold">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
            <div className="w-12 h-12 rounded-lg bg-bg-tertiary overflow-hidden flex-shrink-0">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-xs font-medium line-clamp-1">{item.name}</p>
              {item.variantName && (
                <p className="text-text-muted text-xs">{item.variantName}</p>
              )}
              <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
            </div>
            <span className="font-mono text-text-primary text-xs font-medium flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-mono text-text-primary">${cartSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="text-success font-medium">Free</span>
          ) : (
            <span className="font-mono text-text-primary">${shipping.toFixed(2)}</span>
          )}
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Tax (8%)</span>
          <span className="font-mono text-text-primary">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-text-primary font-semibold text-base border-t border-border pt-2">
          <span>Total</span>
          <span className="font-mono">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
        <ShieldCheck size={13} />
        <span>SSL encrypted — your data is safe</span>
      </div>
    </div>
  );
}
