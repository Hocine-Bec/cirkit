import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const { adminLogin } = useAdminAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@cirkit.com',
            password: 'Admin123!',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);
            await adminLogin(data);
            toast.success('Successfully logged in');
            navigate('/admin', { replace: true });
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Invalid credentials');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center pt-24 px-4">
            <div className="w-full max-w-md p-8 glass rounded-2xl border border-border bg-bg-secondary/60">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">
                        <span className="gradient-text">CirKit</span> Admin
                    </h1>
                    <p className="text-sm text-text-secondary">Sign in to the management console</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Admin Email"
                        type="email"
                        placeholder="admin@cirkit.com"
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
                            Sign In to Dashboard
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
