"use server";

import {
  UpdateCourseDto,
  coursesControllerCreate,
  coursesControllerUpdate,
  coursesControllerFindOne,
  coursesControllerFindAll,
  categoriesControllerFindAll,
} from "@/generated/openapi-client";

// 카테고리 가져오기
export const getAllCategories = async () => {
  const { data, error } = await categoriesControllerFindAll();

  return { data, error };
};

// 생성한 강의 리스트 조회
export const getAllInstructorCourses = async () => {
  const { data, error } = await coursesControllerFindAll();

  return { data, error };
};

export const getCourseById = async (id: string) => {
  const { data, error } = await coursesControllerFindOne({
    path: {
      id,
    },
  });

  return { data, error };
};

// 새 강의 생성
export const createCourse = async (title: string) => {
  const { data, error } = await coursesControllerCreate({
    body: {
      title,
    },
  });

  return { data, error };
};

// 강의 수정
export const updateCourse = async (
  id: string,
  updateCourseDto: UpdateCourseDto,
) => {
  const { data, error } = await coursesControllerUpdate({
    path: {
      id,
    },
    body: updateCourseDto,
  });

  return { data, error };
};
