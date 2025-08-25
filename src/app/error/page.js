"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "Something went wrong";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold text-red-600">Error</h1>
      <p className="mt-4 text-gray-600 text-lg">{message}</p>

      <a
        href="/"
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        Go Home
      </a>
    </div>
  );
}
