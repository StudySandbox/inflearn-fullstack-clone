import { User } from './user';
import { Course } from './course';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CourseReview {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: Number })
  rating: number;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  courseId: string;

  @ApiPropertyOptional({ type: String })
  instructorReply?: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Course })
  course: Course;
}
