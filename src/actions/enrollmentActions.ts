"use server";

import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

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
