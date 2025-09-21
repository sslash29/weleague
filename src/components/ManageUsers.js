"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { deleteUser } from "@/services/rootAdminService";
import { motion, AnimatePresence } from "framer-motion";

function ManageUsers() {
  const [deleteUserState, deleteUserAction] = useActionState(deleteUser, {});
  const [users, setUsers] = useState([]);
  const [copiedUserId, setCopiedUserId] = useState(null);

  async function fetchUsers() {
    const { data, error } = await supabase.from("student").select("*");
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
      .channel("user-table-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
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

  // ✅ Handle copy with feedback
  function handleCopy(userId, phoneNumber) {
    navigator.clipboard.writeText(phoneNumber || "");
    setCopiedUserId(userId);

    setTimeout(() => {
      setCopiedUserId(null);
    }, 2000); // reset after 2s
  }

  return (
    <div className="relative w-full flex gap-4 border h-[700px] p-2 py-5 overflow-y-auto">
      {users.length < 1 ? (
        <h1 className="text-5xl font-bold">Empty</h1>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex gap-10 items-center bg-white h-fit w-fit p-3 rounded-lg shadow relative"
          >
            <h3 className="text-2xl font-bold">{user.full_name}</h3>
            <div className="flex gap-1.5 items-center">
              <AnimatePresence mode="wait">
                {copiedUserId === user.id ? (
                  <motion.button
                    key="copied"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-green-600 text-white text-sm font-semibold px-2 py-1 rounded-md cursor-pointer"
                    onClick={() => handleCopy(user.id, user.phone_number)}
                  >
                    Copied!
                  </motion.button>
                ) : (
                  <motion.button
                    key="copy"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#333333] text-white text-sm font-semibold px-2 py-1 rounded-md hover:scale-90 transition-all cursor-pointer"
                    onClick={() => handleCopy(user.id, user.phone_number)}
                  >
                    Copy Number
                  </motion.button>
                )}
              </AnimatePresence>

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
