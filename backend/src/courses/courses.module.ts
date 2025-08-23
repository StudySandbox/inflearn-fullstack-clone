import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoursesController } from './courses.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
