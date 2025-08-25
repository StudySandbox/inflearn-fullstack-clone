import { CourseComment } from './course_comment';
import { User } from './user';
import { Course } from './course';
import { ApiProperty } from '@nestjs/swagger';

export class CourseQuestion {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  courseId: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ isArray: true, type: () => CourseComment })
  comments: CourseComment[];

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Course })
  course: Course;
}
