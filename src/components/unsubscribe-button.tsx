"use client";

import {
  kickStudentFromCourse,
  unsubscribeFromCourse,
} from "@/actions/enrollmentActions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UnsubscribeButtonProps {
  courseId: number;
  studentId: number;
}

export default function UnsubscribeButton({
  courseId,
  studentId,
}: UnsubscribeButtonProps) {
  const router = useRouter();

  const handleKick = async () => {
    if (!confirm("Вы уверены, что хотите отписаться от курса ?")) return;

    const result = await unsubscribeFromCourse(courseId, studentId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Ошибка");
    }
  };

  return (
    <button
      onClick={handleKick}
      className="bg-black w-full text-white cursor-pointer p-2 rounded-xl font-bold hover:bg-black/85 transition"
    >
      Отписаться от курса
    </button>
  );
}
