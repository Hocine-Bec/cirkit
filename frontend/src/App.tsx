import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import AccountLayout from '@/components/layout/AccountLayout';

// Public pages
import HomePage from '@/pages/public/HomePage';
import ProductsPage from '@/pages/public/ProductsPage';
import ProductDetailPage from '@/pages/public/ProductDetailPage';
import CartPage from '@/pages/public/CartPage';
import CheckoutPage from '@/pages/public/CheckoutPage';
import OrderConfirmationPage from '@/pages/public/OrderConfirmationPage';
import CategoryPage from '@/pages/public/CategoryPage';

// Account pages
import LoginPage from '@/pages/account/LoginPage';
import RegisterPage from '@/pages/account/RegisterPage';
import OrdersPage from '@/pages/account/OrdersPage';
import OrderDetailPage from '@/pages/account/OrderDetailPage';
import AddressesPage from '@/pages/account/AddressesPage';
import ProfilePage from '@/pages/account/ProfilePage';

// Admin pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import ProductManagementPage from '@/pages/admin/ProductManagementPage';
import CategoryManagementPage from '@/pages/admin/CategoryManagementPage';
import OrderManagementPage from '@/pages/admin/OrderManagementPage';
import CustomerManagementPage from '@/pages/admin/CustomerManagementPage';
import ReviewManagementPage from '@/pages/admin/ReviewManagementPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="products/:slug" element={<ProductDetailPage />} />
                    <Route path="category/:slug" element={<CategoryPage />} />
                    <Route path="cart" element={<CartPage />} />
                </Route>

                {/* Checkout — no header/footer for focused UX */}
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />

                {/* Customer Auth */}
                <Route path="account/login" element={<LoginPage />} />
                <Route path="account/register" element={<RegisterPage />} />

                {/* Customer Account (protected) */}
                <Route path="account" element={<AccountLayout />}>
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="orders/:id" element={<OrderDetailPage />} />
                    <Route path="addresses" element={<AddressesPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Auth */}
                <Route path="admin/login" element={<AdminLoginPage />} />

                {/* Admin Panel (protected) */}
                <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="products" element={<ProductManagementPage />} />
                    <Route path="categories" element={<CategoryManagementPage />} />
                    <Route path="orders" element={<OrderManagementPage />} />
                    <Route path="customers" element={<CustomerManagementPage />} />
                    <Route path="reviews" element={<ReviewManagementPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
