"use client";

import { ListIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  CourseDetailDto,
  Lecture as LectureEntity,
} from "@/generated/openapi-client";

interface Props {
  course: CourseDetailDto;
  lectureId?: string;
}

const UI = ({ course, lectureId }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const allLectures = useMemo(() => {
    return course.sections.flatMap((section) => section.lectures);
  }, [course.sections]);

  const currentLecture = useMemo(() => {
    if (lectureId) {
      const found = allLectures.find((lecture) => lecture.id === lectureId);
      if (found) return found;
    }

    // fallback to first lecture
    return allLectures[0];
  }, [lectureId, allLectures]);

  const handleSelectLecture = (lecture: LectureEntity) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("courseId", course.id);
    params.set("lectureId", lecture.id);
    router.push(`/courses/lecture?${params.toString()}`);
  };

  const currentLectureIndex = allLectures.findIndex(
    (lecture) => lecture.id === currentLecture.id,
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="absolute top-0 left-1/2 flex h-screen w-screen -translate-x-1/2 bg-black">
      {/* Video area */}
      <div className="relative flex-1">
        <VideoPlayer lecture={currentLecture} />

        {/* Floating button to open sidebar when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-black shadow hover:bg-white"
            aria-label="Open curriculum"
          >
            <ListIcon className="size-5" />
          </button>
        )}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          sections={course.sections}
          currentLectureId={currentLecture.id}
          onSelectLecture={handleSelectLecture}
          course={course}
          onClose={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UI;
