import { Request } from 'express';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';

import { User as UserEntity } from 'src/_gen/prisma-class/user';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch('profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '강의 수정',
    type: UserEntity,
  })
  updateProfile(@Req() req: Request, @Body() UpdateUserDto: UpdateUserDto) {
    if (!req.user) return;
    return this.usersService.updateProfile(req.user.sub, UpdateUserDto);
  }
}
