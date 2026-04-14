"use client";

import { useState } from "react";
import { Trash2, Users, BookOpen } from "lucide-react";
import { adminDeleteUser, adminDeleteCourse } from "@/actions/adminActions";
import { useRouter } from "next/navigation";
import AdminUserForm from "./admin-user-form";

export default function AdminDashboard({
  users,
  courses,
}: {
  users: any[];
  courses: any[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"users" | "courses">("users");
  const [isPending, setIsPending] = useState(false);

  const handleDeleteUser = async (id: number, role: string) => {
    if (!confirm(`Точно удалить пользователя (${role})?`)) return;

    setIsPending(true);
    const res = await adminDeleteUser(id, role);
    if (!res.success) alert(res.error);
    setIsPending(false);
    router.refresh();
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Точно удалить курс?")) return;

    setIsPending(true);
    const res = await adminDeleteCourse(id);
    if (!res.success) alert(res.error);
    setIsPending(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === "users"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <Users size={20} /> Пользователи
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === "courses"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          <BookOpen size={20} /> Курсы
        </button>
      </div>

      {/* Таблица пользователей */}
      {activeTab === "users" && (
        <>
          <AdminUserForm />

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Имя</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Роль</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr
                    key={`${u.role}-${u.id}`}
                    className="hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4 text-slate-500">{u.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {u.full_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                          u.role === "teacher"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.role)}
                        disabled={isPending}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Таблица курсов */}
      {activeTab === "courses" && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Название</th>
                <th className="px-6 py-4">Преподаватель</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500">{c.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {c.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.teacher_name}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      disabled={isPending}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
