import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem } from '@/types';

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartSubtotal: number;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'cirkit_cart';

function getStoredCart(): CartItem[] {
    try {
        const stored = localStorage.getItem(CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(getStoredCart);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((item: CartItem) => {
        setItems(prev => {
            const existing = prev.find(
                i => i.productId === item.productId && i.variantId === item.variantId
            );
            if (existing) {
                return prev.map(i =>
                    i.productId === item.productId && i.variantId === item.variantId
                        ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                        : i
                );
            }
            return [...prev, item];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((productId: string, variantId?: string) => {
        setItems(prev => prev.filter(
            i => !(i.productId === productId && i.variantId === variantId)
        ));
    }, []);

    const updateQuantity = useCallback((productId: string, variantId: string | undefined, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(
                i => !(i.productId === productId && i.variantId === variantId)
            ));
            return;
        }
        setItems(prev => prev.map(i =>
            i.productId === productId && i.variantId === variantId
                ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                : i
        ));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartSubtotal,
                isCartOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
