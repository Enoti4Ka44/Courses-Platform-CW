import { getCurrentUser } from "@/actions/authActions";
import { getCourseDetails, isStudentEnrolled } from "@/actions/coursesActions";
import AssignmentForm from "@/components/assignment-form";
import AssignmentModal from "@/components/assignment-modal";
import EnrollButton from "@/components/enroll-button";
import MaterialForm from "@/components/material-form";
import MaterialModal from "@/components/material-modal";
import SubmissionForm from "@/components/submission-form";
import {
  FileText,
  Link as LinkIcon,
  Calendar,
  GraduationCap,
  PlusCircle,
  User,
} from "lucide-react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);
  const { course, materials, assignments } = await getCourseDetails(courseId);
  const { id: userId, role } = await getCurrentUser();

  if (!course) return <div className="p-10 text-center">Курс не найден</div>;

  const isTeacher = role === "teacher" && course.teacher_id === userId;
  const isEnrolled = userId && (await isStudentEnrolled(courseId, userId));

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white mb-8 shadow-xl">
        <h1 className="text-4xl font-black mb-4">{course.title}</h1>
        <p className="text-green-100 text-lg mb-6 max-w-2xl">
          {course.description}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
          <User size={18} />
          Преподаватель: {course.teacher_name}
        </div>
        {!isTeacher && !isEnrolled && userId && (
          <EnrollButton student_id={userId} course_id={courseId} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText /> Учебные материалы
          </h2>

          {isTeacher && <MaterialForm courseId={courseId} />}

          {materials.length > 0 ? (
            materials.map((mat: any) => (
              <div
                key={mat.id}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative"
              >
                {isTeacher && (
                  <MaterialModal material={mat} courseId={courseId} />
                )}

                <h3 className="text-xl font-bold text-slate-800 mb-2 pr-16">
                  {mat.title}
                </h3>
                <p className="text-slate-600 whitespace-pre-wrap mb-4">
                  {mat.content}
                </p>
                {mat.file_url && (
                  <a
                    href={mat.file_url}
                    className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline"
                  >
                    <LinkIcon size={16} /> Ссылка на ресурс
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">Материалов пока нет.</p>
          )}
        </div>
        {isEnrolled === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar /> Задания
            </h2>

            {isTeacher && <AssignmentForm courseId={courseId} />}

            {assignments.map((assign: any) => (
              <div
                key={assign.id}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative"
              >
                {isTeacher && (
                  <AssignmentModal assignment={assign} courseId={courseId} />
                )}

                <h4 className="font-bold text-slate-800 mb-1 pr-16">
                  {assign.title}
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                  {assign.description}
                </p>
                <div className="text-xs font-bold mb-4">
                  Срок: {new Date(assign.due_date).toLocaleDateString()}
                </div>

                {role === "student" && userId && (
                  <SubmissionForm assignmentId={assign.id} studentId={userId} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
