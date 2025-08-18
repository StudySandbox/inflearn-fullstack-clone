import Link from "next/link";
import { signOut } from "@/auth";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <p>로그인 된 유저 정보</p>
      <p>이메일: {session?.user?.email}</p>

      {/* 로그아웃 */}
      {session?.user ? (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="cursor-pointer rounded-sm bg-red-200 px-2"
          >
            로그아웃
          </button>
        </form>
      ) : (
        <Link
          href="/signin"
          className="cursor-pointer underline-offset-1 hover:underline"
        >
          로그인
        </Link>
      )}
    </div>
  );
}
