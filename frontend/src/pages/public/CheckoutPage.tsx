import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Zap, ShoppingCart, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';

const STEPS = [
  { icon: ShoppingCart, label: 'Cart' },
  { icon: ClipboardCheck, label: 'Checkout' },
  { icon: CheckCircle2, label: 'Confirmation' },
];

export default function CheckoutPage() {
  const { items } = useCart();
  const { isCustomerAuthenticated } = useCustomerAuth();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  if (!isCustomerAuthenticated) {
    return <Navigate to="/account/login?redirect=/checkout" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Minimal checkout header */}
      <header className="border-b border-border bg-bg-secondary/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-text-primary text-lg tracking-tight">CirKit</span>
          </Link>

          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-2">
            {STEPS.map((step, i) => {
              const isActive = i === 1;
              const isDone = i === 0;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    isActive
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : isDone
                      ? 'border-success/30 text-success bg-success/10'
                      : 'border-border text-text-muted'
                  }`}>
                    <step.icon size={11} />
                    {step.label}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-6 h-px bg-border" />
                  )}
                </div>
              );
            })}
          </div>

          <Link to="/cart" className="text-text-muted hover:text-accent text-sm transition-colors flex-shrink-0">
            ← Back to Cart
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">
          <span className="gradient-text">Secure</span>{' '}
          <span className="text-text-primary">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
