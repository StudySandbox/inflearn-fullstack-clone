"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    label: "대시보드",
    href: "/instructor",
  },
  {
    label: "새 강의 만들기",
    href: "/create_courses",
  },
  {
    label: "강의 관리",
    href: "/instructor/courses",
  },
  {
    label: "미션 관리",
    href: "/instructor#",
  },
  {
    label: "멘토링 관리",
    href: "/instructor#",
  },
  {
    label: "강의 질문 관리",
    href: "/instructor#",
  },
  {
    label: "수강평 리스트",
    href: "/instructor#",
  },
  {
    label: "새소식 관리",
    href: "/instructor#",
  },
  {
    label: "수익 확인",
    href: "/instructor#",
  },
  {
    label: "쿠폰 관리",
    href: "/instructor#",
  },
];

export const InstructorSidebar = () => {
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState("");

  const alertPreparing = () => {
    alert("준비중입니다.");
  };

  return (
    <aside className="flex min-h-screen w-full max-w-[260px] flex-col gap-2 border-r bg-white p-4">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        const isPreparing = item.href.endsWith("#");

        return (
          <Button
            key={item.label}
            variant="link"
            className={cn(
              "w-full justify-start text-base font-medium",
              isActive ? "text-primary bg-white font-bold" : "text-green-700",
            )}
            onClick={isPreparing ? alertPreparing : undefined}
            asChild={!isPreparing}
          >
            {isPreparing ? (
              <span>{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </Button>
        );
      })}
    </aside>
  );
};
