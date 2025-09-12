"use client";

import { signOut } from "@/services/server/services";
import { useActionState } from "react";

export function LogOut() {
  const [logOut, logOutAction] = useActionState(signOut, {});

  return (
    <form className="w-full text-center">
      <button
        className="w-full bg-black text-white font-semibold text-xl px-4 py-2 rounded cursor-pointer hover:bg-gray-900 transition-colors"
        formAction={logOutAction}
      >
        Log Out
      </button>
    </form>
  );
}
