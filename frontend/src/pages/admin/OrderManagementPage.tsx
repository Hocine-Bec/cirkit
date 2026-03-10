import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminOrdersApi } from '@/services/api';
import OrderTable from '@/components/admin/orders/OrderTable';
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal';
import Skeleton from '@/components/ui/Skeleton';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';


const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Refunded', label: 'Refunded' },
];

export default function OrderManagementPage() {
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    const { data: orderDetailData } = useQuery({
        queryKey: ['admin', 'order', selectedOrderId],
        queryFn: () => adminOrdersApi.getById(selectedOrderId!),
        enabled: !!selectedOrderId,
    });

    const { data: ordersData, isLoading, error } = useQuery({
        queryKey: ['admin', 'orders', statusFilter],
        queryFn: () => adminOrdersApi.getAll({
            status: statusFilter || undefined,
            page: 1,
            pageSize: 50
        }),
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-48 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl text-danger text-center">
                Failed to load orders.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-text-secondary">
                    Monitor incoming orders, process shipments, and handle refunds.
                </p>
            </div>

            <div className="bg-bg-secondary/40 p-4 rounded-xl border border-border flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-48">
                    <Select
                        label="Filter by Status"
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    />
                </div>

                {/* Date filters could go here, but keeping it simple as per specs. Basic text clear fits well. */}
                {statusFilter && (
                    <Button
                        variant="ghost"
                        onClick={() => setStatusFilter('')}
                        className="mb-0.5 text-text-muted hover:text-text-primary"
                    >
                        Clear Filter
                    </Button>
                )}
            </div>

            <OrderTable
                orders={ordersData?.items || []}
                onViewOrder={(order) => setSelectedOrderId(order.id)}
            />

            <OrderDetailModal
                isOpen={!!selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                order={orderDetailData || null}
            />
        </div>
    );
}
