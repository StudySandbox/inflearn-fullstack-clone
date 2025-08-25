import { User } from './user';
import { CourseQuestion } from './course_question';
import { ApiProperty } from '@nestjs/swagger';

export class CourseComment {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  questionId: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => CourseQuestion })
  question: CourseQuestion;
}
