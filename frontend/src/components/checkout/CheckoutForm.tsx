import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, MapPin, CreditCard, LockKeyhole } from 'lucide-react';
import { checkoutApi } from '@/services/api';
import { useCart } from '@/hooks/useCart';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import MockPaymentCard from './MockPaymentCard';

const schema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function SectionHeader({ step, icon: Icon, title }: { step: string; icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-accent" />
      </div>
      <div>
        <p className="text-accent text-[10px] font-semibold uppercase tracking-widest font-mono">{step}</p>
        <h3 className="text-text-primary font-semibold leading-tight">{title}</h3>
      </div>
    </div>
  );
}

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'US' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormValues) =>
      checkoutApi.checkout({
        items: items.map((item) => ({
          productId: item.productId,
          productVariantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
          country: values.country,
        },
        notes: values.notes || undefined,
      }),
    onSuccess: (data) => {
      clearCart();
      navigate(`/order-confirmation/${data.orderId}`);
    },
    onError: () => {
      toast.error('Checkout failed. Please try again.');
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-bg-secondary rounded-2xl border border-border p-6">
        <SectionHeader step="Step 01" icon={MapPin} title="Shipping Address" />

        <div className="space-y-4">
          <Input
            {...register('street')}
            id="street"
            label="Street Address"
            placeholder="123 Main St"
            error={errors.street?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('city')}
              id="city"
              label="City"
              placeholder="New York"
              error={errors.city?.message}
            />
            <Input
              {...register('state')}
              id="state"
              label="State"
              placeholder="NY"
              error={errors.state?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register('zipCode')}
              id="zipCode"
              label="ZIP Code"
              placeholder="10001"
              error={errors.zipCode?.message}
            />
            <Input
              {...register('country')}
              id="country"
              label="Country"
              placeholder="US"
              error={errors.country?.message}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">
              Order Notes <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={2}
              placeholder="Leave a note about your order..."
              className="w-full px-4 py-2.5 bg-bg-tertiary border border-border rounded-xl text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-bg-secondary rounded-2xl border border-border p-6">
        <SectionHeader step="Step 02" icon={CreditCard} title="Payment Details" />
        <MockPaymentCard />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full glow-blue-hover"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Placing Order…
          </>
        ) : (
          <>
            <LockKeyhole size={15} className="mr-2" />
            Place Order
          </>
        )}
      </Button>
    </form>
  );
}
