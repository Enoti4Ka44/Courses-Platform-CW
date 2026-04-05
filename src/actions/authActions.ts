"use server";

import { User } from "@/types/user";
import { query } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getAllTeachers(): Promise<User[]> {
  const res = await query<User>(
    "SELECT id, full_name, email FROM teachers ORDER BY full_name ASC",
  );
  return res.rows;
}

export async function getAllStudents(): Promise<User[]> {
  const res = await query<User>(
    "SELECT id, full_name, email FROM students ORDER BY full_name ASC",
  );
  return res.rows;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("current_user_id")?.value;
  const role = cookieStore.get("current_user_role")?.value as
    | "teacher"
    | "student"
    | undefined;

  return {
    id: userId ? parseInt(userId, 10) : null,
    role: role || null,
  };
}

export async function loginAsUser(userId: number, role: "teacher" | "student") {
  const cookieStore = await cookies();
  cookieStore.set("current_user_id", userId.toString(), { path: "/" });
  cookieStore.set("current_user_role", role, { path: "/" });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("current_user_id");
  cookieStore.delete("current_user_role");
}
