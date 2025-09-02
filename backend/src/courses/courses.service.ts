import { Course, Prisma } from '@prisma/client';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import slugify from 'lib/slugify';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SearchCourseDto } from './dto/search-course.dto';
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

  async findOne(
    id: string,
    include?: Prisma.CourseInclude,
  ): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include,
    });

    return course;
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
          id: category,
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
}
