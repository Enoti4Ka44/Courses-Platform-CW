import { Course } from "@/types/course";
import { NotebookIcon } from "lucide-react";
import Link from "next/link";
import UnsubscribeButton from "./unsubscribe-button";

type CourseCardProps = {
  course: Course;
  studentId?: number;
};

export default function CourseCard({ course, studentId }: CourseCardProps) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="w-full overflow-hidden rounded-xl bg-muted">
        <div className="aspect-video w-full h-full flex items-center justify-center bg-green-700/10">
          <NotebookIcon className="w-10 h-10" />
        </div>
      </div>
      <div className="p-4">
        <Link href={`/courses/${course.id}`}>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 hover:text-green-600 transition">
            {course.title}
          </h3>
        </Link>
        <p className="mb-4 text-sm text-gray-500 line-clamp-2">
          {course.description || "Описание курса отсутствует."}
        </p>
        <div className="flex items-center justify-between border-t pt-4 text-gray-400 text-xs">
          <span className=" font-medium">Автор: {course.teacher_name}</span>
          <span>{new Date(course.created_at).toLocaleDateString("ru-RU")}</span>
        </div>
      </div>
      {studentId && (
        <div className="px-4 py-2">
          <UnsubscribeButton courseId={course.id} studentId={studentId} />
        </div>
      )}
    </div>
  );
}
