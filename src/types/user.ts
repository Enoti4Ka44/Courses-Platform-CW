export interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface CourseStudent extends User {
  course_id: number;
  course_title: string;
}
