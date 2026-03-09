import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from './AdminSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';

const routeTitles: Record<string, string> = {
    '/admin': 'Dashboard Overview',
    '/admin/products': 'Product Management',
    '/admin/categories': 'Category Management',
    '/admin/orders': 'Order Management',
    '/admin/customers': 'Customer Directory',
    '/admin/reviews': 'Review Moderation',
};

export default function AdminLayout() {
    const { adminUser, isAdminAuthenticated, isLoading, adminLogout } = useAdminAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const pageTitle = routeTitles[location.pathname] || 'Admin Panel';

    return (
        <div className="min-h-screen bg-bg-primary">
            <AdminSidebar />
            <main className="lg:ml-64 min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-16 border-b border-border bg-bg-secondary/60 backdrop-blur sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8">
                    <h1 className="text-lg font-semibold text-text-primary hidden sm:block">
                        {pageTitle}
                    </h1>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-text-primary font-medium">{adminUser?.fullName}</span>
                            <Badge variant="info" className="hidden sm:inline-flex">Admin</Badge>
                        </div>
                        <div className="h-6 w-px bg-border" />
                        <button
                            onClick={adminLogout}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-danger transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 lg:p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
