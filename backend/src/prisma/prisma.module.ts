import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// 프리즈마 서비스는 전역적으로 접근할 것이기 때문에
// @Global()이라는 데코레이터를 추가
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
