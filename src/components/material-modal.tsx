"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteMaterial, updateMaterial } from "@/actions/coursesActions";

export default function MaterialModal({
  material,
  courseId,
}: {
  material: any;
  courseId: number;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState(material.title);
  const [content, setContent] = useState(material.content);
  const [fileUrl, setFileUrl] = useState(material.file_url || "");

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить этот материал?")) {
      await deleteMaterial(material.id, courseId);
      router.refresh();
    }
  };

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      await updateMaterial(material.id, courseId, title, content, fileUrl);
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
                Редактировать материал
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
                  Заголовок
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
                  Содержание
                </label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-green-500 outline-none h-32 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Ссылка на файл
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold hover:bg-green-700 transition cursor-pointer"
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
