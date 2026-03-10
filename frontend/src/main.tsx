import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from 'lenis';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext';
import { CartProvider } from '@/contexts/CartContext';
import App from './App';
import './index.css';

function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
        return () => {
            lenis.destroy();
            cancelAnimationFrame(rafId);
        };
    }, []);
    return <>{children}</>;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <SmoothScroll>
                <AdminAuthProvider>
                    <CustomerAuthProvider>
                        <CartProvider>
                            <App />
                            <Toaster
                                position="bottom-right"
                                toastOptions={{
                                    style: {
                                        background: '#1A1A1A',
                                        color: '#F5F5F5',
                                        border: '1px solid #262626',
                                    },
                                }}
                            />
                        </CartProvider>
                    </CustomerAuthProvider>
                </AdminAuthProvider>
            </SmoothScroll>
        </QueryClientProvider>
    </React.StrictMode>
);
