import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { customerRegister } = useCustomerAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsSubmitting(true);
            // Omit confirmPassword from the API request
            const { confirmPassword, ...registerData } = data;
            await customerRegister(registerData);
            toast.success('Account created successfully');
            navigate('/account/orders', { replace: true });
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to register account');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center pt-16 px-4 pb-12">
            <Link to="/" className="text-2xl font-bold tracking-tight mb-8">
                <span className="gradient-text">CirKit</span>
            </Link>

            <div className="w-full max-w-md p-8 glass rounded-2xl border border-border bg-bg-secondary/60">
                <h1 className="text-xl font-bold text-text-primary mb-6 text-center">
                    Create your account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="John"
                            error={errors.firstName?.message}
                            {...register('firstName')}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            error={errors.lastName?.message}
                            {...register('lastName')}
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@email.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full glow-blue"
                            isLoading={isSubmitting}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/account/login" className="text-accent hover:text-accent-glow transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
