import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/services/api';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import Modal from '@/components/ui/Modal';
import type { ProductResponse } from '@/types';

const productSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    name: z.string().min(1, 'Name is required').max(200),
    slug: z.string().min(1, 'Slug is required').max(200),
    sku: z.string().min(1, 'SKU is required').max(50),
    brand: z.string().max(100).optional(),
    shortDescription: z.string().max(500).optional(),
    description: z.string().optional(),
    basePrice: z.number().min(0, 'Price must be non-negative'),
    stockQuantity: z.number().int().min(0, 'Stock cannot be negative'),
    specifications: z.string().optional(),
    imageUrl: z.string().optional(),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductResponse | null;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isSubmitting: boolean;
}

export default function ProductFormModal({
    isOpen,
    onClose,
    product,
    onSubmit,
    isSubmitting,
}: ProductFormModalProps) {
    const { data: categories } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: categoriesApi.getAll,
    });

    const categoryOptions = categories?.map(c => ({
        value: c.id,
        label: c.name,
    })) || [];

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            categoryId: '',
            name: '',
            slug: '',
            sku: '',
            brand: '',
            shortDescription: '',
            description: '',
            basePrice: 0,
            stockQuantity: 0,
            specifications: '{}',
            isActive: true,
            isFeatured: false,
        },
    });

    const isActive = watch('isActive');
    const isFeatured = watch('isFeatured');
    const name = watch('name');

    // Auto-generate slug from name if creating
    useEffect(() => {
        if (!product && name) {
            const gSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setValue('slug', gSlug, { shouldValidate: true });
        }
    }, [name, product, setValue]);

    useEffect(() => {
        if (product) {
            reset({
                categoryId: product.categoryId,
                name: product.name,
                slug: product.slug,
                sku: product.sku,
                brand: product.brand || '',
                shortDescription: product.shortDescription || '',
                description: product.description || '',
                basePrice: product.basePrice,
                stockQuantity: product.stockQuantity,
                specifications: product.specifications || '{}',
                isActive: product.isActive,
                isFeatured: product.isFeatured,
            });
        } else {
            reset({
                categoryId: categoryOptions[0]?.value || '',
                name: '',
                slug: '',
                sku: '',
                brand: '',
                shortDescription: '',
                description: '',
                basePrice: 0,
                stockQuantity: 0,
                specifications: '{\n  "key": "value"\n}',
                isActive: true,
                isFeatured: false,
            });
        }
    }, [product, isOpen, reset, categoryOptions.length]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? 'Edit ProductDetails' : 'Create Product'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <Select
                    label="Category"
                    options={categoryOptions}
                    placeholder="Select Category"
                    error={errors.categoryId?.message}
                    {...register('categoryId')}
                />

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Product Name"
                        placeholder="e.g. Mechanical Keyboard"
                        error={errors.name?.message}
                        {...register('name')}
                    />
                    <Input
                        label="URL Slug"
                        placeholder="e.g. mech-keyboard"
                        error={errors.slug?.message}
                        {...register('slug')}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="SKU"
                        placeholder="KB-001"
                        error={errors.sku?.message}
                        {...register('sku')}
                    />
                    <Input
                        label="Brand"
                        placeholder="CirKit"
                        error={errors.brand?.message}
                        {...register('brand')}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Base Price ($)"
                        type="number"
                        min={0}
                        step="0.01"
                        error={errors.basePrice?.message}
                        {...register('basePrice', { valueAsNumber: true })}
                    />
                    <Input
                        label="Stock Quantity"
                        type="number"
                        min={0}
                        error={errors.stockQuantity?.message}
                        {...register('stockQuantity', { valueAsNumber: true })}
                    />
                </div>

                <Textarea
                    label="Short Description"
                    placeholder="Brief summary for listings..."
                    rows={2}
                    error={errors.shortDescription?.message}
                    {...register('shortDescription')}
                />

                <Textarea
                    label="Full Description"
                    placeholder="Detailed markdown description..."
                    rows={5}
                    error={errors.description?.message}
                    {...register('description')}
                />

                <Textarea
                    label="Specifications (JSON)"
                    placeholder='{"Switch": "Cherry MX Red", "Layout": "Tenkeyless"}'
                    rows={4}
                    className="font-mono text-xs"
                    error={errors.specifications?.message}
                    {...register('specifications')}
                />

                <div className="flex gap-8 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <Toggle
                            size="sm"
                            checked={isActive}
                            onChange={(checked) => setValue('isActive', checked, { shouldValidate: true })}
                        />
                        <span className="text-sm font-medium text-text-primary">Active</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <Toggle
                            size="sm"
                            checked={isFeatured}
                            onChange={(checked) => setValue('isFeatured', checked, { shouldValidate: true })}
                        />
                        <span className="text-sm font-medium text-text-primary">Featured</span>
                    </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6 sticky bottom-0 bg-bg-secondary pb-2">
                    <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" isLoading={isSubmitting}>
                        {product ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
