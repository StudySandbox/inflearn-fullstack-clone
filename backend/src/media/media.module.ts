import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        // 모든 파일 타입에 적용됨
        fileSize: 300 * 1024 * 1024, // 300MB
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
