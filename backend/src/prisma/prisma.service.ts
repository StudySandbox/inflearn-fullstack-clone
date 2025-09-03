import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      omit: {
        user: {
          hashedPassword: true,
        },
      },
    });
  }

  // 프리즈마 모듈이 처음 초기화될 때
  // this.connect 함수를 통해서 실제로 DB를 연결하겠다는 의미
  async onModuleInit() {
    await this.$connect();
  }
}
