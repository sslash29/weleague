"use client";

import { deleteAccount } from "@/services/services";
import { useActionState } from "react";

function DeleteAccount({ userId }) {
  const [deleteAccountState, deleteAccountAction] = useActionState(
    deleteAccount,
    {}
  );

  return (
    <form className="w-full text-center">
      <input type="hidden" value={userId} name="userId" />
      <button
        className="w-full bg-red-normal text-white font-semibold text-xl px-4 py-2 rounded cursor-pointer hover:bg-red-normal-hover transition-colors"
        formAction={deleteAccountAction}
      >
        Delete
      </button>
      <p>{deleteAccountState.message ? deleteAccountState.message : ""}</p>
    </form>
  );
}

export default DeleteAccount;
