import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '@/services/api';
import ProductTable from '@/components/admin/products/ProductTable';
import ProductFormModal from '@/components/admin/products/ProductFormModal';
import VariantManager from '@/components/admin/products/VariantManager';
import ImageManager from '@/components/admin/products/ImageManager';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import type { ProductResponse, ProductRequest } from '@/types';

export default function ProductManagementPage() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);

    const [managingVariantsFor, setManagingVariantsFor] = useState<ProductResponse | null>(null);
    const [managingImagesFor, setManagingImagesFor] = useState<ProductResponse | null>(null);

    const { data: productsData, isLoading, error } = useQuery({
        queryKey: ['admin', 'products'],
        queryFn: () => productsApi.getFiltered({ page: 1, pageSize: 100 }), // Simplified for now without pagination state
    });

    const createMutation = useMutation({
        mutationFn: productsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            toast.success('Product created');
            setIsFormOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to create product'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProductRequest }) => productsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', editingProduct?.id] });
            toast.success('Product updated');
            setIsFormOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update product'),
    });

    const deleteMutation = useMutation({
        mutationFn: productsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            toast.success('Product deleted');
            setIsDeleteOpen(false);
            setProductToDelete(null);
        },
        onError: () => toast.error('Failed to delete product. It may be part of an order.'),
    });

    const handleOpenCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData: any) => {
        const data: ProductRequest = {
            ...formData,
            brand: formData.brand || '',
            shortDescription: formData.shortDescription || '',
            description: formData.description || '',
            specifications: formData.specifications || '{}',
            imageUrl: editingProduct?.imageUrl || ''
        };
        if (editingProduct) {
            await updateMutation.mutateAsync({ id: editingProduct.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const handleToggleActive = async (product: ProductResponse, isActive: boolean) => {
        const data: ProductRequest = {
            categoryId: product.categoryId,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            basePrice: product.basePrice,
            stockQuantity: product.stockQuantity,
            isActive,
            isFeatured: product.isFeatured,
            brand: product.brand,
            shortDescription: product.shortDescription,
            description: product.description,
            specifications: product.specifications,
            imageUrl: product.imageUrl,
        };
        try {
            await productsApi.update(product.id, data);
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            toast.success(`Product ${isActive ? 'activated' : 'deactivated'}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleToggleFeatured = async (product: ProductResponse, isFeatured: boolean) => {
        const data: ProductRequest = {
            ...product,
            isFeatured,
        };
        try {
            await productsApi.update(product.id, data);
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
            toast.success(`Product ${isFeatured ? 'featured' : 'unfeatured'}`);
        } catch {
            toast.error('Failed to update featured status');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl text-danger text-center">
                Failed to load products.
            </div>
        );
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-text-secondary">
                    Manage your catalogue, inventory, pricing, and variants.
                </p>
                <Button variant="primary" onClick={handleOpenCreate} className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <ProductTable
                products={productsData?.items || []}
                onEdit={(p) => { setEditingProduct(p); setIsFormOpen(true); }}
                onDelete={(p) => { setProductToDelete(p); setIsDeleteOpen(true); }}
                onManageVariants={(p) => setManagingVariantsFor(p)}
                onManageImages={(p) => setManagingImagesFor(p)}
                onToggleActive={handleToggleActive}
                onToggleFeatured={handleToggleFeatured}
            />

            {/* Main product creation/edit form */}
            <ProductFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                product={editingProduct}
                onSubmit={handleFormSubmit}
                isSubmitting={isSaving}
            />

            {/* Sub-modals for nested entities */}
            <VariantManager
                isOpen={!!managingVariantsFor}
                onClose={() => setManagingVariantsFor(null)}
                product={managingVariantsFor}
            />

            <ImageManager
                isOpen={!!managingImagesFor}
                onClose={() => setManagingImagesFor(null)}
                product={managingImagesFor}
            />

            {/* Deletion protection */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={async () => {
                    if (productToDelete) await deleteMutation.mutateAsync(productToDelete.id);
                }}
                title="Delete Product"
                description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                isLoading={deleteMutation.isPending}
                variant="danger"
                confirmText="Delete Product"
            />
        </div>
    );
}
