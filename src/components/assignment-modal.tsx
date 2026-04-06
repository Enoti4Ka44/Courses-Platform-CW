"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteAssignment, updateAssignment } from "@/actions/coursesActions";

const formatForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function AssignmentModal({
  assignment,
  courseId,
}: {
  assignment: any;
  courseId: number;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [dueDate, setDueDate] = useState(formatForInput(assignment.due_date));

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить это задание?")) {
      await deleteAssignment(assignment.id, courseId);
      router.refresh();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateAssignment(
        assignment.id,
        courseId,
        title,
        description,
        dueDate,
      );
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      alert("Ошибка при обновлении");
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-slate-400 hover:text-black hover:bg-black/10 rounded-lg transition cursor-pointer"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Редактировать задание
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Инструкции
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-green-500 outline-none h-24 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Дедлайн
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
