import { User } from "@/generated/openapi-client";
import Image from "next/image";

const mockInstructorStats = {
  students: 1234,
  reviews: 56,
  courses: 3,
  answers: 10,
};

interface Props {
  instructor: User;
}

export const InstructorBio = ({ instructor }: Props) => {
  return (
    <>
      <hr className="my-12 border-t border-gray-200" />
      <section id="instructor" className="">
        <h2 className="mb-6 text-2xl font-bold">지식공유자 소개</h2>

        <div className="flex gap-4">
          {instructor.image && (
            <Image
              src={instructor.image}
              alt={instructor.name || "instructor"}
              width={80}
              height={80}
              className="size-20 rounded-full object-cover"
            />
          )}

          <div>
            <h3 className="mb-2 text-lg font-medium">{instructor.name}</h3>

            {instructor.bio && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: instructor.bio }}
              />
            )}

            <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
              <span>
                수강생 {mockInstructorStats.students.toLocaleString()}명
              </span>
              <span>수강평 {mockInstructorStats.reviews}개</span>
              <span>답변 {mockInstructorStats.answers}개</span>
              <span>강의 {mockInstructorStats.courses}개</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
