import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Section as SectionEntity } from "@/generated/openapi-client";

import { LectureRow } from "./lecture-row";

interface Props {
  courseId: string;
  sections: SectionEntity[];
}

export const Curriculum = ({ courseId, sections }: Props) => {
  return (
    <section id="curriculum" className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">커리큘럼</h2>

      <div className="overflow-hidden rounded-md border bg-[#F8F9FA]">
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="flex bg-[#F8F9FA] px-4 py-3 text-base font-medium">
                <span className="flex-1">{section.title}</span>
                <span className="ml-2 text-base font-medium">
                  {section.lectures.length}개
                </span>
              </AccordionTrigger>

              <AccordionContent className="bg-white">
                <div className="flex flex-col">
                  {section.lectures
                    .sort((a, b) => a.order - b.order)
                    .map((lecture, idx) => (
                      <LectureRow
                        key={lecture.id}
                        courseId={courseId}
                        lecture={lecture}
                        className={cn(
                          "h-12",
                          idx !== section.lectures.length - 1 &&
                            "border-b border-gray-200",
                        )}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
