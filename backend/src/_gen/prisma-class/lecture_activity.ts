import { User } from './user';
import { Lecture } from './lecture';
import { ApiProperty } from '@nestjs/swagger';

export class LectureActivity {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  lectureId: string;

  @ApiProperty({ type: Number })
  progress: number;

  @ApiProperty({ type: Boolean })
  isCompleted: boolean;

  @ApiProperty({ type: Date })
  lastWatchedAt: Date;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Lecture })
  lecture: Lecture;
}
