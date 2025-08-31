import * as api from "@/lib/api";

import UI from "./ui";

import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const EditCourseDescriptionBuilderPage = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);
  if (!course.data || course.error) {
    notFound();
  }

  return <UI course={course.data} />;
};

export default EditCourseDescriptionBuilderPage;
