import CourseList from "@/components/course-list";

interface Props {
  searchParams: Promise<{ q?: string; page_number?: string }>;
}

export const generatedMetadata = async ({ searchParams }: Props) => {
  const { q } = await searchParams;

  return {
    title: `인프런 - ${q} 검색 결과`,
    description: `인프런에서 ${q} 검색 결과를 찾아보세요.`,
  };
};

export default async function SearchPage({ searchParams }: Props) {
  const { q, page_number } = await searchParams;

  return (
    <div className="p-6">
      <CourseList q={q || ""} page={page_number ? parseInt(page_number) : 1} />
    </div>
  );
}
