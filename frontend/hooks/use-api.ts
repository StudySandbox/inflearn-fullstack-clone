"use client";

import * as api from "@/lib/api";
import { getCookie } from "cookies-next/client";

// 실제 로그인 시 쿠키에 있는 access token 이름
// production 환경에서는 __Secure-authjs.session-token으로 이름이 변경됨
const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

// 토큰을 심어주는 함수를 Hook으로 제공
export function useApi() {
  // 클라이언트에서 쿠키 가져오기
  const token = getCookie(AUTH_COOKIE_NAME) as string;

  return {
    getUserTest: () => api.getUserTest(token),
  };
}
