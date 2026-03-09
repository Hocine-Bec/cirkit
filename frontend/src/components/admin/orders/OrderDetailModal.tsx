import { CreditCard, MapPin } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import OrderStatusActions from './OrderStatusActions';
import type { OrderDetailResponse } from '@/types';

const statusVariant: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'danger',
    Refunded: 'default',
};

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderDetailResponse | null;
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
    if (!order) return null;

    let shippingAddress;
    try {
        shippingAddress = JSON.parse(order.shippingAddressSnapshot);
    } catch {
        shippingAddress = null;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Order #${order.orderNumber}`}
        >
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Header Ribbon */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-bg-secondary/60 border border-border">
                    <div>
                        <p className="text-sm text-text-secondary">Placed on</p>
                        <p className="font-medium text-text-primary">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-text-secondary">Status</p>
                        <Badge variant={statusVariant[order.status] ?? 'default'} className="mt-0.5">
                            {order.status}
                        </Badge>
                    </div>
                    <div className="sm:text-right">
                        <p className="text-sm text-text-secondary">Total Amount</p>
                        <p className="text-lg font-mono font-bold text-accent">
                            ${order.total.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Customer & Address Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2 mb-3 text-text-primary font-medium">
                            <CreditCard className="w-4 h-4 text-accent" /> Customer & Payment
                        </div>
                        <div className="space-y-1.5 text-sm text-text-secondary">
                            <p><span className="text-text-muted">Name:</span> {order.customerName}</p>
                            <p><span className="text-text-muted">Method:</span> <span className="capitalize">{order.paymentMethod}</span></p>
                            {order.stripePaymentIntentId && (
                                <p className="truncate" title={order.stripePaymentIntentId}>
                                    <span className="text-text-muted">Stripe ID:</span> <span className="font-mono text-xs">{order.stripePaymentIntentId}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2 mb-3 text-text-primary font-medium">
                            <MapPin className="w-4 h-4 text-accent" /> Shipping Destination
                        </div>
                        <div className="text-sm text-text-secondary leading-relaxed">
                            {shippingAddress ? (
                                <>
                                    <p>{order.customerName}</p>
                                    <p>{shippingAddress.street}</p>
                                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                                    <p>{shippingAddress.country}</p>
                                </>
                            ) : (
                                <p className="italic text-text-muted">Address parsing failed</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="rounded-xl border border-border overflow-hidden bg-bg-secondary/30">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                            <tr>
                                <th className="px-4 py-3 font-medium">Item</th>
                                <th className="px-4 py-3 font-medium text-right">Price</th>
                                <th className="px-4 py-3 font-medium text-right">Qty</th>
                                <th className="px-4 py-3 font-medium text-right">Line Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-text-primary truncate max-w-[200px]" title={item.productName}>
                                            {item.productName}
                                        </p>
                                        {item.variantName && (
                                            <p className="text-xs text-text-muted mt-0.5">{item.variantName}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-text-secondary text-right">
                                        ${item.unitPrice.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-text-secondary text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 font-mono font-medium text-text-primary text-right">
                                        ${item.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="bg-bg-secondary/60 p-4 border-t border-border">
                        <div className="w-48 ml-auto space-y-2 text-sm">
                            <div className="flex justify-between text-text-secondary">
                                <span>Subtotal</span>
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
                            <div className="flex justify-between text-text-primary font-bold pt-2 border-t border-border">
                                <span>Total</span>
                                <span className="font-mono text-accent">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Actions */}
                <OrderStatusActions order={order} onComplete={onClose} />
            </div>
        </Modal>
    );
}
