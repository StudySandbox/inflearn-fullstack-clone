import { Request } from 'express';
import { Prisma } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Course as CourseEntity } from 'src/_gen/prisma-class/course';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('강의')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token') // Swagger를 위한 데코레이터
  @ApiOkResponse({
    description: '강의 생성',
    type: CourseEntity,
  })
  create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
    if (!req.user) return;
    return this.coursesService.create(req.user.sub, createCourseDto);
  }

  // @ApiQuery는 Swagger를 위한 데코레이터
  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiOkResponse({
    description: '강의 목록',
    type: CourseEntity,
    isArray: true,
  })
  findAll(
    @Query('title') title?: string,
    @Query('level') level?: string,
    @Query('categoryId') categoryId?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const where: Prisma.CourseWhereInput = {};

    if (title) {
      // title을 포함하는 모든 강의를 가져온다는 의미
      where.title = { contains: title, mode: 'insensitive' };
    }

    if (level) {
      // level에 해당하는 모든 강의를 가져온다는 의미
      where.level = level;
    }

    if (categoryId) {
      // 선택한 카테고리에 해당하는 모든 강의를 가져온다는 의미
      where.categories = {
        some: {
          id: categoryId,
        },
      };
    }

    return this.coursesService.findAll({
      where,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 강의 상세 조회
  // ParseUUIDPipe 는 Nest.js에서 기본제공하는 함수로
  // 값이 UUID인지를 검증하여 통과하면 UUID값을 가져옵니다.
  @Get(':id')
  @ApiQuery({
    name: 'include',
    required: false,
    description: 'sections, lectures, courseReviews 등 포함할 관계 지정',
  })
  @ApiOkResponse({
    description: '강의 상세 정보',
    type: CourseEntity,
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string,
  ) {
    const includeArray = include ? include.split(',') : undefined;

    let includeObject: Prisma.CourseInclude;

    if (
      includeArray?.includes('sections') &&
      includeArray?.includes('lectures')
    ) {
      const otherInclude = includeArray.filter(
        (item) => !['sections', 'lectures'].includes(item),
      );

      includeObject = {
        sections: {
          include: {
            lectures: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        ...otherInclude.map((item) => ({
          [item]: true,
        })),
      };
    } else {
      includeObject = {
        ...includeArray?.map((item) => ({
          [item]: true,
        })),
      } as Prisma.CourseInclude;
    }

    return this.coursesService.findOne(id, includeObject);
  }

  // 강의 수정
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강의 수정',
    type: CourseEntity,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    if (!req.user) return;
    return this.coursesService.update(id, req.user?.sub, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강의 삭제',
    type: CourseEntity,
  })
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    if (!req.user) return;
    return this.coursesService.delete(id, req.user.sub);
  }
}
