"use client";

import Image from "next/image";
import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Course } from "@/generated/openapi-client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function UI({ courses }: { courses: Course[] }) {
  const router = useRouter();

  return (
    <div className="w-full p-6">
      <h1 className="mb-6 text-2xl font-bold">강의 관리</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이미지</TableHead>
            <TableHead>강의명</TableHead>
            <TableHead>평점</TableHead>
            <TableHead>총 수강생</TableHead>
            <TableHead>질문</TableHead>
            <TableHead>가격 (할인가)</TableHead>
            <TableHead>총 수입</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses && courses.length > 0 ? (
            courses.map((course: Course) => {
              const avgRating = 0; // 평점
              const totalStudents = 0; // 총 학생수
              const totalQuestions = 0; // 총 질문 수
              const price = course.price; // 가격
              const discountPrice = course.discountPrice; // 할인가격
              const totalRevenue = 0; // 총수익
              const status =
                course.status === "PUBLISHED" ? "게시중" : "임시저장";
              return (
                <TableRow key={course.id}>
                  <TableCell>
                    <Image
                      src={course.thumbnailUrl || "/logo/inflearn.png"}
                      alt={course.title}
                      width={80}
                      height={80}
                      className="rounded border bg-white object-contain"
                    />
                  </TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{avgRating}</TableCell>
                  <TableCell>{totalStudents}</TableCell>
                  <TableCell>{totalQuestions}</TableCell>
                  <TableCell>
                    {discountPrice ? (
                      <>
                        <span className="mr-1 text-gray-400 line-through">
                          ₩{price.toLocaleString()}
                        </span>
                        <span className="font-bold text-green-700">
                          ₩{discountPrice.toLocaleString()}
                        </span>
                      </>
                    ) : price ? (
                      `₩${price.toLocaleString()}`
                    ) : (
                      "미설정"
                    )}
                  </TableCell>
                  <TableCell>₩{totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell className="flex h-full flex-col justify-center gap-2">
                    <Button
                      onClick={() => {
                        const confirmed =
                          window.confirm("정말 삭제하시겠습니까?");
                        console.log(confirmed);
                      }}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="mr-1 h-4 w-4" /> 강의 삭제
                    </Button>
                    <Button
                      onClick={() =>
                        router.push(`/course/${course.id}/edit/course_info`)
                      }
                      variant="outline"
                      size="sm"
                    >
                      <Pencil className="mr-1 h-4 w-4" /> 강의 수정
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-400">
                강의가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
