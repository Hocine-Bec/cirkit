import { Pencil, Trash2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Toggle from '@/components/ui/Toggle';
import type { CategoryResponse } from '@/types';

interface CategoryTableProps {
    categories: CategoryResponse[];
    onEdit: (category: CategoryResponse) => void;
    onDelete: (category: CategoryResponse) => void;
    onToggleActive: (category: CategoryResponse, isActive: boolean) => void;
}

export default function CategoryTable({
    categories,
    onEdit,
    onDelete,
    onToggleActive,
}: CategoryTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-bg-secondary/60">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium">Image</th>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Slug</th>
                        <th className="px-6 py-4 font-medium">Products</th>
                        <th className="px-6 py-4 font-medium">Order</th>
                        <th className="px-6 py-4 font-medium text-center">Active</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-text-muted">
                                No categories found.
                            </td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr key={category.id} className="hover:bg-bg-hover transition-colors bg-bg-primary/40">
                                <td className="px-6 py-4">
                                    {category.imageUrl ? (
                                        <img
                                            src={category.imageUrl}
                                            alt={category.name}
                                            className="w-10 h-10 rounded-md object-cover border border-border"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-md bg-bg-tertiary border border-border flex items-center justify-center text-xs text-text-muted">
                                            No Img
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium text-text-primary">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 font-mono text-text-secondary">
                                    {category.slug}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="info">
                                        {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-text-secondary">
                                    {category.displayOrder}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Toggle
                                        size="sm"
                                        checked={category.isActive}
                                        onChange={(checked) => onToggleActive(category, checked)}
                                    />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(category)}
                                            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                                            title="Edit Category"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(category)}
                                            className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
