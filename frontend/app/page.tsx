import Link from "next/link";
import { Metadata } from "next";

import { signOut, auth } from "@/auth";

export const metadata: Metadata = {
  title: "인프런 - 라이프타임 커리어 플랫폼",
  description: "인프런은 라이프타임 커리어 플랫폼입니다.",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white">
      <span className="mb-4 text-6xl" style={{ color: "#00C471" }}>
        🎉
      </span>
      <h1 className="mb-2 text-3xl font-bold" style={{ color: "#00C471" }}>
        Part 2
      </h1>
    </div>
  );
}
