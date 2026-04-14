"use server";

import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

// Запрос на получение всех пользователей
export async function getAllUsers() {
  const studentsRes = await query(
    `SELECT id, full_name, email, 'student' as role, created_at FROM students`,
  );
  const teachersRes = await query(
    `SELECT id, full_name, email, 'teacher' as role, created_at FROM teachers`,
  );

  const allUsers = [...studentsRes.rows, ...teachersRes.rows];

  return allUsers;
}

// Запрос на удаление пользователя
export async function adminDeleteUser(id: number, role: string) {
  try {
    if (role === "student") {
      await query("DELETE FROM students WHERE id = $1", [id]);
    } else if (role === "teacher") {
      await query("DELETE FROM teachers WHERE id = $1", [id]);
    }
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Ошибка удаления пользователя:", error);
    return {
      success: false,
      error: "Ошибка базы данных (возможно, есть связанные данные)",
    };
  }
}

// Запрос на получение всех курсов
export async function getAllCoursesAdmin() {
  const res = await query(
    `SELECT c.*, t.full_name as teacher_name 
     FROM courses c 
     JOIN teachers t ON c.teacher_id = t.id 
     ORDER BY c.created_at DESC`,
  );
  return res.rows;
}

// Запрос на удаление курса
export async function adminDeleteCourse(courseId: number) {
  try {
    await query("DELETE FROM courses WHERE id = $1", [courseId]);
    revalidatePath("/admin");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Ошибка удаления курса:", error);
    return { success: false, error: "Не удалось удалить курс" };
  }
}

//Запрос на создание пользователя (студента или учителя)
export async function adminCreateUser(formData: {
  full_name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}) {
  try {
    const { full_name, email, password, role } = formData;

    if (role === "student") {
      await query(
        "INSERT INTO students (full_name, email, password_hash) VALUES ($1, $2, $3)",
        [full_name, email, password],
      );
    } else {
      await query(
        "INSERT INTO teachers (full_name, email, password_hash) VALUES ($1, $2, $3)",
        [full_name, email, password],
      );
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    return { success: false, error: "Email уже занят или произошла ошибка БД" };
  }
}
