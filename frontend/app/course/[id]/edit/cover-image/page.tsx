import { Metadata } from "next";
import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import UI from "./ui";

export const metadata: Metadata = {
  title: "강의 커버 이미지 편집 - 인프런",
  description: "인프런 강의 커버 이미지 편집 페이지입니다.",
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditCourseCoverImagePage = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <UI course={course.data} />;
};

export default EditCourseCoverImagePage;
