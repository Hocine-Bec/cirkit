import { Star, BadgeCheck, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import RatingBreakdown from './RatingBreakdown';
import type { ReviewResponse } from '@/types';

interface Props {
  reviews: ReviewResponse[];
  productId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center flex-shrink-0">
      <span className="text-accent text-xs font-bold">{initials}</span>
    </div>
  );
}

export default function ReviewsSection({ reviews, productId }: Props) {
  const { isCustomerAuthenticated } = useCustomerAuth();

  return (
    <div className="space-y-8 max-w-3xl">
      {reviews.length > 0 && <RatingBreakdown reviews={reviews} />}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary font-semibold">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        <Link
          to={isCustomerAuthenticated ? `/products/${productId}/review` : '/account/login'}
          className="flex items-center gap-1.5 text-sm font-medium text-accent border border-accent/30 hover:bg-accent/10 px-4 py-2 rounded-xl transition-colors"
        >
          <MessageSquarePlus size={14} />
          {isCustomerAuthenticated ? 'Write a Review' : 'Login to Review'}
        </Link>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 bg-bg-tertiary border border-border rounded-2xl">
          <p className="text-text-muted text-sm">No reviews yet — be the first!</p>
        </div>
      )}

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-bg-tertiary border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar name={review.customerName} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-text-primary font-medium text-sm">{review.customerName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-success text-xs font-medium">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < review.rating ? 'text-warning fill-warning' : 'text-text-muted'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-text-muted text-xs flex-shrink-0">{formatDate(review.createdAt)}</span>
            </div>

            <div>
              <h4 className="text-text-primary font-semibold text-sm">{review.title}</h4>
              <p className="text-text-secondary text-sm mt-1 leading-relaxed">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
