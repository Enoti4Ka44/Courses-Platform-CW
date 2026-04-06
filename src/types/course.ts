export interface Course {
  id: number;
  title: string;
  description: string | null;
  teacher_id: number;
  teacher_name?: string;
  created_at: Date;
}

export interface Material {
  id: number;
  title: string;
  content: string;
  course_id: number;
  file_url?: string;
  created_at: Date;
}

export interface Assignment {
  id: number;
  title: string;
  description: string | null;
  course_id: number;
  file_url?: string;
  due_date: Date;
}

export interface Submission {
  id: number;
  assignment_id: number;
  assignment_title: string;
  course_title: string;
  course_id: number;
  student_id: number;
  content: string;
  score?: number;
  feedback?: string;
  file_url: string;
  submitted_at: Date;
}

export interface TeacherSubmission {
  id: number;
  assignment_id: number;
  assignment_title: string;
  course_title: string;
  score: number;
  feedback: string;
  student_id: number;
  student_name: string;
  content: string;
  file_url: string;
  submitted_at: Date;
}
