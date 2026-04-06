"use client";

import { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { gradeSubmission } from "@/actions/submissionsActions";

export default function GradeForm({
  submission,
  teacherId,
}: {
  submission: any;
  teacherId: number;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(submission.score || "");
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsPending(true);
    await gradeSubmission(submission.id, Number(score), feedback);
    setIsOpen(false);
    setIsPending(false);
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${
          submission.score
            ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
            : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
        }`}
      >
        {submission.score ? `Оценка: ${submission.score}` : "Оценить"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                Оценка работы
              </h3>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-xl text-sm">
              <p className="font-bold text-slate-700">
                {submission.student_name}
              </p>
              <p className="text-slate-600 mt-1">"{submission.content}"</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Балл (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Комментарий
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl h-24 resize-none focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Что можно улучшить..."
                />
              </div>
              <button
                disabled={isPending}
                className="cursor-pointer w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50"
              >
                Подтвердить оценку
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
