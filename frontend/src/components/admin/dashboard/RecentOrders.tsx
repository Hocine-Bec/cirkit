import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import type { OrderResponse } from '@/types';

const statusVariant: Record<string, 'warning' | 'info' | 'success' | 'danger' | 'default'> = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'danger',
    Refunded: 'default',
};

export default function RecentOrders({ orders }: { orders: OrderResponse[] }) {
    return (
        <div className="flex flex-col h-full rounded-xl bg-bg-secondary/60 border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">Recent Orders</h2>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted">
                        <tr>
                            <th className="px-6 py-4 font-medium">Order #</th>
                            <th className="px-6 py-4 font-medium">Customer</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-text-muted">
                                    No recent orders
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-bg-hover transition-colors">
                                    <td className="px-6 py-4 font-mono text-text-primary">
                                        <Link to={`/admin/orders?search=${order.orderNumber}`} className="hover:text-accent">
                                            #{order.orderNumber}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {order.customerName}
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={statusVariant[order.status] ?? 'default'}>
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-text-primary text-right">
                                        ${order.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-border bg-bg-tertiary/30">
                <Link
                    to="/admin/orders"
                    className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                    View All Orders <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
