import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import Modal from '@/components/ui/Modal';
import type { CategoryResponse } from '@/types';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    slug: z.string().min(1, 'Slug is required').max(100),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url('Must be a valid URL').max(500).optional().or(z.literal('')),
    displayOrder: z.number().int().min(0, 'Must be 0 or greater'),
    isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: CategoryResponse | null;
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
}

export default function CategoryFormModal({
    isOpen,
    onClose,
    category,
    onSubmit,
    isSubmitting
}: CategoryFormModalProps) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            imageUrl: '',
            displayOrder: 0,
            isActive: true,
        },
    });

    const isActive = watch('isActive');
    const name = watch('name');

    // Auto-generate slug from name if not editing
    useEffect(() => {
        if (!category && name) {
            const gSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setValue('slug', gSlug, { shouldValidate: true });
        }
    }, [name, category, setValue]);

    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                imageUrl: category.imageUrl || '',
                displayOrder: category.displayOrder,
                isActive: category.isActive,
            });
        } else {
            reset({
                name: '',
                slug: '',
                description: '',
                imageUrl: '',
                displayOrder: 0,
                isActive: true,
            });
        }
    }, [category, isOpen, reset]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={category ? 'Edit Category' : 'Create Category'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Category Name"
                        placeholder="e.g. Laptops"
                        error={errors.name?.message}
                        {...register('name')}
                    />
                    <Input
                        label="URL Slug"
                        placeholder="e.g. laptops"
                        error={errors.slug?.message}
                        {...register('slug')}
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Brief description of the category..."
                    rows={3}
                    error={errors.description?.message}
                    {...register('description')}
                />

                <Input
                    label="Image URL"
                    placeholder="https://..."
                    error={errors.imageUrl?.message}
                    {...register('imageUrl')}
                />

                <div className="grid md:grid-cols-2 gap-4 items-center">
                    <Input
                        label="Display Order"
                        type="number"
                        min={0}
                        error={errors.displayOrder?.message}
                        {...register('displayOrder', { valueAsNumber: true })}
                    />

                    <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-sm font-medium text-text-secondary">Status</span>
                        <div className="flex items-center gap-3 h-10">
                            <Toggle
                                checked={isActive}
                                onChange={(checked) => setValue('isActive', checked, { shouldValidate: true })}
                            />
                            <span className="text-sm text-text-primary">
                                {isActive ? 'Active (Visible)' : 'Inactive (Hidden)'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" isLoading={isSubmitting}>
                        {category ? 'Update Category' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
