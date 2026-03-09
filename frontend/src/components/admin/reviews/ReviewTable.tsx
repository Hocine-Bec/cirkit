import { Trash2, ShieldCheck, Star } from 'lucide-react';
import type { ReviewResponse } from '@/types';

interface ReviewTableProps {
    reviews: ReviewResponse[];
    onDelete: (review: ReviewResponse) => void;
}

export default function ReviewTable({ reviews, onDelete }: ReviewTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-bg-secondary/60">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-bg-tertiary/50 text-xs uppercase tracking-wider text-text-muted border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium min-w-[200px]">Product & Content</th>
                        <th className="px-6 py-4 font-medium">Customer</th>
                        <th className="px-6 py-4 font-medium text-center">Rating</th>
                        <th className="px-6 py-4 font-medium text-center">Verified</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                    {reviews.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                No reviews found.
                            </td>
                        </tr>
                    ) : (
                        reviews.map((review) => (
                            <tr key={review.id} className="hover:bg-bg-hover transition-colors bg-bg-primary/40 align-top">
                                <td className="px-6 py-4 max-w-sm">
                                    <p className="font-medium text-text-primary text-xs uppercase tracking-wider mb-2">
                                        {review.productId}
                                    </p>
                                    <p className="font-medium text-text-primary mb-1">
                                        {review.title}
                                    </p>
                                    <p className="text-text-secondary w-full truncate" title={review.comment}>
                                        {review.comment}
                                    </p>
                                </td>
                                <td className="px-6 py-4 pt-4 text-text-secondary">
                                    {review.customerName}
                                </td>
                                <td className="px-6 py-4 pt-4">
                                    <div className="flex justify-center text-accent">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-border fill-transparent'}`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 pt-4 text-center">
                                    {review.isVerifiedPurchase ? (
                                        <ShieldCheck className="w-5 h-5 text-success inline-block" />
                                    ) : (
                                        <span className="text-text-muted text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 pt-4 text-text-secondary whitespace-nowrap">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 pt-4 text-right">
                                    <button
                                        onClick={() => onDelete(review)}
                                        className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer inline-flex"
                                        title="Delete Review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
