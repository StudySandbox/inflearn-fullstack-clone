import { Progress } from "@/components/ui/progress";
import { Section as SectionEntity } from "@/generated/openapi-client";
import { useMemo } from "react";

interface Props {
  title: string;
  sections: SectionEntity[];
  currentLectureIndex: number;
}

export const LectureHeader = ({
  title,
  sections,
  currentLectureIndex,
}: Props) => {
  // Mock progress: pretend 37% complete
  const totalLectures = useMemo(
    () => sections.reduce((acc, section) => acc + section.lectures.length, 0),
    [sections],
  );
  const completedLectures = Math.floor(totalLectures * 0.37);
  const progressValue = (completedLectures / totalLectures) * 100;

  return (
    <header className="mb-4 space-y-2">
      <h1 className="truncate text-lg font-semibold" title={title}>
        {title}
      </h1>
      <Progress value={progressValue} />
      <p className="text-muted-foreground text-xs">
        {completedLectures} / {totalLectures} 강의 완료 · 현재{" "}
        {currentLectureIndex + 1}번째 강의
      </p>
    </header>
  );
};
