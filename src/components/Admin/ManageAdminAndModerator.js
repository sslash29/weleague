"use client";

import { deleteModerator } from "@/services/rootAdminService";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

function ManageAdminAndModerator({ type = "Admin" }) {
  const [deleteModeratorState, deleteModeratorAction] = useActionState(
    deleteModerator,
    {}
  );
  const [users, setUsers] = useState([]);

  // ✅ Fetch fresh data
  async function fetchUsers() {
    const table = type === "Admin" ? "admin" : "moderator";
    const { data, error } = await supabase.from(table).select("*");
    if (!error) {
      setUsers(data);
    } else {
      console.error("Error fetching users:", error);
    }
  }

  // ✅ Initial fetch + realtime updates
  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel(`${type.toLowerCase()}-table-changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: type.toLowerCase(),
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [type]);

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
            <h3 className="text-2xl font-bold">{user.username}</h3>
            <div className="flex gap-1.5">
              <button
                className="bg-[#333333] text-white text-sm font-semibold px-2 py-1 rounded-md"
                onClick={() =>
                  navigator.clipboard.writeText(user.phone_number || "")
                }
              >
                Copy Number
              </button>
              {type === "Moderator" && (
                <form>
                  <input type="hidden" name="moderatorId" value={user.id} />
                  <button
                    className="bg-red-normal text-white text-sm font-semibold px-2 py-1 rounded-md cursor-pointer"
                    formAction={deleteModeratorAction}
                  >
                    Delete User
                  </button>
                </form>
              )}
            </div>
          </div>
        ))
      )}
      <button className="p-3 py-2 text-semibold text-lg absolute bottom-5 right-5 cursor-pointer rounded-lg bg-black text-white font-semibold">
        <Link
          href={
            type === "Admin" ? "/admin/create-admin" : "/admin/create-moderator"
          }
        >
          Create {type}
        </Link>
      </button>
    </div>
  );
}

export default ManageAdminAndModerator;
