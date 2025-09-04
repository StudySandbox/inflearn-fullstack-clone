import { notFound } from "next/navigation";

import { auth } from "@/auth";
import * as api from "@/lib/api";

import UI from "./ui";

interface Props {
  params: Promise<{ id: string }>;
}

const CoursePage = async ({ params }: Props) => {
  const { id } = await params;
  const session = await auth();
  const course = await api.getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <UI user={session?.user} course={course.data} />;
};

export default CoursePage;
