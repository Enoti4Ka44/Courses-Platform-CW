export interface Course {
  id: number;
  title: string;
  description: string | null;
  teacher_id: number;
  teacher_name?: string;
  created_at: Date;
}
