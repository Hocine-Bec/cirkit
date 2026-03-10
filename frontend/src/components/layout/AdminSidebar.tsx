import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Star, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
];

export default function AdminSidebar() {
    const { adminLogout } = useAdminAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-bg-secondary border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-bg-secondary border-r border-border z-40 transition-transform duration-300 w-64 flex flex-col',
                    'lg:translate-x-0',
                    isCollapsed ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-text-primary">
                        <span className="gradient-text">CirKit</span>
                        <span className="text-text-muted text-sm ml-2">Admin</span>
                    </h1>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={() => setIsCollapsed(false)}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-accent/10 text-accent border border-accent/20'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-border">
                    <button
                        onClick={adminLogout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors w-full cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isCollapsed && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50"
                    onClick={() => setIsCollapsed(false)}
                />
            )}
        </>
    );
}
