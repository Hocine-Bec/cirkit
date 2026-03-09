import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
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

export default function OrderCard({ order }: { order: OrderResponse }) {
    return (
        <Link
            to={`/account/orders/${order.id}`}
            className="block p-5 rounded-xl bg-bg-secondary/60 border border-border hover:border-border-hover transition-colors group"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-text-primary">
                            #{order.orderNumber}
                        </span>
                        <Badge variant={statusVariant[order.status] ?? 'default'}>
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-xs text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-mono font-semibold text-text-primary">
                        ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-text-muted">
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </p>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-end text-xs text-text-muted group-hover:text-accent transition-colors">
                View Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
        </Link>
    );
}
