import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminCustomersApi } from '@/services/api';
import CustomerTable from '@/components/admin/customers/CustomerTable';
import CustomerDetailModal from '@/components/admin/customers/CustomerDetailModal';
import Skeleton from '@/components/ui/Skeleton';

export default function CustomerManagementPage() {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

    // List Query
    const { data: customersData, isLoading, error } = useQuery({
        queryKey: ['admin', 'customers'],
        queryFn: () => adminCustomersApi.getAll(),
    });

    // Detail Query (fires only when selectedCustomerId is set)
    const { data: customerDetailData } = useQuery({
        queryKey: ['admin', 'customer', selectedCustomerId],
        queryFn: () => adminCustomersApi.getById(selectedCustomerId!),
        enabled: !!selectedCustomerId,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-6 w-64 bg-bg-tertiary rounded animate-pulse" />
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl text-danger text-center">
                Failed to load customer directory.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-text-secondary">
                    View customer profiles, lifetime value, and order history.
                </p>
            </div>

            <CustomerTable
                customers={customersData || []}
                onViewCustomer={(c) => setSelectedCustomerId(c.id)}
            />

            <CustomerDetailModal
                isOpen={!!selectedCustomerId}
                onClose={() => setSelectedCustomerId(null)}
                customer={
                    customerDetailData
                        ? {
                            ...customerDetailData,
                            orderCount: customersData?.find((c) => c.id === selectedCustomerId)?.orderCount,
                            totalSpent: customersData?.find((c) => c.id === selectedCustomerId)?.totalSpent,
                        }
                        : null
                }
            />
        </div>
    );
}
