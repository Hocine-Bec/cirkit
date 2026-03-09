import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PackageOpen } from 'lucide-react';
import { customerOrdersApi } from '@/services/api';
import OrderCard from '@/components/account/OrderCard';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';

export default function OrdersPage() {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['my-orders'],
        queryFn: customerOrdersApi.getMyOrders,
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center border border-danger/20 bg-danger/5 rounded-xl">
                <p className="text-danger">Failed to load orders. Please try again later.</p>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-bg-secondary/30 border border-border rounded-xl border-dashed">
                <PackageOpen className="w-16 h-16 text-text-muted mb-4" />
                <h2 className="text-lg font-semibold text-text-primary mb-2">No orders yet</h2>
                <p className="text-sm text-text-secondary mb-6 max-w-sm">
                    You haven't placed any orders yet. Browse our products to find something you'll love.
                </p>
                <Link to="/products">
                    <Button variant="primary">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}
