import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { AddressRequest, AddressResponse } from '@/types';

const addressSchema = z.object({
    label: z.string().min(1, 'Label is required').max(50),
    street: z.string().min(1, 'Street is required').max(200),
    city: z.string().min(1, 'City is required').max(100),
    state: z.string().min(1, 'State is required').max(100),
    zipCode: z.string().min(1, 'Zip code is required').max(20),
    country: z.string().min(1, 'Country is required').max(100),
    isDefault: z.boolean(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    address?: AddressResponse | null;
    onSubmit: (data: AddressRequest) => Promise<void>;
    isSubmitting: boolean;
}

export default function AddressForm({ address, onSubmit, isSubmitting }: AddressFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            label: address?.label ?? '',
            street: address?.street ?? '',
            city: address?.city ?? '',
            state: address?.state ?? '',
            zipCode: address?.zipCode ?? '',
            country: address?.country ?? 'United States',
            isDefault: address?.isDefault ?? false,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Label"
                placeholder="e.g. Home, Work"
                error={errors.label?.message}
                {...register('label')}
            />
            <Input
                label="Street"
                placeholder="123 Main St"
                error={errors.street?.message}
                {...register('street')}
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="City"
                    placeholder="New York"
                    error={errors.city?.message}
                    {...register('city')}
                />
                <Input
                    label="State"
                    placeholder="NY"
                    error={errors.state?.message}
                    {...register('state')}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Zip Code"
                    placeholder="10001"
                    error={errors.zipCode?.message}
                    {...register('zipCode')}
                />
                <Input
                    label="Country"
                    placeholder="United States"
                    error={errors.country?.message}
                    {...register('country')}
                />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-bg-secondary text-accent focus:ring-accent/30 cursor-pointer"
                    {...register('isDefault')}
                />
                <span className="text-sm text-text-secondary">Set as default address</span>
            </label>
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
                {address ? 'Update Address' : 'Add Address'}
            </Button>
        </form>
    );
}
