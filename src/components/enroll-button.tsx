"use client";
import { enrollInCourse } from "@/actions/enrollmentActions";

type EnrollButtonProps = {
  course_id: number;
  student_id: number;
};

const EnrollButton = ({ course_id, student_id }: EnrollButtonProps) => {
  return (
    <button
      onClick={() => enrollInCourse(course_id, student_id)}
      className="bg-black/20 p-2 rounded-xl absolute top-4 right-4 cursor-pointer"
    >
      Поступить на курс
    </button>
  );
};

export default EnrollButton;
