import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';

export default function CheckoutPage() {
  const { items } = useCart();
  const { isCustomerAuthenticated } = useCustomerAuth();

  // Prevent scroll restoration artifacts
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // Redirect unauthenticated users
  if (!isCustomerAuthenticated) {
    return <Navigate to="/account/login?redirect=/checkout" replace />;
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Minimal header */}
      <header className="border-b border-border bg-bg-secondary/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-text-primary text-lg tracking-tight">CirKit</span>
          </Link>
          <span className="text-text-muted text-sm">Secure Checkout</span>
          <Link to="/cart" className="text-accent text-sm hover:text-accent-glow transition-colors">
            Back to Cart
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form — 2 cols */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Summary — 1 col */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
