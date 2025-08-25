import { Course } from './course';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CourseCategory {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiPropertyOptional({ type: String })
  description?: string;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ isArray: true, type: () => Course })
  course: Course[];
}
