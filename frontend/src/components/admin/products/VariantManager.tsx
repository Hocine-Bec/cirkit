import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsApi } from '@/services/api';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import type { ProductResponse, ProductVariantRequest } from '@/types';

// Omitted ConfirmDialog import for simplicity, we'll implement inline confirm or use window.confirm for sub-modals

const variantSchema = z.object({
    name: z.string().min(1, 'Name required'),
    sku: z.string().min(1, 'SKU required'),
    priceModifier: z.number(),
    stockQuantity: z.number().int().min(0, 'Positive stock'),
    isActive: z.boolean(),
});
type VariantFormData = z.infer<typeof variantSchema>;

interface VariantManagerProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductResponse | null;
}

export default function VariantManager({ isOpen, onClose, product }: VariantManagerProps) {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<VariantFormData>({
        resolver: zodResolver(variantSchema),
        defaultValues: { name: '', sku: '', priceModifier: 0, stockQuantity: 0, isActive: true },
    });

    const isActive = watch('isActive');

    // We refetch the single product to ensure variants are up to date
    const { data: currentProduct, isLoading } = useQuery({
        queryKey: ['admin', 'product', product?.id],
        queryFn: () => productsApi.getBySlug(product!.slug),
        enabled: !!product && isOpen,
    });

    const addVariantMutation = useMutation({
        mutationFn: (data: ProductVariantRequest) => productsApi.addVariant(product!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', product?.id] });
            toast.success('Variant added');
            setIsFormOpen(false);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to add variant'),
    });

    const updateVariantMutation = useMutation({
        mutationFn: ({ variantId, data }: { variantId: string, data: ProductVariantRequest }) =>
            productsApi.updateVariant(product!.id, variantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', product?.id] });
            toast.success('Variant updated');
            setIsFormOpen(false);
        },
        onError: () => toast.error('Failed to update variant'),
    });

    const deleteVariantMutation = useMutation({
        mutationFn: (variantId: string) => productsApi.deleteVariant(product!.id, variantId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', product?.id] });
            toast.success('Variant deleted');
        },
        onError: () => toast.error('Failed to delete variant'),
    });

    const handleOpenForm = (variant?: any) => {
        if (variant) {
            setEditingId(variant.id);
            reset({
                name: variant.name,
                sku: variant.sku,
                priceModifier: variant.priceModifier,
                stockQuantity: variant.stockQuantity,
                isActive: variant.isActive,
            });
        } else {
            setEditingId(null);
            reset({
                name: '', sku: `${product?.sku}-V1`, priceModifier: 0, stockQuantity: 0, isActive: true
            });
        }
        setIsFormOpen(true);
    };

    const onSubmitForm = async (data: VariantFormData) => {
        if (editingId) {
            await updateVariantMutation.mutateAsync({ variantId: editingId, data });
        } else {
            await addVariantMutation.mutateAsync(data);
        }
    };

    const isSaving = addVariantMutation.isPending || updateVariantMutation.isPending;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Variants: ${product?.name}`}>
            <div className="space-y-6">
                {/* List */}
                {!isFormOpen && (
                    <>
                        <div className="flex justify-end">
                            <Button size="sm" onClick={() => handleOpenForm()} className="gap-2">
                                <Plus className="w-4 h-4" /> Add Variant
                            </Button>
                        </div>

                        {isLoading ? (
                            <p className="text-text-muted text-center py-4">Loading variants...</p>
                        ) : !currentProduct?.variants || currentProduct.variants.length === 0 ? (
                            <div className="text-center py-8 border border-border border-dashed rounded-xl bg-bg-secondary/30">
                                <p className="text-text-muted">No variants yet. Products act as standalone items if they have no variants.</p>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-border overflow-hidden bg-bg-secondary/60">
                                <ul className="divide-y divide-border">
                                    {currentProduct.variants.map((v: any) => (
                                        <li key={v.id} className="p-4 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-text-primary">{v.name}</span>
                                                    {!v.isActive && <Badge variant="default">Inactive</Badge>}
                                                </div>
                                                <p className="text-xs text-text-muted font-mono mt-0.5">
                                                    {v.sku} • {['+', '-'][Math.sign(v.priceModifier) > 0 ? 0 : 1] || ''}${Math.abs(v.priceModifier).toFixed(2)} • Stock: {v.stockQuantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleOpenForm(v)} className="p-1.5 hover:bg-bg-hover text-text-muted hover:text-text-primary rounded-md transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Delete variant ${v.name}?`)) {
                                                            deleteVariantMutation.mutate(v.id);
                                                        }
                                                    }}
                                                    className="p-1.5 hover:bg-danger/10 text-text-muted hover:text-danger rounded-md transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {/* Form */}
                {isFormOpen && (
                    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 rounded-xl border border-border p-4 bg-bg-secondary/30">
                        <h3 className="font-medium text-text-primary border-b border-border pb-2 mb-4">
                            {editingId ? 'Edit Variant' : 'New Variant'}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input label="Variant Name" placeholder="e.g. Red / Cherry MX" error={errors.name?.message} {...register('name')} />
                            <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input label="Price Modifier ($)" type="number" step="0.01" error={errors.priceModifier?.message} {...register('priceModifier', { valueAsNumber: true })} />
                            <Input label="Stock" type="number" min={0} error={errors.stockQuantity?.message} {...register('stockQuantity', { valueAsNumber: true })} />
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer pt-2">
                            <Toggle size="sm" checked={isActive} onChange={(c) => setValue('isActive', c, { shouldValidate: true })} />
                            <span className="text-sm">Active</span>
                        </label>
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={isSaving}>{editingId ? 'Save' : 'Add'}</Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
