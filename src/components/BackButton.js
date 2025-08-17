"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  function handleGoBack() {
    router.back();
  }

  return (
    <button
      onClick={handleGoBack}
      className="px-6 py-2 font-semibold text-lg transition-all hover:scale-95 bottom-3 right-3 border w-fit rounded-full"
    >
      Go Back
    </button>
  );
}
