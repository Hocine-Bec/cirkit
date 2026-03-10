import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { analyticsApi, adminOrdersApi, productsApi } from '@/services/api';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import OrdersByStatusChart from '@/components/admin/dashboard/OrdersByStatusChart';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import LowStockAlerts from '@/components/admin/dashboard/LowStockAlerts';
import Skeleton from '@/components/ui/Skeleton';

export default function DashboardPage() {
    const [
        { data: overview, isLoading: obsLoading, error: obsError },
        { data: dailyRevenue, isLoading: revLoading },
        { data: statusData, isLoading: statLoading },
        { data: recentOrders, isLoading: ordersLoading },
        { data: allProducts, isLoading: prodLoading },
    ] = useQueries({
        queries: [
            { queryKey: ['admin', 'analytics', 'overview'], queryFn: analyticsApi.getOverview },
            { queryKey: ['admin', 'analytics', 'revenue'], queryFn: () => analyticsApi.getDailyRevenue(30) },
            { queryKey: ['admin', 'analytics', 'status'], queryFn: analyticsApi.getOrdersByStatus },
            { queryKey: ['admin', 'recent-orders'], queryFn: () => adminOrdersApi.getAll({ page: 1, pageSize: 5 }) },
            // Fetch all to find low stock (backend could optimize this with a dedicated endpoint later)
            { queryKey: ['admin', 'all-products'], queryFn: () => productsApi.getFiltered({ page: 1, pageSize: 1000 }) },
        ],
    });

    const isLoading = obsLoading || revLoading || statLoading || ordersLoading || prodLoading;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <Skeleton className="lg:col-span-2 h-[350px] rounded-xl" />
                    <Skeleton className="h-[350px] rounded-xl" />
                </div>
            </div>
        );
    }

    if (obsError) {
        return (
            <div className="p-6 text-center border border-danger/20 bg-danger/5 rounded-xl">
                <p className="text-danger">Failed to load dashboard data.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <StatsGrid stats={overview!} />
            </motion.div>

            <motion.div
                className="grid lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className="lg:col-span-2">
                    <RevenueChart data={dailyRevenue || []} />
                </div>
                <div>
                    <OrdersByStatusChart data={statusData || []} />
                </div>
            </motion.div>

            <motion.div
                className="grid lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <div className="lg:col-span-2">
                    <RecentOrders orders={recentOrders?.items || []} />
                </div>
                <div>
                    <LowStockAlerts products={allProducts?.items || []} />
                </div>
            </motion.div>
        </div>
    );
}
