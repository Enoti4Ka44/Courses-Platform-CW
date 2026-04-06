"use server";

import { Submission } from "@/types/course";
import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

// Получить все ответы конкретного студента
export async function getStudentSubmissions(studentId: number) {
  const res = await query<Submission>(
    `SELECT 
        s.*, 
        a.title as assignment_title, 
        c.title as course_title,
        c.id as course_id
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN courses c ON a.course_id = c.id
     WHERE s.student_id = $1
     ORDER BY s.submitted_at DESC`,
    [studentId],
  );

  return res.rows;
}

// Удалить ответ (студент может удалить тоько свой ответ)
export async function deleteSubmission(submissionId: number) {
  await query("DELETE FROM submissions WHERE id = $1", [submissionId]);
  revalidatePath("/profile");
}
