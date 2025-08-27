"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EditCourseHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex items-center gap-2">
        <Button size="lg">제출</Button>
        <Button size="lg" variant="outline">
          <XIcon size={20} />
        </Button>
      </div>
    </header>
  );
}
