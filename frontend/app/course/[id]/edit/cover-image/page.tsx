import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import UI from "./ui";

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
