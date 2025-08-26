"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayersIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseCategory } from "@/generated/openapi-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SiteHeader({
  categories,
}: {
  categories: CourseCategory[];
}) {
  const pathname = usePathname();
  const isCategoryNeeded = pathname == "/" || pathname.includes("/courses");

  return (
    <header className="site-header mx-auto w-7xl border-b bg-white">
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
          <div className="relative flex w-full max-w-xl items-center">
            <Input
              type="text"
              placeholder="나의 진짜 성장을 도와줄 실무 강의를 찾아보세요"
              className="w-full border-gray-200 bg-gray-50 pr-10 focus-visible:ring-[#1dc078]"
            />
            <button
              type="button"
              className="absolute right-2 p-1 text-gray-400 transition-colors hover:text-[#1dc078]"
              tabIndex={-1}
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
        {/* Avatar */}
        <Avatar className="ml-2">
          <AvatarFallback>
            <span role="img" aria-label="user">
              👤
            </span>
          </AvatarFallback>
        </Avatar>
      </div>
      {/* 하단 카테고리 */}
      <div className="header-bottom bg-white px-8">
        {isCategoryNeeded && (
          <nav className="category-nav scrollbar-none flex gap-6 overflow-x-auto py-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/courses/${category.slug}`}>
                <div className="category-item flex min-w-[72px] cursor-pointer flex-col items-center text-gray-700 transition-colors hover:text-[#1dc078]">
                  <LayersIcon size={28} className="mb-1" />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
