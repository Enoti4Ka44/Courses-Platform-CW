"use client";

import { useState } from "react";
import { updateUserProfile } from "@/actions/profileActions";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

interface ProfileFormProps {
  user: User;
  role: "teacher" | "student";
}

export default function ProfileForm({ user, role }: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await updateUserProfile(user.id, role, fullName, email);
      setMessage("Профиль успешно обновлен!");
      router.refresh();
    } catch (error) {
      setMessage("Ошибка при сохранении.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Настройки профиля
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Имя и Фамилия
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-green-600 hover:bg-green-700  cursor-pointer text-white px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
        {message && (
          <span className="text-sm font-medium text-green-600">{message}</span>
        )}
      </div>
    </form>
  );
}
