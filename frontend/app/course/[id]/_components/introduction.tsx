import { CourseDetailDto } from "@/generated/openapi-client";

import { LatestReviews } from "./latest-reviews";

interface Props {
  course: CourseDetailDto;
}

export const Introduction = ({ course }: Props) => {
  return (
    <section id="introduction" className="">
      <h2 className="mb-6 text-2xl font-bold">강의 소개</h2>

      <LatestReviews reviews={course.reviews} />

      {course.description && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      )}
    </section>
  );
};
