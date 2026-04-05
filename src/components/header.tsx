"use client";

import Link from "next/link";
import { loginAsUser, logout } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { User } from "@/types/user";
import { Check, ChevronDown, LogOut, Search, UserIcon, X } from "lucide-react";

interface HeaderProps {
  teachers: User[];
  students: User[];
  currentUserId: number | null;
  currentUserRole: "teacher" | "student" | null;
}

export default function Header({
  teachers,
  students,
  currentUserId,
  currentUserRole,
}: HeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  let currentUser = null;
  if (currentUserRole === "teacher") {
    currentUser = teachers.find((t) => t.id === currentUserId);
  } else if (currentUserRole === "student") {
    currentUser = students.find((s) => s.id === currentUserId);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  };

  const handleUserChange = async (
    userId: number,
    role: "teacher" | "student",
  ) => {
    await loginAsUser(userId, role);
    setIsMenuOpen(false);
    router.refresh();
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tighter mr-6"
        >
          <div className="text-green-600">
            Course<span className="text-slate-900">Platform</span>
          </div>
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md mx-auto hidden md:flex relative"
        >
          <Search
            className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 cursor-pointer"
            onClick={() => handleSearch()}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск курсов..."
            className="w-full rounded-full bg-slate-100 border border-transparent py-2 pl-10 pr-10 text-sm outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery && (
            <X
              className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600"
              onClick={() => {
                setSearchQuery("");
                const params = new URLSearchParams(window.location.search);
                params.delete("search");
                router.push(`/?${params.toString()}`);
              }}
            />
          )}
        </form>

        <div className="flex items-center gap-4 ml-auto relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold">
              {currentUser ? (
                currentUser.full_name[0].toUpperCase()
              ) : (
                <UserIcon size={16} />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none text-slate-700">
                {currentUser ? currentUser.full_name : "Войти"}
              </p>
              {currentUser && (
                <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                  {currentUserRole === "teacher" ? "Преподаватель" : "Студент"}
                </p>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-100 bg-white py-2 shadow-lg ring-1 ring-black/5">
              <Link
                href="/profile"
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors"
              >
                Профиль
              </Link>

              <div className="my-1 border-t border-slate-100" />

              <div className="px-3 py-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Учителя
                </p>
              </div>
              <div className="max-h-[150px] overflow-y-auto">
                {teachers.map((teacher) => (
                  <button
                    key={`teacher-${teacher.id}`}
                    onClick={() => handleUserChange(teacher.id, "teacher")}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={
                        currentUserId === teacher.id &&
                        currentUserRole === "teacher"
                          ? "font-bold text-green-600"
                          : "text-slate-700"
                      }
                    >
                      {teacher.full_name}
                    </span>
                    {currentUserId === teacher.id &&
                      currentUserRole === "teacher" && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                  </button>
                ))}
              </div>

              <div className="my-1 border-t border-slate-100" />

              <div className="px-3 py-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Студенты
                </p>
              </div>
              <div className="max-h-[150px] overflow-y-auto">
                {students.map((student) => (
                  <button
                    key={`student-${student.id}`}
                    onClick={() => handleUserChange(student.id, "student")}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={
                        currentUserId === student.id &&
                        currentUserRole === "student"
                          ? "font-bold text-green-600"
                          : "text-slate-700"
                      }
                    >
                      {student.full_name}
                    </span>
                    {currentUserId === student.id &&
                      currentUserRole === "student" && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                  </button>
                ))}
              </div>

              {currentUser && (
                <>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
