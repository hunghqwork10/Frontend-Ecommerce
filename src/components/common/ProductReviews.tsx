import { Star } from 'lucide-react';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export default function ProductReviews({ reviews, averageRating, reviewCount }: ProductReviewsProps) {
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length > 0 
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 
      : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{reviewCount} đánh giá</div>
        </div>

        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm w-8">{star} ★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.user.charAt(0)}
                  </div>
                  <span className="font-medium">{review.user}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-400 mt-2">{review.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}