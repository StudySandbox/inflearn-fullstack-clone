import CourseList from "@/components/course-list";

interface MetaProps {
  params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({ params }: MetaProps) => {
  const { slug } = await params;
  return {
    title: `인프런 - ${slug} 검색 결과`,
    description: `인프런에서 ${slug} 검색 결과를 찾아보세요.`,
  };
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page_number?: string }>;
}

const CoursesPage = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { page_number } = await searchParams;

  return (
    <div className="p-6">
      <CourseList
        category={slug || undefined}
        page={page_number ? parseInt(page_number) : 1}
      />
    </div>
  );
};

export default CoursesPage;
