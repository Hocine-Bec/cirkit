import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { CartContext } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';

export default function CartDrawer() {
    const cart = useContext(CartContext);
    if (!cart) return null;

    const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, cartSubtotal, cartCount } = cart;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bg-secondary border-l border-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-semibold text-text-primary">
                                Your Cart ({cartCount})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        {items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                                <ShoppingBag className="w-16 h-16 text-text-muted" />
                                <p className="text-text-secondary">Your cart is empty</p>
                                <Link to="/products" onClick={closeCart}>
                                    <Button variant="primary" size="sm">Browse Products</Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {items.map(item => (
                                        <div key={`${item.productId}-${item.variantId || ''}`} className="flex gap-4 p-3 rounded-lg bg-bg-tertiary">
                                            {/* Thumbnail */}
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/products/${item.slug}`}
                                                    onClick={closeCart}
                                                    className="text-sm font-medium text-text-primary hover:text-accent transition-colors truncate block"
                                                >
                                                    {item.name}
                                                </Link>
                                                {item.variantName && (
                                                    <p className="text-xs text-text-muted mt-0.5">{item.variantName}</p>
                                                )}
                                                <p className="text-sm font-semibold text-accent mt-1">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                                {/* Quantity controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                                                        className="w-6 h-6 rounded bg-bg-hover flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm text-text-primary w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                                        disabled={item.quantity >= item.maxStock}
                                                        className="w-6 h-6 rounded bg-bg-hover flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.productId, item.variantId)}
                                                        className="ml-auto text-text-muted hover:text-danger transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-border space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-text-secondary">Subtotal</span>
                                        <span className="text-lg font-semibold text-text-primary">
                                            ${cartSubtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <Link to="/checkout" onClick={closeCart} className="block">
                                        <Button variant="primary" size="lg" className="w-full glow-blue">
                                            Checkout
                                        </Button>
                                    </Link>
                                    <Link
                                        to="/cart"
                                        onClick={closeCart}
                                        className="block text-center text-sm text-text-secondary hover:text-text-primary transition-colors"
                                    >
                                        View Full Cart
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
