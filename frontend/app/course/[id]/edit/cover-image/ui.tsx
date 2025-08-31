"use client";

import { Course } from "@/generated/openapi-client";

import * as api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Loader2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
};

interface Props {
  course: Course;
}

const UI = ({ course }: Props) => {
  const queryClient = useQueryClient();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    course.thumbnailUrl || "",
  );
  const updateCourseThumbnailMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data, error } = await api.uploadMedia(file);
      if (!data || error) {
        toast.error(error as string);
        return;
      }

      setThumbnailUrl((data as any).cloudFront.url);

      return api.updateCourse(course.id, {
        thumbnailUrl: (data as any).cloudFront.url,
      });
    },

    onSuccess: () => {
      toast.success("커버 이미지 업데이트를 성공적으로 완료했습니다.");
      queryClient.invalidateQueries({
        queryKey: ["course", course.id],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        updateCourseThumbnailMutation.mutate(file);
      }
    },
    [updateCourseThumbnailMutation],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="prose space-y-4 rounded-lg bg-white p-8">
      <h2>커버 이미지 업로드</h2>

      <div className="space-y-2">
        {/* 업로드 된 이미지 미리보기 */}
        {thumbnailUrl && (
          <div className="relative h-auto min-h-[200px] w-full overflow-hidden rounded-lg">
            <img
              src={thumbnailUrl}
              alt="커버 이미지"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 권장 이미지 형식 안내 */}
        <p className="mb-2 text-sm text-gray-500">
          • 최대 파일 크기: 5MB
          <br />
          • 지원 형식: .jpg, .jpeg, .png, .gif
          <br />• 권장 해상도: 1200 x 781px
        </p>

        <div
          {...getRootProps()}
          className={cn(
            "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center",
            isDragActive ? "border-primary" : "border-gray-300",
          )}
        >
          <input {...getInputProps()} />
          <div className="py-8">
            {updateCourseThumbnailMutation.isPending ? (
              <Loader2Icon className="mx-auto size-12 animate-spin text-gray-400" />
            ) : (
              <>
                <ImageIcon className="mx-auto mb-4 size-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {thumbnailUrl
                    ? "클릭하여 이미지 변경"
                    : isDragActive
                      ? "이미지를 여기에 놓아 주세요"
                      : "클릭하거나 이미지를 드래그하여 업로드하세요"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UI;
