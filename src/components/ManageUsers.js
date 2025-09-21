"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { deleteUser } from "@/services/rootAdminService";

function ManageUsers() {
  const [deleteUserState, deleteUserAction] = useActionState(deleteUser, {});
  const [users, setUsers] = useState([]);

  // ✅ Fetch fresh data from "user" table
  async function fetchUsers() {
    const { data, error } = await supabase.from("student").select("*");
    if (!error) {
      setUsers(data);
      console.log(data);
    } else {
      console.error("Error fetching users:", error);
    }
  }

  // ✅ Initial fetch + realtime updates
  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel("user-table-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "student",
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col gap-4 border h-[700px] p-2 py-5 overflow-y-auto">
      {users.length < 1 ? (
        <h1 className="text-5xl font-bold">Empty</h1>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex gap-10 items-center bg-white h-fit w-fit p-3 rounded-lg shadow"
          >
            <h3 className="text-2xl font-bold">{user.full_name}</h3>
            <div className="flex gap-1.5">
              <button
                className="bg-[#333333] text-white text-sm font-semibold px-2 py-1 rounded-md hover:scale-90 transition-all cursor-pointer"
                onClick={() =>
                  navigator.clipboard.writeText(user.phone_number || "")
                }
              >
                Copy Number
              </button>
              <form>
                <input type="hidden" name="userId" value={user.id} />
                <button
                  className="bg-red-normal text-white text-sm font-semibold px-2 py-1 rounded-md cursor-pointer"
                  formAction={deleteUserAction}
                >
                  Delete User
                </button>
              </form>
            </div>
          </div>
        ))
      )}
      <button className="p-3 py-2 text-semibold text-lg absolute bottom-5 right-5 cursor-pointer rounded-lg bg-black text-white font-semibold">
        <Link href="/admin/create-user">Create User</Link>
      </button>
    </div>
  );
}

export default ManageUsers;
