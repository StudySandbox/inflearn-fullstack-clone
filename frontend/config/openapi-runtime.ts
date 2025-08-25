import { cookies } from "next/headers";
import { getCookie } from "cookies-next/server";

import { CreateClientConfig } from "@/generated/openapi-client/client.gen";

// 실제 로그인 시 쿠키에 있는 access token 이름
// production 환경에서는 __Secure-authjs.session-token으로 이름이 변경됨
const AUTH_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

// Nest.js Backend를 바라볼 API URL을 작성
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.API_URL
    : "http://localhost:8000";

// 형식에 맞춰야 하므로 오타 주의
export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: API_URL,
  auth: async () => {
    return await getCookie(AUTH_COOKIE_NAME, { cookies });
  },
});
