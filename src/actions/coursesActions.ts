"use server";

import { Assignment, Course, Material } from "@/types/course";
import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

// Получить все курсы
export async function getCourses(
  searchQuery?: string,
  sort?: string,
): Promise<Course[]> {
  let sql = `
    SELECT c.*, t.full_name as teacher_name
    FROM public.courses c
    JOIN public.teachers t ON c.teacher_id = t.id
    WHERE 1=1
  `;

  const params: any[] = [];

  if (searchQuery) {
    params.push(`%${searchQuery}%`);
    sql += ` AND (c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
  }

  if (sort === "oldest") {
    sql += ` ORDER BY c.created_at ASC`;
  } else {
    sql += ` ORDER BY c.created_at DESC`;
  }

  const result = await query<Course>(sql, params);
  return result.rows;
}

// Получить курс по id для страницы самого курса (с материалами и заданиями)
export async function getCourseDetails(courseId: number) {
  const courseRes = await query<Course>(
    `
    SELECT c.*, t.full_name as teacher_name 
    FROM courses c 
    JOIN teachers t ON c.teacher_id = t.id 
    WHERE c.id = $1`,
    [courseId],
  );

  const materialsRes = await query<Material[]>(
    `SELECT * FROM materials WHERE course_id = $1 ORDER BY id ASC`,
    [courseId],
  );
  const assignmentsRes = await query<Assignment[]>(
    `SELECT * FROM assignments WHERE course_id = $1 ORDER BY id ASC`,
    [courseId],
  );

  return {
    course: courseRes.rows[0],
    materials: materialsRes.rows,
    assignments: assignmentsRes.rows,
  };
}

// Создать курс
export async function createCourse(
  teacherId: number,
  title: string,
  description: string,
) {
  try {
    const res = await query(
      "INSERT INTO courses (teacher_id, title, description) VALUES ($1, $2, $3) RETURNING id",
      [teacherId, title, description],
    );

    revalidatePath("/profile");
    revalidatePath("/courses");

    return { success: true, courseId: res.rows[0].id };
  } catch (error) {
    console.error("Ошибка при создании курса:", error);
    return { success: false, error: "Не удалось создать курс" };
  }
}

// Добавить материал (для учителя)
export async function addMaterial(
  courseId: number,
  title: string,
  content: string,
  fileUrl?: string,
) {
  await query(
    "INSERT INTO materials (course_id, title, content, file_url) VALUES ($1, $2, $3, $4)",
    [courseId, title, content, fileUrl || null],
  );
}

// Добавить задание (для учителя)
export async function addAssignment(
  courseId: number,
  title: string,
  description: string,
  dueDate: string,
) {
  await query(
    "INSERT INTO assignments (course_id, title, description, due_date) VALUES ($1, $2, $3, $4)",
    [courseId, title, description, dueDate],
  );
}

// Сдать задание (для студента)
export async function submitAssignment(
  assignmentId: number,
  studentId: number,
  content: string,
  fileUrl?: string,
) {
  await query(
    `INSERT INTO submissions (assignment_id, student_id, content, file_url) 
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (assignment_id, student_id) 
     DO UPDATE SET 
        content = EXCLUDED.content, 
        file_url = EXCLUDED.file_url,
        submitted_at = CURRENT_TIMESTAMP`,
    [assignmentId, studentId, content, fileUrl || null],
  );
}

// Проверка является ли пользователь студентом этого курса
export async function isStudentEnrolled(courseId: number, studentId: number) {
  const res = await query(
    "SELECT 1 FROM enrollments WHERE course_id = $1 AND student_id = $2",
    [courseId, studentId],
  );
  return res.rowCount;
}

// Удалить материал (для учителя)
export async function deleteMaterial(id: number, courseId: number) {
  await query("DELETE FROM materials WHERE id = $1", [id]);
}

// Удалить задание (для учителя)
export async function deleteAssignment(id: number, courseId: number) {
  await query("DELETE FROM assignments WHERE id = $1", [id]);
}

// Обновить материал (для учителя)
export async function updateMaterial(
  id: number,
  courseId: number,
  title: string,
  content: string,
  fileUrl: string,
) {
  await query(
    "UPDATE materials SET title = $1, content = $2, file_url = $3 WHERE id = $4",
    [title, content, fileUrl, id],
  );
}

//Изменить задание (для учителя)
export async function updateAssignment(
  id: number,
  courseId: number,
  title: string,
  description: string,
  dueDate: string,
) {
  await query(
    "UPDATE assignments SET title = $1, description = $2, due_date = $3 WHERE id = $4",
    [title, description, dueDate, id],
  );
}
