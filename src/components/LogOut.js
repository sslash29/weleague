"use client";

import { signOut } from "@/services/server/services";
import { useActionState } from "react";

export function LogOut() {
  const [logOut, logOutAction] = useActionState(signOut, {});
  return (
    <form>
      <button className="cursor-pointer text-3xl " formAction={logOutAction}>
        Log Out
      </button>
    </form>
  );
}
