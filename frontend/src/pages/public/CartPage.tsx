import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Container from '@/components/ui/Container';
import CartItemRow from '@/components/cart/CartItemRow';
import OrderSummary from '@/components/cart/OrderSummary';
import { staggerContainer, staggerItem } from '@/utils/animations';

export default function CartPage() {
  const { items } = useCart();

  return (
    <Container className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/products"
          className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-text-primary mb-8">
        Shopping Cart
        {items.length > 0 && (
          <span className="ml-3 text-lg font-normal text-text-muted">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <ShoppingCart size={64} className="text-text-muted mx-auto mb-6 opacity-30" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">Your cart is empty</h2>
          <p className="text-text-muted mb-8">Add some products to get started</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-glow transition-colors"
          >
            Browse Products
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
            <div className="bg-bg-secondary rounded-2xl border border-border p-6">
              {items.map((item) => (
                <motion.div key={`${item.productId}-${item.variantId}`} variants={staggerItem}>
                  <CartItemRow item={item} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary />
          </div>
        </div>
      )}
    </Container>
  );
}
