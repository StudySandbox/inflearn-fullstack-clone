"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Course } from "@/generated/openapi-client";

interface Props {
  course: Course;
}

export default function EditCourseHeader({ course }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const publishCourseMutation = useMutation({
    mutationFn: () =>
      api.updateCourse(course.id, {
        status: "PUBLISHED",
      }),
    onSuccess: (res) => {
      toast.success("강의가 성공적으로 게시되었습니다.");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["course", course.id],
      });
    },
    onError: () => {
      toast.error("강의 게시에 실패했습니다.");
    },
  });

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4">
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <div className="flex items-center gap-2">
        <Button
          disabled={
            publishCourseMutation.isPending || course.status === "PUBLISHED"
          }
          size="lg"
        >
          {publishCourseMutation.isPending ? (
            <Loader2Icon size={20} className="animate-spin" />
          ) : course.status === "PUBLISHED" ? (
            <span>제출완료</span>
          ) : (
            <span>제출하기</span>
          )}
        </Button>

        <Button
          onClick={() => router.push("/instructor/courses")}
          size="lg"
          variant={"outline"}
        >
          <XIcon size={20} />
        </Button>
      </div>
    </header>
  );
}
