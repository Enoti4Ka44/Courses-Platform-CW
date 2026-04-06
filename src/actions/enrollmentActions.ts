"use server";

import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

//Удалить студента с курса (для учителя)
export async function kickStudentFromCourse(
  courseId: number,
  studentId: number,
) {
  try {
    await query(
      "DELETE FROM public.enrollments WHERE course_id = $1 AND student_id = $2",
      [courseId, studentId],
    );

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при исключении студента:", error);
    return { success: false, error: "Не удалось исключить студента" };
  }
}

//Поступить на курс (для студента)
export async function enrollInCourse(courseId: number, studentId: number) {
  try {
    await query(
      "INSERT INTO enrollments (course_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [courseId, studentId],
    );

    revalidatePath("/profile");
    revalidatePath(`/courses/${courseId}`);

    return { success: true };
  } catch (error) {
    console.error("Ошибка при записи на курс:", error);
    return { success: false, error: "Не удалось записаться на курс" };
  }
}

//Отписаться от курса (для студента)
export async function unsubscribeFromCourse(
  courseId: number,
  studentId: number,
) {
  try {
    await query(
      "DELETE FROM public.enrollments WHERE course_id = $1 AND student_id = $2",
      [courseId, studentId],
    );

    revalidatePath("/profile");
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("Ошибка при отписке от курса:", error);
    return { success: false, error: "Не удалось отписаться от курса" };
  }
}
