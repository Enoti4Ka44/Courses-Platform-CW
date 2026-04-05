import { getCurrentUser } from "@/actions/authActions";
import {
  getStudentCourses,
  getTeacherCourses,
  getTeacherStudents,
  getUserProfile,
} from "@/actions/profileActions";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile-form";
import CourseCard from "@/components/course-card";
import { Users, BookOpen, Trash, Trash2 } from "lucide-react";
import { Course } from "@/types/course";
import { CourseStudent } from "@/types/user";
import {
  kickStudentFromCourse,
  unsubscribeFromCourse,
} from "@/actions/enrollmentActions";
import KickButton from "@/components/kick-button";

export default async function ProfilePage() {
  const { id: currentUserId, role: currentUserRole } = await getCurrentUser();

  if (!currentUserId || !currentUserRole) {
    redirect("/");
  }

  const user = await getUserProfile(currentUserId, currentUserRole);
  if (!user) {
    return <div className="p-8 text-center">Пользователь не найден</div>;
  }

  let teacherCourses: Course[] = [];
  let teacherStudents: CourseStudent[] = [];
  let studentCourses: Course[] = [];

  if (currentUserRole === "teacher") {
    teacherCourses = await getTeacherCourses(currentUserId);
    teacherStudents = await getTeacherStudents(currentUserId);
  } else {
    studentCourses = await getStudentCourses(currentUserId);
  }

  const handleUnsubscribe = async (courseId: number, studentId: number) => {
    await unsubscribeFromCourse(courseId, studentId);
  };

  const handleKickStudent = async (courseId: number, studentId: number) => {
    await kickStudentFromCourse(courseId, studentId);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Мой профиль</h1>
      <ProfileForm user={user} role={currentUserRole} />

      {currentUserRole === "teacher" && (
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-green-600" />
              <h2 className="text-2xl font-bold text-slate-800">Мои курсы</h2>
            </div>

            {teacherCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teacherCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 bg-white p-6 rounded-2xl border border-slate-100">
                У вас пока нет созданных курсов.
              </p>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-green-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                Записанные студенты
              </h2>
            </div>

            {teacherStudents.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-medium">
                    <tr>
                      <th className="px-6 py-4">Имя студента</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Название курса</th>
                      <th className="px-6 py-4">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teacherStudents.map((student, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {student.full_name}
                        </td>
                        <td className="px-6 py-4">{student.email}</td>
                        <td className="px-6 py-4 text-green-600">
                          {student.course_title}
                        </td>
                        <td className="px-6 py-4">
                          <KickButton
                            courseId={student.course_id}
                            studentId={student.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 bg-white p-6 rounded-2xl border border-slate-100">
                На ваши курсы пока никто не записался.
              </p>
            )}
          </section>
        </div>
      )}

      {currentUserRole === "student" && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-800">Мое обучение</h2>
          </div>

          {studentCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {studentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  studentId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-lg text-slate-600 mb-4">
                Вы пока не записаны ни на один курс.
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors">
                Найти курсы
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
