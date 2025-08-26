import UI from "./ui";

import * as api from "@/lib/api";

export default async function InstructorCoursesPage() {
  const { data: courses } = await api.getAllInstructorCourses();
  return <UI courses={courses ?? []} />;
}
