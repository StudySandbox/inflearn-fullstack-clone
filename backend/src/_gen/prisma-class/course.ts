import { Section } from './section';
import { Lecture } from './lecture';
import { CourseReview } from './course_review';
import { CourseQuestion } from './course_question';
import { CourseCategory } from './course_category';
import { CourseEnrollment } from './course_enrollment';
import { User } from './user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Course {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Number })
  price: number;

  @ApiProperty({ type: String })
  level: string = 'BEGINNER';

  @ApiProperty({ type: String })
  status: string = 'DRAFT';

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: Boolean })
  isPublished: boolean;

  @ApiProperty({ type: String })
  instructorId: string;

  @ApiPropertyOptional({ type: String })
  thumbnailUrl?: string;

  @ApiPropertyOptional({ type: Number })
  discountPrice?: number;

  @ApiPropertyOptional({ type: String })
  shortDescription?: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ isArray: true, type: () => Section })
  sections: Section[];

  @ApiProperty({ isArray: true, type: () => Lecture })
  lectures: Lecture[];

  @ApiProperty({ isArray: true, type: () => CourseReview })
  reviews: CourseReview[];

  @ApiProperty({ isArray: true, type: () => CourseQuestion })
  questions: CourseQuestion[];

  @ApiProperty({ isArray: true, type: () => CourseCategory })
  categories: CourseCategory[];

  @ApiProperty({ isArray: true, type: () => CourseEnrollment })
  enrollments: CourseEnrollment[];

  @ApiProperty({ type: () => User })
  instructor: User;
}
