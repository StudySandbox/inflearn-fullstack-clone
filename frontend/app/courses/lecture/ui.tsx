"use client";

import { ListIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  CourseDetailDto,
  LectureActivity as LectureActivityEntity,
  Lecture as LectureEntity,
} from "@/generated/openapi-client";

import { Sidebar } from "./_components/sidebar";
import { VideoPlayer } from "./_components/video-player";

interface Props {
  lectureId?: string;
  course: CourseDetailDto;
  lectureActivities: LectureActivityEntity[];
}

const UI = ({ course, lectureId, lectureActivities }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLectureId = lectureId ?? course.sections[0].lectures[0].id;

  const allLectures = useMemo(() => {
    return course.sections.flatMap((section) => section.lectures);
  }, [course.sections]);

  const currentLecture = useMemo(() => {
    if (currentLectureId) {
      const found = allLectures.find(
        (lecture) => lecture.id === currentLectureId,
      );
      if (found) return found;
    }

    // fallback to first lecture
    return allLectures[0];
  }, [currentLectureId, allLectures]);

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
        <VideoPlayer
          lecture={currentLecture}
          lectureActivity={lectureActivities.find(
            (activity) => activity.lectureId === currentLectureId,
          )}
        />

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
