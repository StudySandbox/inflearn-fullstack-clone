import Image from "next/image";
import { PlayCircleIcon } from "lucide-react";

import { CourseDetailDto } from "@/generated/openapi-client";

import { StarRating } from "./star-rating";

interface Props {
  course: CourseDetailDto;
}

export const Header = ({ course }: Props) => {
  return (
    <header className="relative flex flex-col-reverse gap-6 rounded-md p-8 text-white md:flex-row md:items-center">
      <div className="absolute top-0 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[#0F1415]" />

      {/* Left */}
      <div className="flex-1">
        {course.categories?.[0] && (
          <p className="text-muted-foreground mb-1 text-sm">
            {course.categories[0].name}
          </p>
        )}

        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{course.title}</h1>
        {course.shortDescription && (
          <p className="text-muted-foreground mb-4 text-lg">
            {course.shortDescription}
          </p>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
          <StarRating rating={course.averageRating} />
          <span className="font-medium">{course.averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({course.totalReviews}개 수강평)
          </span>
          <span className="hidden md:inline">·</span>
          <span>수강생 {course.totalEnrollments.toLocaleString()}명</span>
        </div>

        <p className="text-muted-foreground text-sm">
          by {course.instructor.name}
        </p>
      </div>

      {/* Thumbnail */}
      {course.thumbnailUrl && (
        <div className="relative w-full flex-shrink-0 md:w-64">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            width={256}
            height={144}
            className="h-auto w-full rounded-md object-cover"
          />

          {/* Play button overlay */}
          <button
            className="absolute inset-0 flex items-center justify-center"
            aria-label="preview"
          >
            <PlayCircleIcon className="size-16 text-white/90 drop-shadow-lg" />
          </button>
        </div>
      )}
    </header>
  );
};
