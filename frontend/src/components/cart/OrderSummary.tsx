import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

const SHIPPING_THRESHOLD = 99;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.085;

export default function OrderSummary() {
  const { cartSubtotal } = useCart();
  const shipping = cartSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = cartSubtotal * TAX_RATE;
  const total = cartSubtotal + shipping + tax;

  const remaining = Math.max(0, SHIPPING_THRESHOLD - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / SHIPPING_THRESHOLD) * 100);
  const qualifiesForFree = cartSubtotal >= SHIPPING_THRESHOLD;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border p-6 space-y-5">
      <h3 className="text-text-primary font-semibold">Order Summary</h3>

      {/* Free shipping progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Truck size={12} />
            {qualifiesForFree ? (
              <span className="text-success font-medium">You qualify for free shipping!</span>
            ) : (
              <>Add <span className="text-accent font-medium">${remaining.toFixed(2)}</span> for free shipping</>
            )}
          </span>
        </div>
        <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${qualifiesForFree ? 'bg-success' : 'bg-accent'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-3 text-sm border-t border-border pt-4">
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
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-border pt-4">
        <span className="text-text-primary font-semibold">Total</span>
        <span className="font-mono text-2xl font-bold gradient-text">${total.toFixed(2)}</span>
      </div>

      <Link to="/checkout">
        <Button variant="primary" size="lg" className="w-full glow-blue-hover">
          Proceed to Checkout
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </Link>

      <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
        <ShieldCheck size={13} className="text-accent" />
        <span>Secure checkout — SSL encrypted</span>
      </div>
    </div>
  );
}
