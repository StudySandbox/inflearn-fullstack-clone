"use server";

import {
  categoriesControllerFindAll,
  coursesControllerFindAll,
} from "@/generated/openapi-client";

// 카테고리 가져오기
export const getAllCategories = async () => {
  const { data, error } = await categoriesControllerFindAll();

  return { data, error };
};

export const getAllInstructorCourses = async () => {
  const { data, error } = await coursesControllerFindAll();

  return { data, error };
};
