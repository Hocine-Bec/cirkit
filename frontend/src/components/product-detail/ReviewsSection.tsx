import { Star, BadgeCheck } from 'lucide-react';
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

export default function ReviewsSection({ reviews, productId }: Props) {
  const { isCustomerAuthenticated } = useCustomerAuth();

  return (
    <div className="space-y-8">
      {reviews.length > 0 && <RatingBreakdown reviews={reviews} />}

      <div className="flex items-center justify-between">
        <h3 className="text-text-primary font-semibold">{reviews.length} Reviews</h3>
        {isCustomerAuthenticated ? (
          <Link
            to={`/products/${productId}/review`}
            className="text-accent text-sm hover:text-accent-glow transition-colors"
          >
            Write a Review
          </Link>
        ) : (
          <Link
            to="/account/login"
            className="text-accent text-sm hover:text-accent-glow transition-colors"
          >
            Login to Review
          </Link>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="text-text-muted text-sm">No reviews yet. Be the first!</p>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-medium text-sm">{review.customerName}</span>
                  {review.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-success text-xs">
                      <BadgeCheck size={12} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={12} className={i < review.rating ? 'text-warning fill-warning' : 'text-text-muted'} />
                  ))}
                </div>
              </div>
              <span className="text-text-muted text-xs">{formatDate(review.createdAt)}</span>
            </div>
            <h4 className="text-text-primary font-medium mt-3 text-sm">{review.title}</h4>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
