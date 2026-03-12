import { Star } from 'lucide-react';
import type { ReviewResponse } from '@/types';

interface Props {
  reviews: ReviewResponse[];
}

export default function RatingBreakdown({ reviews }: Props) {
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const bars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="bg-bg-tertiary border border-border rounded-2xl p-6 flex gap-8 items-center">
      {/* Score */}
      <div className="text-center flex-shrink-0">
        <p className="text-5xl font-bold gradient-text font-mono">{avg.toFixed(1)}</p>
        <div className="flex gap-0.5 mt-2 justify-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={14} className={i < Math.round(avg) ? 'text-warning fill-warning' : 'text-text-muted'} />
          ))}
        </div>
        <p className="text-text-muted text-xs mt-1.5">{reviews.length} reviews</p>
      </div>

      <div className="w-px self-stretch bg-border" />

      {/* Bars */}
      <div className="flex-1 space-y-2">
        {bars.map(({ star, count, pct }) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-text-muted text-xs w-3 text-right">{star}</span>
            <Star size={11} className="text-warning fill-warning flex-shrink-0" />
            <div className="flex-1 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-text-muted text-xs w-4 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
