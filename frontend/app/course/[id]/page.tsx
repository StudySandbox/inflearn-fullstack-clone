import { notFound } from "next/navigation";
import UI from "./ui";

import * as api from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

const CoursePage = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <UI course={course.data} />;
};

export default CoursePage;
