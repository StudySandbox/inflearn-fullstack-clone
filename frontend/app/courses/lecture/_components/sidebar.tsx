import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CourseDetailDto,
  Lecture as LectureEntity,
  Section as SectionEntity,
} from "@/generated/openapi-client";
import { XIcon } from "lucide-react";
import { LectureRow } from "./lecture-row";

interface Props {
  sections: SectionEntity[];
  currentLectureId?: string;
  onSelectLecture: (lecture: LectureEntity) => void;
  course: CourseDetailDto;
  onClose: () => void;
}

export const Sidebar = ({
  sections,
  currentLectureId,
  onSelectLecture,
  course,
  onClose,
}: Props) => {
  return (
    <aside className="hidden h-screen w-80 flex-col border-l bg-white shadow-lg lg:flex">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <p className="flex-1 text-lg font-bold">커리큘럼</p>
        <button
          className="text-muted-foreground hover:text-foreground p-1"
          aria-label="Close sidebar"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <h2 className="text-h2 p-4 text-lg font-semibold" title={course.title}>
        {course.title}
      </h2>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="bg-muted/50 flex px-4 py-3 text-sm font-medium hover:no-underline">
                <span className="flex-1 truncate text-left">
                  {section.title}
                </span>

                <span className="text-muted-foreground ml-2 text-xs font-medium">
                  {section.lectures.length}개
                </span>
              </AccordionTrigger>

              <AccordionContent className="bg-background">
                <div className="flex flex-col">
                  {section.lectures
                    .sort((a, b) => a.order - b.order)
                    .map((lecture) => (
                      <LectureRow
                        key={lecture.id}
                        lecture={lecture}
                        isActive={lecture.id === currentLectureId}
                        onSelect={() => onSelectLecture(lecture)}
                        completed={false} // TODO: replace with real progress
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
