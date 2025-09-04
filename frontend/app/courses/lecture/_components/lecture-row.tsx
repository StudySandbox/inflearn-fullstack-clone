import { Lecture as LectureEntity } from "@/generated/openapi-client";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, LockIcon, PlayCircleIcon } from "lucide-react";

interface Props {
  lecture: LectureEntity;
  isActive: boolean;
  onSelect: () => void;
  completed?: boolean;
}

export const LectureRow = ({
  lecture,
  isActive,
  onSelect,
  completed = false,
}: Props) => {
  return (
    <div
      onClick={lecture.videoStorageInfo ? onSelect : undefined}
      className={cn()}
    >
      <div className="flex items-center gap-2 truncate">
        {completed ? (
          <CheckCircle2Icon className="size-4 shrink-0 text-green-500" />
        ) : lecture.isPreview ? (
          <PlayCircleIcon className="text-primary size-4 shrink-0" />
        ) : (
          <LockIcon className="text-muted-foreground size-4 shrink-0" />
        )}
        <span className="truncate">{lecture.title}</span>
      </div>
    </div>
  );
};
