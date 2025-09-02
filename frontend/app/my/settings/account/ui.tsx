"use client";

import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import * as api from "@/lib/api";

import { User } from "@/generated/openapi-client";

const CKEditor = dynamic(() => import("@/components/ckeditor"), { ssr: false });
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
};

interface Props {
  profile: User;
}

const UI = ({ profile }: Props) => {
  // 프로필 관련 State
  const [bio, setBio] = useState(profile.bio || "");
  const [name, setName] = useState(profile.name || "");
  const [image, setImage] = useState<string>(profile.image || "");

  // 로딩 State
  const [isUploading, setIsUploading] = useState(false);

  // 유저 프로필 수정
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await api.updateProfile({
        name,
        bio,
        image,
      });

      if (error) {
        throw new Error(error as string);
      }

      return data;
    },

    onSuccess: () => {
      toast.success("프로필 업데이트가 완료되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const uploadMediaResult = await api.uploadMedia(file);
      if (!uploadMediaResult.data || uploadMediaResult.error) {
        toast.error(uploadMediaResult.error as string);
        return;
      }
      setImage((uploadMediaResult.data as any).cloudFront.url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  // 저장 버튼 클릭 시 ( api 연동은 비워둠 )
  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfileMutation.mutate();
  };

  return (
    <div className="mt-10 max-w-xl rounded-lg bg-white p-8 shadow">
      <h2 className="mb-6 text-2xl font-bold">계정 설정</h2>
      <form onSubmit={handleSave} className="space-y-6">
        {/* 프로필 이미지 업로드 */}
        <div>
          <label className="block font-medium">프로필 이미지</label>
          <div
            {...getRootProps()}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-dashed p-4 text-center",
              isDragActive ? "border-primary" : "border-gray-300",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center py-4">
              {isUploading ? (
                <Loader2Icon className="size-10 animate-spin text-gray-400" />
              ) : image ? (
                <img
                  src={image}
                  alt="프로필 미리보기"
                  className="mx-auto mb-2 size-24 rounded-full border object-cover"
                />
              ) : (
                <ImageIcon className="mb-2 size-10 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {image
                  ? "클릭하여 변경"
                  : isDragActive
                    ? "이미지를 여기에 놓으세요"
                    : "클릭하거나 이미지를 드래그하여 업로드"}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            최대 5MB, jpg/png/gif 지원
          </p>
        </div>

        {/* 이름 */}
        <div>
          <label className="mb-2 block font-medium">이름</label>
          <Input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        {/* 자기소개 */}
        <div>
          <label className="mb-2 block font-medium">자기소개</label>
          <CKEditor value={bio} onChange={setBio} />
        </div>

        {/* 저장 버튼 */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="text-md w-full font-bold"
          >
            {updateProfileMutation.isPending ? (
              <Loader2Icon size={12} className="animate-spin" />
            ) : (
              <span>저장</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UI;
