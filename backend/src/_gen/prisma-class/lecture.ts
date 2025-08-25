import { LectureActivity } from './lecture_activity';
import { Course } from './course';
import { Section } from './section';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Lecture {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Number })
  order: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiPropertyOptional({ type: Number })
  duration?: number;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: String })
  courseId: string;

  @ApiProperty({ type: String })
  sectionId: string;

  @ApiProperty({ type: Boolean })
  isPreview: boolean;

  @ApiPropertyOptional({ type: Object })
  videoStorageInfo?: object;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ isArray: true, type: () => LectureActivity })
  activities: LectureActivity[];

  @ApiProperty({ type: () => Course })
  course: Course;

  @ApiProperty({ type: () => Section })
  section: Section;
}
