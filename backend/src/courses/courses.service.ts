import { Course, Prisma } from '@prisma/client';

import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import slugify from 'lib/slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseFavorite as CourseFavoriteEntity } from 'src/_gen/prisma-class/course_favorite';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SearchCourseDto } from './dto/search-course.dto';
import { CourseDetailDto } from './dto/course-detail.dto';
import { GetFavoriteResponseDto } from './dto/favorite.dto';
import { SearchCourseResponseDto } from './dto/search-response.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        slug: slugify(createCourseDto.title),
        instructorId: userId,
        status: 'DRAFT',
      },
    });
  }

  // cursor의 경우 어디까지 봤는지를 의미하는 값
  // where 조건을 유니크하게 만들 수 있는 타입을 프리즈마에서 제공
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.course.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: string, userId?: string): Promise<CourseDetailDto | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        categories: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        enrollments: true,
        sections: {
          include: {
            lectures: {
              select: {
                id: true,
                title: true,
                isPreview: true,
                duration: true,
                order: true,
                videoStorageInfo: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            lectures: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    const isInstructor = course.instructorId === userId;
    const isEnrolled = userId
      ? !!(await this.prisma.courseEnrollment.findFirst({
          where: {
            userId,
            courseId: id,
          },
        }))
      : false;

    const averageRating =
      course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) /
          course.reviews.length
        : 0;

    const totalDuration = course.sections.reduce(
      (sum, section) =>
        sum +
        section.lectures.reduce(
          (lecSum, lecture) => lecSum + (lecture.duration || 0),
          0,
        ),
      0,
    );

    const sectionsWithFilteredVideoStorageInfo = course.sections.map(
      (section) => ({
        ...section,
        lectures: section.lectures.map((lecture) => ({
          ...lecture,
          videoStorageInfo:
            isInstructor || isEnrolled || lecture.isPreview
              ? lecture.videoStorageInfo
              : null,
        })),
      }),
    );

    const result = {
      ...course,
      sections: sectionsWithFilteredVideoStorageInfo,
      isEnrolled,
      totalEnrollments: course._count.enrollments,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: course._count.reviews,
      totalLectures: course._count.lectures,
      totalDuration,
    };

    return result as unknown as CourseDetailDto;
  }

  async update(
    id: string,
    userId: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${id} 코스를 찾을 수 없습니다.`);
    }

    const { categoryIds, ...otherData } = updateCourseDto;
    const data: Prisma.CourseUpdateInput = {
      ...otherData,
    };

    if (course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 수정할 수 있습니다.');
    }

    // connect는 기존의 categoryId와 매핑을 지어주는 것
    // connectOrCreate는 기존의 categoryId와 매핑을 지어주고 없으면 만드는 것
    if (categoryIds && categoryIds.length > 0) {
      data.categories = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${id} 코스를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 삭제할 수 있습니다.');
    }

    await this.prisma.course.delete({
      where: { id },
    });

    return course;
  }

  async searchCourses(
    searchCourseDto: SearchCourseDto,
  ): Promise<SearchCourseResponseDto> {
    const { q, category, priceRange, sortBy, order, page, pageSize } =
      searchCourseDto;
    const where: Prisma.CourseWhereInput = {};

    if (q) {
      where.OR = [
        // title에 포함된 키워드
        {
          title: {
            contains: q,
            mode: 'insensitive',
          },
        },

        // instructor(지식공유자) 이름이 포함된 키워드
        {
          instructor: {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          slug: category,
        },
      };
    }

    if (priceRange) {
      const priceConditions: Prisma.IntFilter = {};
      if (priceRange.min !== undefined) {
        priceConditions.gte = priceRange.min;
      }

      if (priceRange.max !== undefined) {
        priceConditions.lte = priceRange.max;
      }

      if (Object.keys(priceConditions).length > 0) {
        where.price = priceConditions;
      }
    }

    const orderBy: Prisma.CourseOrderByWithRelationInput = {};

    if (sortBy === 'price') {
      orderBy.price = order as 'asc' | 'desc';
    } else {
      // 기본 정렬: 생성일 기준 내림차순
      orderBy.createdAt = 'desc';
    }

    const currentPage = page || 1;
    const currentPageSize = pageSize || 20;
    const skip = (currentPage - 1) * currentPageSize;
    const totalItems = await this.prisma.course.count({ where });
    const courses = await this.prisma.course.findMany({
      where,
      orderBy,
      skip,
      take: currentPageSize,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalItems / currentPageSize);

    return {
      // TODO:type error 수정하기
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      courses: courses as any[],
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  async addFavorite(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingFavorite = await this.prisma.courseFavorite.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      if (existingFavorite) return true;

      await this.prisma.courseFavorite.create({
        data: {
          userId,
          courseId,
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async removeFavorite(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingFavorite = await this.prisma.courseFavorite.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      if (existingFavorite) {
        await this.prisma.courseFavorite.delete({
          where: {
            id: existingFavorite.id,
          },
        });

        return true;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFavorite(
    courseId: string,
    userId?: string,
  ): Promise<GetFavoriteResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('강의를 찾지 못했습니다.');
    }

    if (userId) {
      const existingFavorite = await this.prisma.courseFavorite.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      return {
        isFavorite: !!existingFavorite,
        favoriteCount: course._count.favorites,
      };
    } else {
      return {
        isFavorite: false,
        favoriteCount: course._count.favorites,
      };
    }
  }

  async getMyFavorites(userId: string): Promise<CourseFavoriteEntity[]> {
    const existingFavorite = await this.prisma.courseFavorite.findMany({
      where: {
        userId,
      },
    });

    return existingFavorite as unknown as CourseFavoriteEntity[];
  }

  async enrollCourse(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingEnrollment = await this.prisma.courseEnrollment.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      if (existingEnrollment) {
        throw new ConflictException('이미 수강신청한 강의입니다.');
      }

      await this.prisma.courseEnrollment.create({
        data: {
          userId,
          courseId,
          enrolledAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllLectureActivities(courseId: string, userId: string) {
    const courseActivities = await this.prisma.lectureActivity.findMany({
      where: {
        userId,
        courseId,
      },
    });

    return courseActivities;
  }
}
