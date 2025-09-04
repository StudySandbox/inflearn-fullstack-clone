import Image from "next/image";

import { cn } from "@/lib/utils";
import { CourseReview as CourseReviewEntity } from "@/generated/openapi-client";

import { StarRating } from "./star-rating";

interface Props {
  reviews: CourseReviewEntity[];
}

export const LatestReviews = ({ reviews }: Props) => {
  if (!reviews.length) return null;

  const latest = [...reviews]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 4);

  // grid position for 4 quadrants
  const positions: [number, number][] = [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ];

  return (
    <section className="mb-8">
      <h3 className="mb-4 text-xl font-semibold">최근 리뷰</h3>

      <div
        className={cn(
          "grid grid-cols-2 gap-4",
          latest.length > 2 && "grid-rows-2",
        )}
      >
        {latest.map((review, idx) => {
          const [col, row] = positions[latest.length === 1 ? 0 : idx];

          return (
            <div
              key={review.id}
              style={{ gridColumnStart: col, gridRowStart: row }}
              className="flex flex-col gap-2 rounded-md border bg-white p-4"
            >
              <div className="flex items-center gap-2">
                {review.user?.image && (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "user"}
                    width={24}
                    height={24}
                    className="aspect-square rounded-full object-cover"
                  />
                )}

                <span className="text-sm font-medium">
                  {review.user?.name ?? "익명"}
                </span>

                <StarRating rating={review.rating} />
              </div>

              <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap">
                {review.content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
