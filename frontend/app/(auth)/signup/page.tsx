"use client";

import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";

import { signUp } from "@/app/actions/auth-actions";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = await signUp({
      email,
      password,
    });

    if (result?.status === "ok") {
      redirect("/signin");
    }

    if (result?.message) {
      alert(result.message);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">회원가입</h1>
      <p className="text-gray-700">인프런에서 다양한 학습의 기회를 얻으세요</p>

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

        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input
          type="password"
          name="passwordConfirm"
          placeholder="********"
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          className="rounded-sm border-2 border-gray-300 p-2"
        />

        <button className="mt-5 cursor-pointer rounded-sm bg-green-500 p-2 font-bold text-white">
          회원가입
        </button>
        <Link href="/signin" className="text-center">
          로그인
        </Link>
      </form>
    </div>
  );
};

export default SignupPage;
