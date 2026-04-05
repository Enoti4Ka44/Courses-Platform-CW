"use client";

import { kickStudentFromCourse } from "@/actions/enrollmentActions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface KickButtonProps {
  courseId: number;
  studentId: number;
}

export default function KickButton({ courseId, studentId }: KickButtonProps) {
  const router = useRouter();

  const handleKick = async () => {
    if (!confirm("Вы уверены, что хотите исключить студента?")) return;

    const result = await kickStudentFromCourse(courseId, studentId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Ошибка при удалении");
    }
  };

  return (
    <button
      onClick={handleKick}
      className="flex items-center gap-2 font-bold transition text-slate-600 hover:text-red-500 cursor-pointer"
    >
      <Trash2 className="w-4 h-4" />
      Исключить
    </button>
  );
}
