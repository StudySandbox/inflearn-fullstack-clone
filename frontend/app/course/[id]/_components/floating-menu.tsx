import { useCallback } from "react";

import { getLevelText } from "@/lib/level";
import { formatSecondsToHourMin } from "@/lib/formats";
import { CourseDetailDto } from "@/generated/openapi-client";

interface Props {
  course: CourseDetailDto;
}

export const FloatingMenu = ({ course }: Props) => {
  const handleCart = useCallback(() => {
    alert("장바구니 기능은 준비 중입니다.");
  }, []);

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
          <button className="bg-primary w-full rounded-md px-4 py-2 font-semibold text-white">
            수강신청 하기
          </button>
          <button
            onClick={handleCart}
            className="w-full rounded-md border px-4 py-2 font-medium"
          >
            바구니에 담기
          </button>
          <button
            disabled
            className="text-muted-foreground w-full cursor-not-allowed rounded-md border px-4 py-2 font-medium"
          >
            즐겨찾기 (준비중)
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
