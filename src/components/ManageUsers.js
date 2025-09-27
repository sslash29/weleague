"use client";

import { useActionState, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { deleteStudent } from "@/services/rootAdminService";

function ManageUsers() {
  const [deleteUserState, deleteUserAction] = useActionState(deleteStudent, {});
  const [users, setUsers] = useState([]);
  const [copiedUserId, setCopiedUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

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

  // ✅ Handle delete with animation
  async function handleDelete(e, userId) {
    e.preventDefault();
    setDeletingUserId(userId);

    // Wait for animation to play before calling Supabase
    setTimeout(async () => {
      const formData = new FormData();
      formData.append("studentId", userId);
      await deleteUserAction(formData);

      // Optimistically remove from UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }, 300); // match exit animation duration
  }

  return (
    <div className="relative w-full flex gap-4 border h-[700px] p-2 py-5 overflow-y-auto flex-wrap mt-5">
      {users.length < 1 ? (
        <h1 className="text-5xl font-bold">Empty</h1>
      ) : (
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
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

                <form onSubmit={(e) => handleDelete(e, user.id)}>
                  <button
                    type="submit"
                    disabled={deletingUserId === user.id}
                    className="bg-red-normal text-white text-sm font-semibold px-2 py-1 rounded-md cursor-pointer hover:bg-red-normal-hover transition-all"
                  >
                    {deletingUserId === user.id ? "Deleting..." : "Delete User"}
                  </button>
                </form>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      {deleteUserState ? deleteUserState.message : null}
    </div>
  );
}

export default ManageUsers;
