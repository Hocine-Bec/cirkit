import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronRight, Home, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Container from '@/components/ui/Container';
import CartItemRow from '@/components/cart/CartItemRow';
import OrderSummary from '@/components/cart/OrderSummary';
import { staggerContainer, staggerItem } from '@/utils/animations';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-border bg-bg-secondary/40">
        <Container>
          <div className="py-8">
            <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
              <Link to="/" className="hover:text-accent transition-colors flex items-center gap-1">
                <Home size={11} /> Home
              </Link>
              <ChevronRight size={11} className="text-text-muted/50" />
              <span className="text-text-secondary">Shopping Cart</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">Shopping</span>{' '}
                <span className="text-text-primary">Cart</span>
              </h1>
              {items.length > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-bg-tertiary border border-border flex items-center justify-center mb-6">
              <ShoppingCart size={40} className="text-text-muted" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
            <p className="text-text-muted mb-8 max-w-xs">
              Looks like you haven't added anything yet. Browse our products and find something you'll love.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-medium transition-colors"
            >
              Browse Products <ArrowRight size={15} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <motion.div
              className="lg:col-span-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-bg-secondary rounded-2xl border border-border divide-y divide-border">
                {items.map((item) => (
                  <motion.div key={`${item.productId}-${item.variantId}`} variants={staggerItem}>
                    <CartItemRow item={item} />
                  </motion.div>
                ))}
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-text-muted hover:text-accent transition-colors text-sm mt-5"
              >
                ← Continue Shopping
              </Link>
            </motion.div>

            {/* Order summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
