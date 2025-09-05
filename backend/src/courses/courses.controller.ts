import { Request } from 'express';
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

import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Course as CourseEntity } from 'src/_gen/prisma-class/course';
import { OptionalAccessTokenGuard } from 'src/auth/guards/optional-access-token.guard';
import { CourseFavorite as CourseFavoriteEntity } from 'src/_gen/prisma-class/course_favorite';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SearchCourseDto } from './dto/search-course.dto';
import { CourseDetailDto } from './dto/course-detail.dto';
import { GetFavoriteResponseDto } from './dto/favorite.dto';
import { SearchCourseResponseDto } from './dto/search-response.dto';
import { LectureActivity } from 'src/_gen/prisma-class/lecture_activity';

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
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강의 목록',
    type: CourseEntity,
    isArray: true,
  })
  findAllMyCourses(
    @Req() req: Request,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    if (!req.user) return;
    return this.coursesService.findAll({
      where: {
        instructorId: req.user.sub,
      },
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
  @UseGuards(OptionalAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강의 상세 정보',
    type: CourseDetailDto,
  })
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    if (!req.user) return;
    return this.coursesService.findOne(id, req.user.sub);
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

  @Post('search')
  @ApiOkResponse({
    description: '강의 검색',
    type: SearchCourseResponseDto,
  })
  search(@Body() searchCourseDto: SearchCourseDto) {
    return this.coursesService.searchCourses(searchCourseDto);
  }

  // 즐겨찾기 등록
  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  addFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    if (!req.user) return;
    return this.coursesService.addFavorite(id, req.user.sub);
  }

  // 즐겨찾기 삭제
  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  removeFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    if (!req.user) return;
    return this.coursesService.removeFavorite(id, req.user.sub);
  }

  // 개별 강의 즐겨찾기 조회
  @Get(':id/favorite')
  @UseGuards(OptionalAccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: GetFavoriteResponseDto })
  getFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getFavorite(id, req.user?.sub);
  }

  // 나의 모든 즐겨찾기 조회
  @Get('favorites/my')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: CourseFavoriteEntity, isArray: true })
  getMyFavorites(@Req() req: Request) {
    if (!req.user) return;
    return this.coursesService.getMyFavorites(req.user.sub);
  }

  // 강의 등록
  @Post(':id/enroll')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  enrollCourse(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    if (!req.user) return;
    return this.coursesService.enrollCourse(id, req.user.sub);
  }

  @Get(':courseId/activity')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '개별 강의 활동 이벤트 조회',
    type: LectureActivity,
    isArray: true,
  })
  getLectureActivity(@Req() req: Request, @Param('courseId') courseId: string) {
    if (!req.user) return;
    return this.coursesService.getAllLectureActivities(courseId, req.user.sub);
  }
}
