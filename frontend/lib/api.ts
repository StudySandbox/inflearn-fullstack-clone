"use server";

/**
 * 모든 API 호출은 이곳에서 정의하고
 * 클라이언트에서는 쿠키를 가져오는 부분만 별도로 작성해서 함수와 사용
 */

import { cookies } from "next/headers";
import { getCookie } from "cookies-next/server";

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

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  } as Record<string, string>;

  // JWT 있는 경우
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Next.js는 기본적으로 API 캐싱이 됩니다.
  // Tanstack Query를 사용하는 경우는 별도의 캐싱이 이루어지므로
  // cache 옵션을 'no-store'로 설정합니다.
  const config: RequestInit = {
    ...options,
    headers,
    cache: "no-store",
  };

  // body가 있는 경우 문자열이 아니면 문자열로 파싱
  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  // 값이 비어있거나 json이 아닌 경우
  if (response.status === 204) {
    return {} as T;
  }

  // Content-Type 확인
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  } else {
    return response.text() as Promise<T>;
  }
}

export async function getUserTest(token?: string) {
  // 서버 컴포넌트에서 호출된 경우
  if (!token && typeof window === "undefined") {
    token = await getCookie(AUTH_COOKIE_NAME, { cookies });
  }

  // 테스트 API 호출
  return fetchApi<string>("/user-test", {}, token);
}
