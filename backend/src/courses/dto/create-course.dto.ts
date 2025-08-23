import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsArray,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateCourseDto {
  // @ApiProperty는 사용 시 실제 Swagger 문서에도 해당 타이틀에 대한 설명이 따라붙음
  // @IsString은 해당 DTO 값을 검증할 때 사용하는 class-validator의 클래스
  // @IsUUID의 경우 버전을 처음에 명시하는데 값을 넣을 필요없기 때문에 undefined를 할당
  @ApiProperty({ description: '강의 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '강의 슬러그(URL에 사용됨)' })
  @IsString()
  slug: string;

  @ApiProperty({ description: '강의 1~2줄의 짧은 설명' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ description: '강의 상세페이지 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '썸네일 이미지 URL' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: '강의 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '강의 할인 가격' })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ description: '강의 난이도' })
  @IsBoolean()
  @IsOptional()
  level?: string;

  @ApiProperty({ description: '강의 게시 여부' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ description: '강의 카테고리 ID 목록' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[];
}
