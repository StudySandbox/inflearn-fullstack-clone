import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAccessTokenGuard extends AuthGuard('jwt-access-token') {
  handleRequest(err: any, user: any) {
    if (err || !user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
