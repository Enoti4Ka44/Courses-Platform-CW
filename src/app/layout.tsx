import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import {
  getAllTeachers,
  getAllStudents,
  getCurrentUser,
} from "@/actions/authActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const teachers = await getAllTeachers();
  const students = await getAllStudents();
  const { id: currentUserId, role: currentUserRole } = await getCurrentUser();

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header
          teachers={teachers}
          students={students}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
