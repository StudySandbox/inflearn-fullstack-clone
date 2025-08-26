import { InstructorSidebar } from "./_components/instructor-sidebar";
import { InstructorPageName } from "./_components/instructor-page-name";

interface Props {
  children: React.ReactNode;
}

export default function InstructorLayout({ children }: Props) {
  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <InstructorPageName />
      <div className="mx-auto flex w-6xl">
        <InstructorSidebar />
        {children}
      </div>
    </div>
  );
}
