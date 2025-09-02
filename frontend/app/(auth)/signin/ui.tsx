"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

const UI = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 로그인 진행
    signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">로그인</h1>
        <p className="text-gray-700">인프런 계정으로 로그인할 수 있어요</p>

        <form onSubmit={onSubmit} className="flex min-w-[300px] flex-col gap-2">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            name="email"
            placeholder="example@inflab.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-sm border-2 border-gray-300 p-2"
          />

          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-sm border-2 border-gray-300 p-2"
          />

          <button className="mt-5 cursor-pointer rounded-sm bg-green-500 p-2 font-bold text-white">
            로그인
          </button>
          <Link href="/signup" className="text-center">
            회원가입
          </Link>
        </form>
      </div>
    </>
  );
};

export default UI;
