"use client";

import { useState } from "react";
import { Plus, X, BookPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/actions/coursesActions";

export default function CreateCourseForm({ teacherId }: { teacherId: number }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await createCourse(teacherId, title, description);

    if (res.success) {
      setTitle("");
      setDescription("");
      router.refresh();
      // Можно редиректнуть сразу на страницу курса:
      // router.push(`/courses/${res.courseId}`);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-green-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-green-600">
          <BookPlus size={24} />
          <h3 className="text-xl font-bold text-slate-800">Новый курс</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Название курса
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Основы веб-разработки"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Описание
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="О чем ваш курс?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 outline-none h-32 resize-none"
          />
        </div>

        <button className="w-full bg-black text-white py-2 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
          Создать курс
        </button>
      </form>
    </div>
  );
}
