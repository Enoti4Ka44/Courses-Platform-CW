import { getAllCoursesAdmin, getAllUsers } from "@/actions/adminActions";
import AdminDashboard from "@/components/admin-dashboard";

export default async function AdminPage() {
  const [users, courses] = await Promise.all([
    getAllUsers(),
    getAllCoursesAdmin(),
  ]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          Панель управления
        </h1>
      </div>

      <AdminDashboard users={users} courses={courses} />
    </main>
  );
}
