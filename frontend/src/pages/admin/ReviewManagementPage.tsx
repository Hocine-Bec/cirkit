import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewsApi } from '@/services/api';
import ReviewTable from '@/components/admin/reviews/ReviewTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Skeleton from '@/components/ui/Skeleton';
import type { ReviewResponse } from '@/types';

export default function ReviewManagementPage() {
    const queryClient = useQueryClient();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<ReviewResponse | null>(null);

    const { data: reviewsData, isLoading, error } = useQuery({
        queryKey: ['admin', 'reviews'],
        queryFn: () => reviewsApi.getAll(), // Using simplified fetch, pagination excluded for clarity
    });

    const deleteMutation = useMutation({
        mutationFn: reviewsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
            toast.success('Review deleted successfully');
            setIsDeleteOpen(false);
            setReviewToDelete(null);
        },
        onError: (err: any) => toast.error(err.response?.data?.detail || 'Failed to delete review'),
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-6 w-64 bg-bg-tertiary rounded animate-pulse" />
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl text-danger text-center">
                Failed to load product reviews.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col flex-wrap gap-2 mb-6">
                <p className="text-text-secondary">
                    Moderate customer product reviews.
                </p>
            </div>

            <ReviewTable
                reviews={reviewsData || []}
                onDelete={(review) => {
                    setReviewToDelete(review);
                    setIsDeleteOpen(true);
                }}
            />

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={async () => {
                    if (reviewToDelete) await deleteMutation.mutateAsync(reviewToDelete.id);
                }}
                title="Delete Review"
                description={`Are you sure you want to delete this review by ${reviewToDelete?.customerName}? This action cannot be undone.`}
                isLoading={deleteMutation.isPending}
                variant="danger"
                confirmText="Delete Review"
            />
        </div>
    );
}
