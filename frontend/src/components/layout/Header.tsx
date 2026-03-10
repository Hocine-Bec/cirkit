import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import Container from '@/components/ui/Container';
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

const navLinks = [
  { to: '/',         label: 'Home'       },
  { to: '/products', label: 'Products'   },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useContext(CartContext);
  const { isCustomerAuthenticated } = useCustomerAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-all duration-300',
        scrolled
          ? 'bg-bg-primary/96 border-border/80 shadow-lg shadow-black/25'
          : 'bg-bg-primary/60 border-border/30'
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight flex-shrink-0">
            <span className="gradient-text">CirKit</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative text-sm font-medium transition-colors duration-200 group py-1',
                    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={cn(
                        'absolute bottom-0 left-0 h-px bg-accent transition-all duration-300',
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Desktop CTA */}
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-white bg-accent hover:bg-accent/90 px-4 py-2 rounded-xl transition-all duration-200 glow-blue-hover"
            >
              Shop Now <ArrowRight size={14} />
            </Link>

            {/* Account */}
            <Link
              to={isCustomerAuthenticated ? '/account/orders' : '/account/login'}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => cart?.openCart()}
              className="relative text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Cart"
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
              aria-label="Menu"
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
              <nav className="py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'text-sm font-medium py-2.5 px-3 rounded-lg transition-colors',
                        isActive
                          ? 'text-accent bg-accent/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Shop Now <ArrowRight size={14} />
                </Link>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
