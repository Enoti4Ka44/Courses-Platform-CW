"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { submitAssignment } from "@/actions/coursesActions";

export default function SubmissionForm({
  assignmentId,
  studentId,
}: {
  assignmentId: number;
  studentId: number;
}) {
  const [content, setContent] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await submitAssignment(assignmentId, studentId, content);
    setIsSent(true);
    setContent("");
  };

  if (isSent)
    return (
      <div className="text-sm font-bold text-green-600 bg-green-50 p-2 rounded-lg text-center">
        Задание отправлено!
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        placeholder="Ваш ответ..."
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:border-green-500 outline-none h-20 resize-none"
      />
      <button className="w-full flex items-center justify-center gap-2 bg-black cursor-pointer text-white py-2 rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors">
        <Send size={14} /> Отправить работу
      </button>
    </form>
  );
}
