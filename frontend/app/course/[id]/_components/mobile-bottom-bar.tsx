import { ShoppingCartIcon } from "lucide-react";

import { CourseDetailDto } from "@/generated/openapi-client";

interface Props {
  course: CourseDetailDto;
}

export const MobileBottomBar = ({ course }: Props) => {
  const handleCart = () => {
    alert("장바구니 기능은 준비 중입니다.");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-4 border-t bg-white px-4 py-3 shadow lg:hidden">
      <div className="flex-1">
        {course.discountPrice ? (
          <>
            <span className="text-primary text-lg font-bold">
              {course.discountPrice.toLocaleString()}원
            </span>

            <span className="text-muted-foreground ml-2 text-sm line-through">
              {course.price.toLocaleString()}원
            </span>
          </>
        ) : (
          <span className="text-lg font-bold">
            {course.price.toLocaleString()}원
          </span>
        )}
      </div>

      <button className="bg-primary flex-1 rounded-md py-2 font-semibold text-white">
        수강신청
      </button>

      <button
        className="rounded-md border p-2 font-medium"
        onClick={handleCart}
        aria-label="장바구니에 담기"
      >
        <ShoppingCartIcon className="size-5" />
      </button>
    </div>
  );
};
