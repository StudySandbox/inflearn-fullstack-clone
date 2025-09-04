import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Lecture as LectureEntity } from 'src/_gen/prisma-class/lecture';
import { LectureActivity as LectureActivityEntity } from 'src/_gen/prisma-class/lecture_activity';

import { LecturesService } from './lectures.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { UpdateLectureActivityDto } from './dto/update-lecture-activity.dto';

@ApiTags('개별 강의')
@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post('sections/:sectionId/lectures')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '새 강의 생성' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiBody({ type: CreateLectureDto })
  @ApiOkResponse({
    description: '강의 생성 성공',
    type: LectureEntity,
  })
  create(
    @Param('sectionId') sectionId: string,
    @Body() createLectureDto: CreateLectureDto,
    @Req() req: Request,
  ) {
    if (!req.user) return;
    return this.lecturesService.create(
      sectionId,
      createLectureDto,
      req.user.sub,
    );
  }

  @Get(':lectureId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 강의 상세 정보' })
  @ApiParam({ name: 'lectureId', description: '개별 강의 ID' })
  @ApiOkResponse({
    description: '개별 강의 상세 정보 조회',
    type: LectureEntity,
  })
  findOne(@Param('lectureId') lectureId: string, @Req() req: Request) {
    if (!req.user) return;
    return this.lecturesService.findOne(lectureId, req.user.sub);
  }

  @Patch(':lectureId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 강의 수정' })
  @ApiParam({ name: 'lectureId', description: '개별 강의 ID' })
  @ApiBody({ type: UpdateLectureDto })
  @ApiOkResponse({
    description: '개별 강의 수정 성공',
    type: LectureEntity,
  })
  update(
    @Param('lectureId') lectureId: string,
    @Body() updateLectureDto: UpdateLectureDto,
    @Req() req: Request,
  ) {
    if (!req.user) return;
    return this.lecturesService.update(
      lectureId,
      updateLectureDto,
      req.user.sub,
    );
  }

  @Delete(':lectureId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개별 강의 삭제' })
  @ApiParam({ name: 'lectureId', description: '개별 강의 ID' })
  @ApiOkResponse({
    description: '개별 강의 삭제 성공',
    type: LectureEntity,
  })
  delete(@Param('lectureId') lectureId: string, @Req() req: Request) {
    if (!req.user) return;
    return this.lecturesService.delete(lectureId, req.user.sub);
  }

  @Put(':lecutreId/activity')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '개별 강의 활동 이벤트 업데이트',
    type: LectureActivityEntity,
  })
  updateLectureActivity(
    @Req() req: Request,
    @Param('lectureId') lectureId: string,
    @Body() updateLectureActivityDto: UpdateLectureActivityDto,
  ) {
    if (!req.user) return;
    return this.lecturesService.updateLectureActivity(
      lectureId,
      req.user.sub,
      updateLectureActivityDto,
    );
  }

  @Get(':lectureId/activity')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '개별 강의 활동 이벤트 조회',
    type: LectureActivityEntity,
  })
  getLectureActivity(
    @Req() req: Request,
    @Param('lectureId') lectureId: string,
  ) {
    if (!req.user) return;
    return this.lecturesService.getLectureActivity(lectureId, req.user.sub);
  }
}
