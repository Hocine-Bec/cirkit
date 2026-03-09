import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { ProductResponse } from '@/types';

export default function LowStockAlerts({ products }: { products: ProductResponse[] }) {
    // Client-side filter for < 10 stock
    const lowStockProducts = products
        .filter(p => p.stockQuantity < 10 && p.isActive)
        .sort((a, b) => a.stockQuantity - b.stockQuantity)
        .slice(0, 6);

    return (
        <div className="flex flex-col h-full rounded-xl bg-bg-secondary/60 border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <h2 className="text-lg font-semibold text-text-primary">Low Stock Alerts</h2>
                </div>
            </div>

            <div className="flex-1 p-2">
                {lowStockProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <p className="text-text-primary font-medium">All products well stocked</p>
                        <p className="text-sm text-text-muted mt-1">No active items have under 10 units.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {lowStockProducts.map(product => (
                            <li key={product.id} className="p-4 flex items-center justify-between hover:bg-bg-hover transition-colors rounded-lg">
                                <div className="min-w-0 pr-4">
                                    <p className="text-sm font-medium text-text-primary truncate" title={product.name}>
                                        {product.name}
                                    </p>
                                    <p className="text-xs text-text-muted font-mono mt-1">
                                        SKU: {product.sku}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className={`text-sm font-mono font-bold ${product.stockQuantity === 0 ? 'text-danger' : 'text-warning'}`}>
                                        {product.stockQuantity} {product.stockQuantity === 1 ? 'unit' : 'units'}
                                    </div>
                                    <Link
                                        to={`/admin/products?search=${product.sku}`}
                                        className="text-xs font-medium text-accent hover:text-accent-glow hover:underline"
                                    >
                                        Restock
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
