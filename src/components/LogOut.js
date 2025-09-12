"use client";

import { signOut } from "@/services/server/services";
import { useActionState } from "react";

export function LogOut() {
  const [logOut, logOutAction] = useActionState(signOut, {});
  return (
    <form className=" text-center bg-black text-white font-semibold text-xl px-2 py-1 rounded w-full cursor-pointer">
      <button formAction={logOutAction}>Log Out</button>
    </form>
  );
}
