import { Eye } from 'lucide-react';
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

interface OrderTableProps {
    orders: OrderResponse[];
    onViewOrder: (order: OrderResponse) => void;
}

export default function OrderTable({ orders, onViewOrder }: OrderTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-bg-secondary/60">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium">Order #</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Customer</th>
                        <th className="px-6 py-4 font-medium">Total</th>
                        <th className="px-6 py-4 font-medium">Payment</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                No orders match your filter criteria.
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-bg-hover transition-colors bg-bg-primary/40">
                                <td className="px-6 py-4 font-mono font-medium text-text-primary">
                                    {order.orderNumber}
                                </td>
                                <td className="px-6 py-4 text-text-secondary">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-text-primary font-medium">
                                    {order.customerName}
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-text-primary">
                                    ${order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="default" className="text-xs capitalize">
                                        {order.paymentMethod}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={statusVariant[order.status] ?? 'default'}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onViewOrder(order)}
                                        className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer inline-flex"
                                        title="View Details & Manage Status"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
