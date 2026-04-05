import { getCourses } from "@/actions/coursesActions";
import CourseCard from "@/components/course-card";
import SortSelect from "@/components/sort-select";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const search =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;

  const sortOrder =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "newest";

  const courses = await getCourses(search, sortOrder);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {search ? `Результаты поиска: ${search}` : "Все курсы"}
        </h2>

        <SortSelect defaultValue={sortOrder} />
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">🔍</span>
          <p className="text-xl text-gray-500">
            По вашему запросу ничего не найдено
          </p>
        </div>
      )}
    </main>
  );
}
