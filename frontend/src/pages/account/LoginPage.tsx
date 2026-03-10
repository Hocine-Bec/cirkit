import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { customerLogin } = useCustomerAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);
            await customerLogin(data);
            toast.success('Successfully logged in');
            const redirect = searchParams.get('redirect') || '/account/orders';
            navigate(redirect, { replace: true });
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center pt-20 px-4">
            <Link to="/" className="text-2xl font-bold tracking-tight mb-8">
                <span className="gradient-text">CirKit</span>
            </Link>

            <div className="w-full max-w-md p-8 glass rounded-2xl border border-border bg-bg-secondary/60">
                <h1 className="text-xl font-bold text-text-primary mb-6 text-center">
                    Sign in to your account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full glow-blue"
                            isLoading={isSubmitting}
                        >
                            Sign In
                        </Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Don't have an account?{' '}
                    <Link to="/account/register" className="text-accent hover:text-accent-glow transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
