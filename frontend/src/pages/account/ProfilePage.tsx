import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { accountApi } from '@/services/api';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import type { ChangePasswordRequest } from '@/types';

// Profile Update Schema
const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});
type ProfileFormData = z.infer<typeof profileSchema>;

// Password Change Schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain a number'),
    confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
});
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { customer } = useCustomerAuth();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['my-profile'],
        queryFn: accountApi.getProfile,
    });

    // Profile Form (pre-filled with Customer data from context/query)
    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors, isDirty: isProfileDirty }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        values: {
            firstName: profile?.firstName || customer?.firstName || '',
            lastName: profile?.lastName || customer?.lastName || '',
            email: profile?.email || customer?.email || '',
        }
    });

    // Password Form
    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors }
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const updateProfileMutation = useMutation({
        mutationFn: accountApi.updateProfile,
        onSuccess: () => {
            toast.success('Profile updated successfully');
            // We don't have a direct "update context user" function, so login might be 
            // needed if the email changed and a new token is issued, or we wait for reload.
            // But updating the server is success.
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update profile'),
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => accountApi.changePassword(data),
        onSuccess: () => {
            toast.success('Password updated successfully');
            resetPasswordForm();
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to update password'),
    });

    const onProfileSave = async (data: ProfileFormData) => {
        await updateProfileMutation.mutateAsync(data);
    };

    const onPasswordSave = async (data: PasswordFormData) => {
        const { confirmNewPassword, ...requestData } = data;
        await changePasswordMutation.mutateAsync(requestData);
    };

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-2xl">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Personal Info */}
            <section className="p-6 md:p-8 rounded-xl bg-bg-secondary/60 border border-border">
                <h2 className="text-lg font-semibold text-text-primary mb-6">Personal Information</h2>
                <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            error={profileErrors.firstName?.message}
                            {...registerProfile('firstName')}
                        />
                        <Input
                            label="Last Name"
                            error={profileErrors.lastName?.message}
                            {...registerProfile('lastName')}
                        />
                    </div>
                    <Input
                        label="Email Address"
                        type="email"
                        error={profileErrors.email?.message}
                        {...registerProfile('email')}
                    />
                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={updateProfileMutation.isPending}
                            disabled={!isProfileDirty}
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </section>

            {/* Password Form */}
            <section className="p-6 md:p-8 rounded-xl bg-bg-secondary/60 border border-border">
                <h2 className="text-lg font-semibold text-text-primary mb-6">Change Password</h2>
                <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        error={passwordErrors.currentPassword?.message}
                        {...registerPassword('currentPassword')}
                    />
                    <Input
                        label="New Password"
                        type="password"
                        error={passwordErrors.newPassword?.message}
                        {...registerPassword('newPassword')}
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        error={passwordErrors.confirmNewPassword?.message}
                        {...registerPassword('confirmNewPassword')}
                    />
                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            variant="secondary"
                            isLoading={changePasswordMutation.isPending}
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}
