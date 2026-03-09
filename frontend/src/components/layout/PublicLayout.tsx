import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
        </div>
    );
}
