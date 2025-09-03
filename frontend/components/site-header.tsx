"use client";

import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CourseCategory, User } from "@/generated/openapi-client";
import { CATEGORY_ICONS } from "@/app/constants/category-icons";

interface Props {
  session: Session | null;
  profile?: User;
  categories: CourseCategory[];
}

export default function SiteHeader({ session, profile, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");

  const isSiteHeaderNeeded = !pathname.includes("/course/");
  const isCategoryNeeded = pathname == "/" || pathname.includes("/courses");

  if (!isSiteHeaderNeeded) return null;

  return (
    <header className="site-header relative mx-auto w-7xl bg-white">
      {/* 상단 헤더 */}
      <div className="header-top flex items-center justify-between gap-4 px-8 py-3">
        {/* 로고 */}
        <div className="logo min-w-[120px]">
          <Link href="/">
            <Image
              src="/images/inflearn_public_logo.png"
              className="h-auto w-28"
              width={120}
              height={32}
              alt="inflearn"
            />
          </Link>
        </div>
        {/* 네비게이션 */}
        <nav className="main-nav flex gap-6 text-base font-bold text-gray-700">
          <Link href="#" className="transition-colors hover:text-[#1dc078]">
            강의
          </Link>
          <Link href="#" className="transition-colors hover:text-[#1dc078]">
            로드맵
          </Link>
          <Link href="#" className="transition-colors hover:text-[#1dc078]">
            멘토링
          </Link>
          <Link href="#" className="transition-colors hover:text-[#1dc078]">
            커뮤니티
          </Link>
        </nav>

        {/* 검색창 + 아이콘 */}
        <div className="flex flex-1 justify-center">
          <div className="relative flex w-full items-center">
            <Input
              type="text"
              placeholder="나의 진짜 성장을 도와줄 실무 강의를 찾아보세요"
              className="w-full border-gray-200 bg-gray-50 pr-10 focus-visible:ring-[#1dc078]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  router.push(`/search?q=${search.trim()}`);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2 p-1 text-gray-400 transition-colors hover:text-[#1dc078]"
              tabIndex={-1}
              onClick={() => router.push(`/search?q=${search.trim()}`)}
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </div>
        {/* 지식공유자 버튼 */}
        <Link href="/instructor">
          <Button
            variant="outline"
            className="border-gray-200 font-semibold hover:border-[#1dc078] hover:text-[#1dc078]"
          >
            지식공유자
          </Button>
        </Link>

        {/* Avatar + Popover */}
        {!session ? (
          /* 세션이 없다면 로그인 버튼 */
          <Link href="/signin">
            <Button
              variant="outline"
              className="ml-2 border-gray-200 font-semibold hover:border-[#1dc078] hover:text-[#1dc078]"
            >
              로그인
            </Button>
          </Link>
        ) : (
          /* 세션이 있다면 Popover */
          <Popover>
            <PopoverTrigger asChild>
              <div className="ml-2 cursor-pointer">
                <Avatar>
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt="avatar"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <AvatarFallback>
                      <span role="img" aria-label="user">
                        👤
                      </span>
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-56 p-0">
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="font-semibold text-gray-800">
                  {profile?.name || profile?.email || "내 계정"}
                </div>
                {profile?.email && (
                  <div className="mt-1 text-xs text-gray-500">
                    {profile.email}
                  </div>
                )}
              </div>
              <button
                className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:outline-none"
                onClick={() => (window.location.href = "/my/settings/account")}
              >
                <div className="font-semibold text-gray-800">프로필 수정</div>
              </button>
              <button
                className="w-full border-t border-gray-100 px-4 py-3 text-left hover:bg-gray-100 focus:outline-none"
                onClick={() => signOut()}
              >
                <div>로그아웃</div>
              </button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* 하단 카테고리 */}
      <div className="header-bottom category-nav flex justify-between gap-6 bg-white px-8">
        {isCategoryNeeded && (
          <nav className="category-nav scrollbar-none flex justify-between gap-6 overflow-x-auto py-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/courses/${category.slug}`}>
                <div className="category-item flex min-w-[72px] cursor-pointer flex-col items-center text-gray-700 transition-colors hover:text-[#1dc078]">
                  {React.createElement(
                    CATEGORY_ICONS[category.slug] || CATEGORY_ICONS["default"],
                    { size: 28, className: "mb-1" },
                  )}
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>
      <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2 border-b" />
    </header>
  );
}
