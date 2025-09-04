import { User } from "next-auth";
import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import * as api from "@/lib/api";
import { getLevelText } from "@/lib/level";
import { formatSecondsToHourMin } from "@/lib/formats";
import { CourseDetailDto } from "@/generated/openapi-client";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  user?: User;
  course: CourseDetailDto;
}

export const FloatingMenu = ({ course, user }: Props) => {
  const getFavoriteQuery = useQuery({
    queryKey: ["favorite", course.id],
    queryFn: () => api.getFavorite(course.id),
  });

  const handleCart = useCallback(() => {
    alert("장바구니 기능은 준비 중입니다.");
  }, []);

  const addFavoriteMutation = useMutation({
    mutationFn: () => api.addFavorite(course.id),
    onSuccess: () => {
      getFavoriteQuery.refetch();
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: () => {
      return api.removeFavorite(course.id);
    },
    onSuccess: () => {
      getFavoriteQuery.refetch();
    },
  });

  const isFavoriteDisabled =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  const handleFavorite = useCallback(() => {
    if (user) {
      // toggle
      if (getFavoriteQuery.data?.data?.isFavorite) {
        removeFavoriteMutation.mutate();
      } else {
        addFavoriteMutation.mutate();
      }
    } else {
      alert("로그인 후 이용해주세요.");
    }
  }, [user, getFavoriteQuery, addFavoriteMutation, removeFavoriteMutation]);

  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
      <div className="w-80 rounded-md border">
        <div className="space-y-4 p-6">
          {/* 가격 */}
          <div>
            {course.discountPrice ? (
              <>
                <span className="text-primary text-2xl font-bold">
                  {course.discountPrice.toLocaleString()}원
                </span>
                <span className="text-muted-foreground ml-2 line-through">
                  {course.price.toLocaleString()}원
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {course.price.toLocaleString()}원
              </span>
            )}
          </div>

          <button className="bg-primary w-full cursor-pointer rounded-md px-4 py-2 font-semibold text-white">
            수강신청 하기
          </button>

          <button
            onClick={handleCart}
            className="w-full cursor-pointer rounded-md border px-4 py-2 font-medium"
          >
            바구니에 담기
          </button>

          <button
            disabled
            className={cn(
              "flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2 font-medium transition-colors",
              getFavoriteQuery.data?.data?.isFavorite
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "hover:bg-gray-50",
              isFavoriteDisabled && "cursor-not-allowed",
            )}
          >
            <HeartIcon
              className={cn(
                "size-4 transition-colors",
                getFavoriteQuery.data?.data?.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500",
                isFavoriteDisabled && "cursor-not-allowed",
              )}
            />
            {getFavoriteQuery.data?.data?.favoriteCount ?? 0}
          </button>
        </div>

        {/* info section */}
        <div className="space-y-1 rounded-b-md bg-[#F8F9FA] p-6 text-sm">
          <p>
            <strong>지식공유자:</strong> {course.instructor.name}
          </p>
          <p>
            <strong>강의 수:</strong> {course.totalLectures}개
          </p>
          <p>
            <strong>강의 시간:</strong>{" "}
            {formatSecondsToHourMin(course.totalDuration)}
          </p>
          <p>
            <strong>난이도:</strong> {getLevelText(course.level)}
          </p>
        </div>
      </div>
    </aside>
  );
};
