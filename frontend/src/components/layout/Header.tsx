import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import Container from '@/components/ui/Container';
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const cart = useContext(CartContext);
    const { isCustomerAuthenticated } = useCustomerAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
            <Container>
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold tracking-tight">
                        <span className="gradient-text">CirKit</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    cn(
                                        'text-sm font-medium transition-colors duration-200',
                                        isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                                    )
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        {/* Account */}
                        <Link
                            to={isCustomerAuthenticated ? '/account/orders' : '/account/login'}
                            className="text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={() => cart?.openCart()}
                            className="relative text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cart && cart.cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-bg-secondary border-b border-border overflow-hidden"
                    >
                        <Container>
                            <nav className="py-4 flex flex-col gap-3">
                                {navLinks.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            cn(
                                                'text-sm font-medium py-2 transition-colors',
                                                isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                                            )
                                        }
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
