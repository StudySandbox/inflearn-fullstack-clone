"use server";

import {
  UpdateUserDto,
  UpdateCourseDto,
  SearchCourseDto,
  UpdateLectureDto,
  coursesControllerCreate,
  coursesControllerUpdate,
  coursesControllerFindOne,
  coursesControllerFindAll,
  sectionsControllerCreate,
  sectionsControllerDelete,
  lecturesControllerCreate,
  lecturesControllerDelete,
  sectionsControllerUpdate,
  lecturesControllerUpdate,
  coursesControllerSearch,
  usersControllerGetProfile,
  mediaControllerUploadMedia,
  categoriesControllerFindAll,
  usersControllerUpdateProfile,
  coursesControllerAddFavorite,
  coursesControllerGetFavorite,
  coursesControllerRemoveFavorite,
  coursesControllerGetMyFavorites,
  coursesControllerEnrollCourse,
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

// 섹션 생성
export const createSection = async (courseId: string, title: string) => {
  const { data, error } = await sectionsControllerCreate({
    path: {
      courseId,
    },
    body: {
      title,
    },
  });

  return { data, error };
};

// 섹션 삭제
export const deleteSection = async (sectionId: string) => {
  const { data, error } = await sectionsControllerDelete({
    path: {
      sectionId,
    },
  });

  return { data, error };
};

// 세부 강의 생성
export const createLecture = async (sectionId: string, title: string) => {
  const { data, error } = await lecturesControllerCreate({
    path: {
      sectionId,
    },
    body: {
      title,
    },
  });

  return { data, error };
};

// 세부 강의 삭제
export const deleteLecture = async (lectureId: string) => {
  const { data, error } = await lecturesControllerDelete({
    path: {
      lectureId,
    },
  });

  return { data, error };
};

// 섹션 제목 수정
export const updateSectionTitle = async (sectionId: string, title: string) => {
  const { data, error } = await sectionsControllerUpdate({
    path: {
      sectionId,
    },
    body: {
      title,
    },
  });

  return { data, error };
};

// 세부 강의 미리보기 수정
export const updateLecturePreview = async (
  lectureId: string,
  isPreview: boolean,
) => {
  const { data, error } = await lecturesControllerUpdate({
    path: {
      lectureId,
    },
    body: {
      isPreview,
    },
  });

  return { data, error };
};

// 세부 강의 수정
export const updateLecture = async (
  lectureId: string,
  updateLectureDto: UpdateLectureDto,
) => {
  const { data, error } = await lecturesControllerUpdate({
    path: {
      lectureId,
    },
    body: updateLectureDto,
  });

  return { data, error };
};

// 미디어 업로드
export const uploadMedia = async (file: File) => {
  const { data, error } = await mediaControllerUploadMedia({
    body: {
      file,
    },
  });

  return { data, error };
};

export const getProfile = async () => {
  const { data, error } = await usersControllerGetProfile();

  return { data, error };
};

export const updateProfile = async (updateUserDto: UpdateUserDto) => {
  const { data, error } = await usersControllerUpdateProfile({
    body: updateUserDto,
  });

  return { data, error };
};

export const searchCourses = async (searchCourseDto: SearchCourseDto) => {
  const { data, error } = await coursesControllerSearch({
    body: searchCourseDto,
  });

  return { data, error };
};

export const addFavorite = async (courseId: string) => {
  const { data, error } = await coursesControllerAddFavorite({
    path: {
      id: courseId,
    },
  });

  return { data, error };
};

export const removeFavorite = async (courseId: string) => {
  const { data, error } = await coursesControllerRemoveFavorite({
    path: {
      id: courseId,
    },
  });

  return { data, error };
};

export const getFavorite = async (courseId: string) => {
  const { data, error } = await coursesControllerGetFavorite({
    path: {
      id: courseId,
    },
  });

  return { data, error };
};

export const getMyFavorite = async () => {
  const { data, error } = await coursesControllerGetMyFavorites();

  return { data, error };
};

export const enrollCourse = async (courseId: string) => {
  const { data, error } = await coursesControllerEnrollCourse({
    path: {
      id: courseId,
    },
  });

  return { data, error };
};
