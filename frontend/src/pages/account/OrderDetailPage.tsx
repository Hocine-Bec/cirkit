import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { customerOrdersApi } from '@/services/api';
import OrderStatusTimeline from '@/components/account/OrderStatusTimeline';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

const statusVariant: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'danger',
    Refunded: 'default',
};

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', id],
        queryFn: () => customerOrdersApi.getMyOrderDetail(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-24 w-full" />
                <div className="grid md:grid-cols-3 gap-6">
                    <Skeleton className="md:col-span-2 h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-12">
                <p className="text-danger mb-4">Error loading order details.</p>
                <Link to="/account/orders" className="text-accent hover:underline">
                    Return to Orders
                </Link>
            </div>
        );
    }

    // Parse shipping address
    let shippingAddress;
    try {
        shippingAddress = JSON.parse(order.shippingAddressSnapshot);
    } catch (e) {
        shippingAddress = null;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    to="/account/orders"
                    className="inline-flex items-center text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-mono text-text-primary">
                            #{order.orderNumber}
                        </h1>
                        <p className="text-sm text-text-muted mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <Badge variant={statusVariant[order.status] ?? 'default'} className="w-fit text-sm px-3 py-1">
                        {order.status}
                    </Badge>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-6 rounded-xl bg-bg-secondary/60 border border-border">
                <OrderStatusTimeline status={order.status} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-border overflow-hidden bg-bg-secondary/30">
                        <div className="px-6 py-4 border-b border-border bg-bg-secondary/60">
                            <h2 className="font-semibold text-text-primary">Order Items</h2>
                        </div>
                        <div className="divide-y divide-border">
                            {order.items.map(item => (
                                <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="font-medium text-text-primary hover:text-accent transition-colors block"
                                        >
                                            {item.productName}
                                        </Link>
                                        {item.variantName && (
                                            <p className="text-sm text-text-secondary mt-1">{item.variantName}</p>
                                        )}
                                    </div>
                                    <div className="text-sm text-right shrink-0">
                                        <p className="font-mono text-text-secondary">
                                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                                        </p>
                                        <p className="font-mono font-semibold text-text-primary mt-1">
                                            ${item.total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary & Info */}
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-6 rounded-xl bg-bg-secondary/60 border border-border">
                        <h3 className="font-semibold text-text-primary mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-text-secondary">
                                <span>Subtotal ({order.itemCount} items)</span>
                                <span className="font-mono">${order.subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Shipping</span>
                                <span className="font-mono">${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Tax</span>
                                <span className="font-mono">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-text-primary font-medium">
                                <span>Total</span>
                                <span className="text-lg font-mono font-bold">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {shippingAddress && (
                        <div className="p-6 rounded-xl bg-bg-secondary/60 border border-border">
                            <h3 className="font-semibold text-text-primary mb-4">Shipping Destination</h3>
                            <div className="text-sm text-text-secondary leading-relaxed">
                                <p>{order.customerName}</p>
                                <p>{shippingAddress.street}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                                <p>{shippingAddress.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Payment Info */}
                    <div className="p-6 rounded-xl bg-bg-secondary/60 border border-border">
                        <h3 className="font-semibold text-text-primary mb-4">Payment Method</h3>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                            <CreditCard className="w-5 h-5" />
                            <span className="capitalize">{order.paymentMethod}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
