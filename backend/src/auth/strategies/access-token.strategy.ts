import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
  picture?: null;
  iat?: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token', // access-token.guard.ts에 AuthGuard에 추가한 값과 동일해야 합니다.
) {
  constructor() {
    // super를 활용해서 상속받은 PassportStrategy에 있는 constructor를 사용합니다.
    super({
      // 요청 헤더에 있는 'Authorization':'Bearer {accessToken}'을 자동으로 분석하는 역할
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // JWT의 만료를 무시할지 여부
      ignoreExpiration: false,

      // 암호화에 사용한 AUTH_SECRET
      secretOrKey: process.env.AUTH_SECRET!,
    });
  }

  // 토큰에 들어있는 정보가 유효한지 검증
  validate(payload: JwtPayload) {
    return payload;
  }
}
