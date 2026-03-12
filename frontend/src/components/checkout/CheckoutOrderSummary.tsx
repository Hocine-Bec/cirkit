import { useCart } from '@/hooks/useCart';
import { ShieldCheck } from 'lucide-react';

const SHIPPING_THRESHOLD = 99;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.085;

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
    <div className="bg-bg-secondary rounded-2xl border border-border p-6 space-y-5">
      <h3 className="text-text-primary font-semibold">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-bg-tertiary border border-border overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1.5" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-xs font-medium line-clamp-2 leading-snug">{item.name}</p>
              {item.variantName && (
                <p className="text-text-muted text-xs mt-0.5">{item.variantName}</p>
              )}
            </div>
            <span className="font-mono text-text-primary text-xs font-semibold flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-border pt-4 space-y-2.5 text-sm">
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
          <span>Tax (8.5%)</span>
          <span className="font-mono text-text-primary">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-border pt-3">
          <span className="text-text-primary font-semibold">Total</span>
          <span className="font-mono text-xl font-bold gradient-text">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted justify-center pt-1">
        <ShieldCheck size={13} className="text-accent" />
        <span>SSL encrypted — your data is safe</span>
      </div>
    </div>
  );
}
