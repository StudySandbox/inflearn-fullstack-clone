import { Metadata } from "next";

import UI from "./ui";

export const metadata: Metadata = {
  title: "강의 만들기 - 인프런",
  description: "인프런 강의 만들기 페이지입니다.",
};

export default function CreateCoursesPage() {
  return <UI />;
}
