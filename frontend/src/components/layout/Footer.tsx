import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
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

const SOCIAL = [
  { icon: Github,    href: '#', label: 'GitHub'    },
  { icon: Twitter,   href: '#', label: 'Twitter'   },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

const COLUMNS = [
  { heading: 'Shop',    links: footerLinks.shop    },
  { heading: 'Account', links: footerLinks.account },
  { heading: 'Support', links: footerLinks.support },
  { heading: 'Company', links: footerLinks.company },
];

export default function Footer() {
  return (
    <footer className="bg-bg-secondary">
      {/* Accent top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <Container>
        {/* Main grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="text-2xl font-bold gradient-text leading-none">
              CirKit
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              Premium electronics for tech enthusiasts. Genuine products, fast delivery, unbeatable prices.
            </p>
            <div className="flex items-center gap-4 mt-1">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-text-muted hover:text-accent transition-colors duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ heading, links }) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4 font-mono">
                {heading}
              </h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} CirKit. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-text-muted font-mono tracking-wide">
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
