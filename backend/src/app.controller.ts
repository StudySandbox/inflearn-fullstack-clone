import { Request } from 'express';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/access-token.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user-test')
  @UseGuards(AccessTokenGuard)
  testUser(@Req() req: Request) {
    // AUTH_SECRET으로 해독한 유저 정보를 출력
    console.log(req.user);
    return 'test completed';
  }
}
