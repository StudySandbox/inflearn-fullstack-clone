import { Request } from 'express';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user-test')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token') // access-token이 필요하다는 것을 의미
  testUser(@Req() req: Request) {
    return `유저 이메일: ${req.user?.email}`;
  }
}
