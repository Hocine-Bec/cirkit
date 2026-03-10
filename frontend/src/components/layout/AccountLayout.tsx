import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { Package, MapPin, UserCircle, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import Container from '@/components/ui/Container';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const accountLinks = [
    { to: '/account/orders', icon: Package, label: 'Orders' },
    { to: '/account/addresses', icon: MapPin, label: 'Addresses' },
    { to: '/account/profile', icon: UserCircle, label: 'Profile' },
];

export default function AccountLayout() {
    const { customer, isCustomerAuthenticated, isLoading, customerLogout } = useCustomerAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isCustomerAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
                <Container className="py-8">
                    {/* Header section */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">My Account</h1>
                            <p className="text-text-secondary mt-1">
                                Welcome back, {customer?.firstName}
                            </p>
                        </div>
                        <button
                            onClick={customerLogout}
                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-danger hover:bg-danger/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-fit"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Side nav */}
                        <nav className="md:w-56 shrink-0">
                            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                                {accountLinks.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        className={({ isActive }) =>
                                            cn(
                                                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                                                isActive
                                                    ? 'bg-accent/10 text-accent border border-accent/20'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                                            )
                                        }
                                    >
                                        <link.icon className="w-5 h-5" />
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </nav>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <Outlet />
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
            <CartDrawer />
        </div>
    );
}
