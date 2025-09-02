import { Request } from 'express';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { User as UserEntity } from 'src/_gen/prisma-class/user';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강의 수정',
    type: UserEntity,
  })
  getProfile(@Req() req: Request) {
    if (!req.user) return;
    return this.usersService.getProfile(req.user.sub);
  }
}
