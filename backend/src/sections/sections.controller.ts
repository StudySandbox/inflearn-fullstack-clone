import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Section as SectionEntity } from 'src/_gen/prisma-class/section';

import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@ApiTags('섹션')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post('courses/:courseId/sections')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '새 섹션 생성' })
  @ApiParam({ name: 'courseId', description: '강의 ID' })
  @ApiBody({ type: CreateSectionDto })
  @ApiResponse({
    description: '섹션 생성 성공',
    type: SectionEntity,
  })
  create(
    @Param('courseId') courseId: string,
    @Body() createSectionDto: CreateSectionDto,
    @Req() req: Request,
  ) {
    if (!req.user) return;

    return this.sectionsService.create(
      courseId,
      createSectionDto,
      req.user.sub,
    );
  }

  @Get(':sectionId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 상세 정보' })
  @ApiParam({ name: 'sectionId', description: '섹션ID' })
  @ApiOkResponse({
    description: '섹션 상세 정보',
    type: SectionEntity,
  })
  findOne(@Param('sectionId') sectionId: string, @Req() req: Request) {
    if (!req.user) return;
    return this.sectionsService.findOne(sectionId, req.user.sub);
  }

  @Patch(':sectionId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 업데이트' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiBody({ type: UpdateSectionDto })
  @ApiOkResponse({ description: '섹션 업데이트 성공', type: SectionEntity })
  update(
    @Param('sectionId') sectionId: string,
    @Body() updatedSectionDto: UpdateSectionDto,
    @Req() req: Request,
  ) {
    if (!req.user) return;
    return this.sectionsService.update(
      sectionId,
      updatedSectionDto,
      req.user.sub,
    );
  }

  @Delete(':sectionId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '섹션 삭제' })
  @ApiParam({ name: 'sectionId', description: '섹션 ID' })
  @ApiOkResponse({
    description: '섹션 삭제 성공',
    type: SectionEntity,
  })
  delete(@Param('sectionId') sectionId: string, @Req() req: Request) {
    if (!req.user) return;
    return this.sectionsService.delete(sectionId, req.user.sub);
  }
}
