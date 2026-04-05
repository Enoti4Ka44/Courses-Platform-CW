"use server";

import { query } from "@/utils/db";
import { CourseStudent, User } from "@/types/user";
import { Course } from "@/types/course";

export async function getUserProfile(
  userId: number,
  role: "teacher" | "student",
): Promise<User | null> {
  const tableName = role === "teacher" ? "teachers" : "students";
  const res = await query<User>(
    `SELECT id, full_name, email FROM ${tableName} WHERE id = $1`,
    [userId],
  );
  return res.rows[0] || null;
}

export async function updateUserProfile(
  userId: number,
  role: "teacher" | "student",
  fullName: string,
  email: string,
) {
  const tableName = role === "teacher" ? "teachers" : "students";
  await query(
    `UPDATE ${tableName} SET full_name = $1, email = $2 WHERE id = $3`,
    [fullName, email, userId],
  );
}

export async function getTeacherCourses(teacherId: number) {
  const res = await query<Course>(
    `
    SELECT c.*, t.full_name as teacher_name
    FROM courses c
    JOIN teachers t ON c.teacher_id = t.id
    WHERE c.teacher_id = $1
    ORDER BY c.created_at DESC
  `,
    [teacherId],
  );
  return res.rows;
}

export async function getTeacherStudents(teacherId: number) {
  const res = await query<CourseStudent>(
    `
    SELECT s.*, c.title as course_title, c.id as course_id
    FROM students s
    JOIN enrollments e ON s.id = e.student_id
    JOIN courses c ON e.course_id = c.id
    WHERE c.teacher_id = $1
    ORDER BY c.title ASC, s.full_name ASC
  `,
    [teacherId],
  );
  return res.rows;
}

export async function getStudentCourses(studentId: number) {
  const res = await query<Course>(
    `
    SELECT c.*, t.full_name as teacher_name
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    JOIN teachers t ON c.teacher_id = t.id
    WHERE e.student_id = $1
    ORDER BY e.id DESC -- Сортируем по дате записи (если есть id в enrollments)
  `,
    [studentId],
  );
  return res.rows;
}
