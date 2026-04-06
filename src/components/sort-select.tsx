// components/sort-select.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-100"
      defaultValue={defaultValue}
      onChange={handleSortChange}
    >
      <option value="newest">Сначала новые</option>
      <option value="oldest">Сначала старые</option>
    </select>
  );
}
