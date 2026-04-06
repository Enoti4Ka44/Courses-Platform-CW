"use server";

import { Submission, TeacherSubmission } from "@/types/course";
import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";

// Получить все ответы конкретного студента
export async function getStudentSubmissions(studentId: number) {
  const res = await query<Submission>(
    `SELECT 
        s.*, 
        a.title as assignment_title, 
        c.title as course_title,
        c.id as course_id,
        g.score,
        g.feedback  
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN courses c ON a.course_id = c.id
     LEFT JOIN grades g ON s.id = g.submission_id
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

// Получить все ответы студентов на курсы конкретного учителя
export async function getTeacherSubmissions(teacherId: number) {
  const res = await query<TeacherSubmission>(
    `SELECT 
        s.*, 
        a.title as assignment_title, 
        st.full_name as student_name,
        c.title as course_title,
        g.score,
        g.feedback
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     JOIN courses c ON a.course_id = c.id
     JOIN students st ON s.student_id = st.id
     LEFT JOIN grades g ON s.id = g.submission_id
     WHERE c.teacher_id = $1
     ORDER BY s.submitted_at DESC`,
    [teacherId],
  );
  return res.rows;
}

// Выставить или обновить оценку
export async function gradeSubmission(
  submissionId: number,
  score: number,
  feedback: string,
) {
  await query(
    `INSERT INTO grades (submission_id, score, feedback)
     VALUES ($1, $2, $3)
     ON CONFLICT (submission_id) 
     DO UPDATE SET 
        score = EXCLUDED.score, 
        feedback = EXCLUDED.feedback,
        graded_at = CURRENT_TIMESTAMP`,
    [submissionId, score, feedback],
  );
  revalidatePath("/profile");
}
