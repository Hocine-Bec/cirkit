import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';

const footerLinks = {
    shop: [
        { to: '/products', label: 'All Products' },
        { to: '/category/smartphones', label: 'Smartphones' },
        { to: '/category/laptops', label: 'Laptops' },
        { to: '/category/audio', label: 'Audio' },
        { to: '/category/wearables', label: 'Wearables' },
    ],
    account: [
        { to: '/account/login', label: 'Sign In' },
        { to: '/account/register', label: 'Register' },
        { to: '/account/orders', label: 'My Orders' },
        { to: '/account/addresses', label: 'Addresses' },
    ],
    support: [
        { to: '#', label: 'Help Center' },
        { to: '#', label: 'Shipping Info' },
        { to: '#', label: 'Returns' },
        { to: '#', label: 'Contact Us' },
    ],
    company: [
        { to: '#', label: 'About Us' },
        { to: '#', label: 'Careers' },
        { to: '#', label: 'Privacy Policy' },
        { to: '#', label: 'Terms of Service' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-bg-secondary border-t border-border">
            <Container>
                <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Shop</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.shop.map(link => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Account</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.account.map(link => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Support</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map(link => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-4">Company</h3>
                        <ul className="space-y-2.5">
                            {footerLinks.company.map(link => (
                                <li key={link.label}>
                                    <Link to={link.to} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-text-muted">
                        © 2025 CirKit. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>Amex</span>
                        <span className="text-accent">Stripe</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
