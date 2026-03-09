import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

export default function OrderSummary() {
  const { cartSubtotal } = useCart();
  const shipping = cartSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = cartSubtotal * TAX_RATE;
  const total = cartSubtotal + shipping + tax;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border p-6 space-y-4">
      <h3 className="text-text-primary font-semibold">Order Summary</h3>

      <div className="space-y-3 text-sm">
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

        {cartSubtotal < SHIPPING_THRESHOLD && (
          <p className="text-xs text-text-muted border-t border-border pt-3">
            Add{' '}
            <span className="text-accent font-medium">
              ${(SHIPPING_THRESHOLD - cartSubtotal).toFixed(2)}
            </span>{' '}
            more for free shipping
          </p>
        )}

        <div className="flex justify-between text-text-primary font-semibold text-base border-t border-border pt-3">
          <span>Total</span>
          <span className="font-mono">${total.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/checkout">
        <Button variant="primary" size="lg" className="w-full glow-blue-hover mt-2">
          Proceed to Checkout
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </Link>

      <div className="flex items-center gap-2 text-xs text-text-muted justify-center pt-1">
        <ShieldCheck size={13} />
        <span>Secure checkout — SSL encrypted</span>
      </div>
    </div>
  );
}
