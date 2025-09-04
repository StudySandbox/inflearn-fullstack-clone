"use client";

import { User } from "next-auth";

import { CourseDetailDto } from "@/generated/openapi-client";

import { Header } from "./_components/header";
import { Curriculum } from "./_components/curriculum";
import { Introduction } from "./_components/introduction";
import { FloatingMenu } from "./_components/floating-menu";
import { InstructorBio } from "./_components/instructor-bio";
import { ReviewsSection } from "./_components/review-section";
import { MobileBottomBar } from "./_components/mobile-bottom-bar";

interface Props {
  course: CourseDetailDto;
  user?: User;
}

const CourseDetailUI = ({ course, user }: Props) => {
  return (
    <div className="lg:bg-12 mx-auto px-4 pb-24">
      <Header course={course} />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto]">
        {/* Main content */}
        <div className="max-w-3xl">
          <Introduction course={course} />
          <InstructorBio instructor={course.instructor} />
          <Curriculum courseId={course.id} sections={course.sections} />
          <ReviewsSection reviews={course.reviews} />
        </div>

        {/* Floating menu */}
        <FloatingMenu course={course} user={user} />
      </div>

      {/* 모바일 하단 바 */}
      <MobileBottomBar course={course} />
    </div>
  );
};

export default CourseDetailUI;
