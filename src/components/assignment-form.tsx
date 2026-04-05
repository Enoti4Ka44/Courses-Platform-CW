"use client";

import { useState } from "react";
import { Plus, X, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { addAssignment } from "@/actions/coursesActions";

export default function AddAssignmentForm({ courseId }: { courseId: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      await addAssignment(courseId, title, description, dueDate);
      setIsOpen(false);
      setTitle("");
      setDescription("");
      setDueDate("");
      router.refresh();
    } catch (error) {
      alert("Ошибка при добавлении задания");
    } finally {
      setIsPending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full py-4 border-2 border-dashed border-orange-200 rounded-2xl text-orange-500 hover:border-orange-400 hover:text-orange-600 transition-all justify-center font-medium"
      >
        <Plus size={20} /> Создать задание
      </button>
    );
  }

  return (
    <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm ring-4 ring-orange-50/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="text-orange-500" size={20} /> Новое задание
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Название задания
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Напр: Лабораторная работа №1"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-all"
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
            placeholder="Что нужно сделать студенту..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-orange-500 outline-none h-24 resize-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Срок сдачи (Deadline)
          </label>
          <input
            type="datetime-local"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-orange-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isPending ? "Создание..." : "Выдать задание"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
