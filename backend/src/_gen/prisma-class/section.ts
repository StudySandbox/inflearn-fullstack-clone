import { Lecture } from './lecture';
import { Course } from './course';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Section {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  order: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: String })
  courseId: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ isArray: true, type: () => Lecture })
  lectures: Lecture[];

  @ApiProperty({ type: () => Course })
  course: Course;
}
