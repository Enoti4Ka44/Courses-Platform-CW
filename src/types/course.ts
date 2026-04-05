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
