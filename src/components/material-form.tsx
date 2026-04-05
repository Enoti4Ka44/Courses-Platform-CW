// components/add-material-form.tsx
"use client";

import { useState } from "react";
import { Plus, X, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { addMaterial } from "@/actions/coursesActions";

export default function MaterialForm({ courseId }: { courseId: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      await addMaterial(courseId, title, content, fileUrl);
      setIsOpen(false);
      setTitle("");
      setContent("");
      setFileUrl("");
      router.refresh();
    } catch (error) {
      alert("Ошибка при добавлении материала");
    } finally {
      setIsPending(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:border-blue-400 hover:text-blue-500 transition-all justify-center font-medium"
      >
        <Plus size={20} /> Добавить учебный материал
      </button>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm ring-4 ring-blue-50/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FilePlus className="text-blue-600" size={20} /> Новый материал
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
            Заголовок
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Напр: Введение в SQL"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Содержание
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Текст лекции или описание..."
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none h-32 resize-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Ссылка на файл (необязательно)
          </label>
          <input
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://example.com/presentation.pdf"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Сохранение..." : "Опубликовать материал"}
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
