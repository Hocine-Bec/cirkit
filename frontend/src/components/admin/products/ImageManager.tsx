import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Star } from 'lucide-react';
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
import type { ProductResponse, ProductImageRequest } from '@/types';

const imageSchema = z.object({
    imageUrl: z.string().url('Must be a valid URL').max(500),
    altText: z.string().max(200).optional(),
    displayOrder: z.number().int().min(0, 'Must be 0 or greater'),
    isMain: z.boolean(),
});
type ImageFormData = z.infer<typeof imageSchema>;

interface ImageManagerProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductResponse | null;
}

export default function ImageManager({ isOpen, onClose, product }: ImageManagerProps) {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ImageFormData>({
        resolver: zodResolver(imageSchema),
        defaultValues: { imageUrl: '', altText: '', displayOrder: 0, isMain: false },
    });

    const isMain = watch('isMain');
    const imageUrlPreview = watch('imageUrl');

    // Refetch product to get latest images
    const { data: currentProduct, isLoading } = useQuery({
        queryKey: ['admin', 'product', product?.id],
        queryFn: () => productsApi.getBySlug(product!.slug),
        enabled: !!product && isOpen,
    });

    const addImageMutation = useMutation({
        mutationFn: (data: ProductImageRequest) => productsApi.addImage(product!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', product?.id] });
            toast.success('Image added');
            setIsFormOpen(false);
            reset();
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to add image'),
    });

    const setMainImageMutation = useMutation({
        mutationFn: (img: any) => productsApi.updateImage(product!.id, img.id, {
            imageUrl: img.imageUrl,
            displayOrder: 0,
            isMain: true
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', product?.id] });
            toast.success('Main image updated');
        },
        onError: () => toast.error('Failed to update main image'),
    });

    const deleteImageMutation = useMutation({
        mutationFn: (imageId: string) => productsApi.deleteImage(product!.id, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'product', product?.id] });
            toast.success('Image deleted');
        },
        onError: () => toast.error('Failed to delete image'),
    });

    const onSubmitForm = async (data: ImageFormData) => {
        await addImageMutation.mutateAsync(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Manage Images: ${product?.name}`}>
            <div className="space-y-6">
                {/* Gallery */}
                {!isFormOpen && (
                    <>
                        <div className="flex justify-end">
                            <Button size="sm" onClick={() => setIsFormOpen(true)} className="gap-2">
                                <Plus className="w-4 h-4" /> Add Image
                            </Button>
                        </div>

                        {isLoading ? (
                            <p className="text-text-muted text-center py-4">Loading images...</p>
                        ) : !currentProduct?.images || currentProduct.images.length === 0 ? (
                            <div className="text-center py-12 border border-border border-dashed rounded-xl bg-bg-secondary/30">
                                <p className="text-text-muted">No images yet. Add a main product image.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {currentProduct.images.sort((a: any, b: any) => a.displayOrder - b.displayOrder).map((img: any) => (
                                    <div key={img.id} className="relative group rounded-xl border border-border overflow-hidden bg-bg-secondary/30 aspect-square">
                                        <img
                                            src={img.imageUrl}
                                            alt={img.altText || product?.name}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                            <div className="flex justify-between items-start">
                                                {img.isMain ? (
                                                    <Badge variant="info" className="px-2 py-0.5 text-[10px]">Main</Badge>
                                                ) : (
                                                    <button
                                                        onClick={() => setMainImageMutation.mutate(img)}
                                                        className="p-1.5 bg-accent/90 text-white hover:bg-accent rounded-md transition-colors flex items-center gap-1.5 text-[10px] font-medium"
                                                        title="Set as Main"
                                                    >
                                                        <Star className="w-3 h-3" /> Set Main
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Delete this image?')) {
                                                            deleteImageMutation.mutate(img.id);
                                                        }
                                                    }}
                                                    className="p-1.5 bg-danger/90 text-white hover:bg-danger rounded-md transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-white text-xs bg-black/60 px-2 py-1 rounded backdrop-blur self-start">
                                                Order: {img.displayOrder}
                                            </div>
                                        </div>

                                        {img.isMain && (
                                            <div className="absolute top-2 left-2 group-hover:hidden">
                                                <Badge variant="info" className="px-2 py-0.5 text-[10px] flex items-center gap-1">
                                                    <Star className="w-3 h-3 fill-current" /> Main
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Form */}
                {isFormOpen && (
                    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 rounded-xl border border-border p-4 bg-bg-secondary/30">
                        <h3 className="font-medium text-text-primary border-b border-border pb-2 mb-4">Add New Image</h3>

                        <Input label="Image URL" placeholder="https://..." error={errors.imageUrl?.message} {...register('imageUrl')} />

                        {imageUrlPreview && !errors.imageUrl && (
                            <div className="mt-2 h-32 w-32 rounded-lg border border-border overflow-hidden bg-bg-tertiary">
                                <img src={imageUrlPreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            </div>
                        )}

                        <Input label="Alt Text (Optional)" placeholder="Describe the image..." error={errors.altText?.message} {...register('altText')} />

                        <div className="grid grid-cols-2 gap-4 items-center">
                            <Input label="Display Order" type="number" min={0} error={errors.displayOrder?.message} {...register('displayOrder', { valueAsNumber: true })} />

                            <div className="flex flex-col gap-1.5 pt-1">
                                <span className="text-sm font-medium text-text-secondary">Primary Image</span>
                                <label className="flex items-center gap-3 cursor-pointer h-10">
                                    <Toggle size="sm" checked={isMain} onChange={(c) => setValue('isMain', c, { shouldValidate: true })} />
                                    <span className="text-sm">Set as Main</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                            <Button variant="ghost" type="button" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button type="submit" isLoading={addImageMutation.isPending}>Upload Image</Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
