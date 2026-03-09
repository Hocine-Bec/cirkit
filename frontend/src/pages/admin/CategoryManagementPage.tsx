import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoriesApi } from '@/services/api';
import CategoryTable from '@/components/admin/categories/CategoryTable';
import CategoryFormModal from '@/components/admin/categories/CategoryFormModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import type { CategoryResponse, CategoryRequest } from '@/types';

export default function CategoryManagementPage() {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: categoriesApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: categoriesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            toast.success('Category created');
            setIsFormOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to create category'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: CategoryRequest }) => categoriesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            toast.success('Category updated');
            setIsFormOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update category'),
    });

    const deleteMutation = useMutation({
        mutationFn: categoriesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            toast.success('Category deleted');
            setIsDeleteOpen(false);
            setCategoryToDelete(null);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to delete category. Ensure no products are attached.'),
    });

    const handleOpenCreate = () => {
        setEditingCategory(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (category: CategoryResponse) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (data: CategoryRequest) => {
        if (editingCategory) {
            await updateMutation.mutateAsync({ id: editingCategory.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const handleToggleActive = async (category: CategoryResponse, isActive: boolean) => {
        const data: CategoryRequest = {
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.imageUrl,
            displayOrder: category.displayOrder,
            isActive,
        };
        try {
            await categoriesApi.update(category.id, data);
            queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
            toast.success(`Category ${isActive ? 'activated' : 'deactivated'}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            await deleteMutation.mutateAsync(categoryToDelete.id);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl text-danger text-center">
                Failed to load categories.
            </div>
        );
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-text-secondary">
                    Manage product categories and their display order.
                </p>
                <Button variant="primary" onClick={handleOpenCreate} className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Add Category
                </Button>
            </div>

            <CategoryTable
                categories={categories || []}
                onEdit={handleOpenEdit}
                onDelete={(c) => {
                    setCategoryToDelete(c);
                    setIsDeleteOpen(true);
                }}
                onToggleActive={handleToggleActive}
            />

            <CategoryFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                category={editingCategory}
                onSubmit={handleFormSubmit}
                isSubmitting={isSaving}
            />

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Category"
                description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will fail if products are currently assigned to this category.`}
                isLoading={deleteMutation.isPending}
                variant="danger"
                confirmText="Delete Category"
            />
        </div>
    );
}
