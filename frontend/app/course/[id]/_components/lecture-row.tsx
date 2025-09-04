import { useRouter } from "next/navigation";
import { LockIcon, PlayCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatSecondsToMinSec } from "@/lib/formats";
import { Lecture as LectureEntity } from "@/generated/openapi-client";

interface Props {
  courseId: string;
  lecture: LectureEntity;
  className?: string;
}

export const LectureRow = ({ courseId, lecture, className }: Props) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 text-sm",
        lecture.videoStorageInfo && "cursor-pointer",
        className,
      )}
      onClick={() => {
        router.push(
          `/courses/lecture?courseId=${courseId}&lectureId=${lecture.id}`,
        );
      }}
    >
      <div className="flex items-center gap-2">
        {lecture.isPreview ? (
          <PlayCircleIcon className="text-primary size-4" />
        ) : (
          <LockIcon className="text-muted-foreground size-4" />
        )}

        <span className={lecture.videoStorageInfo && "underline"}>
          {lecture.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {lecture.isPreview && (
          <button className="cursor-pointer rounded-md border border-gray-400 px-2 py-1 text-sm font-semibold text-gray-800">
            미리보기
          </button>
        )}

        <span>{formatSecondsToMinSec(lecture.duration ?? 0)}</span>
      </div>
    </div>
  );
};
