"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { adminCreateUser } from "@/actions/adminActions";
import { useRouter } from "next/navigation";

export default function AdminUserForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student" as "student" | "teacher",
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsPending(true);

    const res = await adminCreateUser(formData);

    if (res.success) {
      setIsOpen(false);
      setFormData({ full_name: "", email: "", password: "", role: "student" });
      router.refresh();
    } else {
      alert(res.error);
    }
    setIsPending(false);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white flex items-center gap-2 rounded-xl font-bold transition-colors px-4 py-2 rounded-xl  transition-colors"
        >
          <UserPlus size={20} /> Добавить пользователя
        </button>
      ) : (
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 shadow-sm relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Новый пользователь
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              required
              placeholder="ФИО"
              className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              required
              type="password"
              placeholder="Пароль"
              className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="flex gap-2">
              <select
                className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
              >
                <option value="student">Студент</option>
                <option value="teacher">Преподаватель</option>
              </select>
              <button
                disabled={isPending}
                className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50"
              >
                {isPending ? "..." : "Создать"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
