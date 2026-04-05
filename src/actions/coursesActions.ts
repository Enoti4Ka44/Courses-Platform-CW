import { Course } from "@/types/course";
import { query } from "@/utils/db";

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
