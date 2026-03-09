import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { customerOrdersApi } from '@/services/api';
import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => customerOrdersApi.getMyOrderDetail(orderId!),
    enabled: !!orderId,
  });

  return (
    <Container className="py-16 max-w-3xl">
      {/* Success animation */}
      <motion.div
        className="flex flex-col items-center text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
        >
          <CheckCircle size={40} className="text-success" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Order Confirmed!
        </motion.h1>
        <motion.p
          className="text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Thank you for your purchase. We'll send you a confirmation email shortly.
        </motion.p>
      </motion.div>

      {/* Order details card */}
      <motion.div
        className="bg-bg-secondary rounded-2xl border border-border overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="border-t border-border pt-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : order ? (
          <>
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-text-muted text-sm">Order Number</p>
                  <p className="text-text-primary font-mono font-semibold text-lg">
                    #{order.orderNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-sm">Placed On</p>
                  <p className="text-text-primary text-sm">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted text-sm">Status</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium capitalize">
                    <Package size={11} />
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-6 space-y-4">
              <h3 className="text-text-primary font-medium text-sm">Items Ordered</h3>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-text-primary text-sm">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-text-muted text-xs">{item.variantName}</p>
                    )}
                    <p className="text-text-muted text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-text-primary text-sm">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-bg-tertiary p-6 space-y-2 text-sm border-t border-border">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-mono text-text-primary">${order.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                {order.shippingCost === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  <span className="font-mono text-text-primary">${order.shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Tax</span>
                <span className="font-mono text-text-primary">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-primary font-semibold text-base border-t border-border pt-2">
                <span>Total</span>
                <span className="font-mono">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-text-muted">
            Order details not found.
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex gap-4 mt-8 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          to="/account/orders"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-glow transition-colors"
        >
          View My Orders
          <ArrowRight size={15} />
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors font-medium"
        >
          <Home size={15} />
          Back to Home
        </Link>
      </motion.div>
    </Container>
  );
}
