import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import UI from "./ui";

interface Props {
  searchParams: Promise<{
    courseId: string;
    lectureId?: string;
  }>;
}

const LecturePage = async ({ searchParams }: Props) => {
  const { courseId, lectureId } = await searchParams;
  const course = await api.getCourseById(courseId);

  if (!course.data || course.error) {
    notFound();
  }

  return (
    <>
      <UI course={course.data} lectureId={lectureId} />
    </>
  );
};

export default LecturePage;
