"use client";
import Link from "next/link";

function ManageAdminAndModerator({ users, type = "Admin" }) {
  return (
    <div className="relative w-full flex justify-between border h-[700px] p-2 py-5">
      {users.length < 1 ? (
        <h1 className="text-5xl font-bold">Empty</h1>
      ) : (
        users.map((user, key) => {
          return (
            <div
              key={key}
              className="flex gap-10 items-center bg-white h-fit w-fit"
            >
              <h3 className="text-2xl font-bold">{user.username}</h3>
              <div className="flex gap-1.5">
                <button className="bg-[#333333] text-white text-sm font-semibold px-2 py-1 rounded-md">
                  Copy Number
                </button>
                <button className="bg-red-normal text-white text-sm font-semibold px-2 py-1 rounded-md">
                  Delete User
                </button>
              </div>
            </div>
          );
        })
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
