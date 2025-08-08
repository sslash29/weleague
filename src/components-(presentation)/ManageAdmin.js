"use client";
import Link from "next/link";

function ManageAdmin({ admins }) {
  return (
    <div className="relative w-full flex items-center gap-3 border h-full ">
      {admins.map((admin) => {
        console.log(admin);
        return <div></div>;
      })}

      <button className="border p-3 py-2 text-semibold text-xl absolute bottom-5 right-5 cursor-pointer">
        <Link href="/admin/create-admin">Create Admin</Link>
      </button>
    </div>
  );
}

export default ManageAdmin;
