import { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">
      <div className="aspect-video bg-blue-100 flex items-center justify-center">
        <span className="text-4xl font-extrabold text-gray-400">Курс</span>
      </div>
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2">
          {course.description || "Описание курса отсутствует."}
        </p>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-xs font-medium text-gray-600">
            Автор: {course.teacher_name}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(course.created_at).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>
    </div>
  );
}
