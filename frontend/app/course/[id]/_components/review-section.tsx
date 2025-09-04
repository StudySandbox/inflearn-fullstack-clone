import Image from "next/image";

import { CourseReview as CourseReviewEntity } from "@/generated/openapi-client";

import { formatDate } from "@/lib/formats";

import { StarRating } from "./star-rating";

interface Props {
  reviews: CourseReviewEntity[];
}

export const ReviewsSection = ({ reviews }: Props) => {
  if (!reviews.length) return null;

  return (
    <section id="reviews" className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">수강평</h2>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-4">
            <div className="flex items-center gap-4">
              {review.user?.image && (
                <Image
                  src={review.user.image}
                  alt={review.user.name || "user"}
                  width={40}
                  height={40}
                  className="aspect-square rounded-full object-cover"
                />
              )}

              <div>
                <p className="font-medium">{review.user?.name ?? "익명"}</p>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <StarRating rating={review.rating} />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {review.content}
            </p>

            {review.instructorReply && (
              <div className="border-primary ml-10 border-l-2 pl-4">
                <p className="text-primary mb-1 font-medium">
                  지식 공유자 답변
                </p>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {review.instructorReply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
