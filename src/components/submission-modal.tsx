// components/submission-actions.tsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteSubmission } from "@/actions/submissionsActions";
import { submitAssignment } from "@/actions/coursesActions";

export default function SubmissionModal({ submission }: { submission: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(submission.content);

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить свой ответ?")) {
      await deleteSubmission(submission.id);
      router.refresh();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitAssignment(
      submission.assignment_id,
      submission.student_id,
      content,
    );
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-slate-400 hover:text-black hover:bg-black/10 rounded-lg transition cursor-pointer"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
      >
        <Trash2 size={16} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">
                Редактировать ответ
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <textarea
                className="w-full p-4 border rounded-xl h-40 focus:ring-2 focus:ring-green-500 outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <button className="cursor-pointer w-full bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50">
                Обновить работу
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
