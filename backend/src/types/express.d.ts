import { Express } from 'express';

type JwtPayload = {
  sub: string;
  email?: string;
  name?: string;
  picture?: null;
  iat?: number;
};

// User는 JwtPayload 타입을 기반으로 동작하기 때문에 타입 재설정
declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}
