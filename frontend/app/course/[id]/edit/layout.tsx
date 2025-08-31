import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import EditCourseHeader from "./_components/edit-course-header";
import EditCourseSidebar from "./_components/edit-course-sidebar";

export default async function EditCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (course.error || !course.data) {
    notFound();
  }

  return (
    <div className="h-full w-full bg-[#F1F3F5]">
      <EditCourseHeader course={course.data} />
      <div className="flex min-h-screen max-w-5xl gap-12 p-12">
        <EditCourseSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
