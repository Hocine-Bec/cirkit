import { Pencil, Trash2, Layers, Image as ImageIcon } from 'lucide-react';
import Toggle from '@/components/ui/Toggle';
import type { ProductResponse } from '@/types';

interface ProductTableProps {
    products: ProductResponse[];
    onEdit: (product: ProductResponse) => void;
    onDelete: (product: ProductResponse) => void;
    onManageVariants: (product: ProductResponse) => void;
    onManageImages: (product: ProductResponse) => void;
    onToggleActive: (product: ProductResponse, isActive: boolean) => void;
    onToggleFeatured: (product: ProductResponse, isFeatured: boolean) => void;
}

export default function ProductTable({
    products,
    onEdit,
    onDelete,
    onManageVariants,
    onManageImages,
    onToggleActive,
    onToggleFeatured,
}: ProductTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-bg-secondary/60">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">SKU</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium">Stock</th>
                        <th className="px-6 py-4 font-medium text-center">Active</th>
                        <th className="px-6 py-4 font-medium text-center">Featured</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                No products found.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="hover:bg-bg-hover transition-colors bg-bg-primary/40">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-md object-cover border border-border bg-bg-tertiary"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-bg-tertiary border border-border flex items-center justify-center text-xs text-text-muted">
                                                No Img
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-text-primary max-w-[200px] truncate" title={product.name}>
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-text-muted mt-0.5">{product.categoryName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-text-secondary">
                                    {product.sku}
                                </td>
                                <td className="px-6 py-4 font-mono font-medium text-text-primary">
                                    ${product.basePrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`font-mono font-bold ${product.stockQuantity === 0 ? 'text-danger' :
                                            product.stockQuantity < 10 ? 'text-warning' : 'text-success'
                                        }`}>
                                        {product.stockQuantity}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Toggle
                                        size="sm"
                                        checked={product.isActive}
                                        onChange={(checked) => onToggleActive(product, checked)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Toggle
                                        size="sm"
                                        checked={product.isFeatured}
                                        onChange={(checked) => onToggleFeatured(product, checked)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            onClick={() => onManageImages(product)}
                                            className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                                            title="Manage Images"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onManageVariants(product)}
                                            className="p-1.5 rounded-md text-text-muted hover:text-accent-secondary hover:bg-accent-secondary/10 transition-colors cursor-pointer"
                                            title="Manage Variants"
                                        >
                                            <Layers className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-4 bg-border mx-1" />
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                                            title="Edit Product Details"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(product)}
                                            className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="sr-only">Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
