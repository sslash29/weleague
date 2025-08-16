import CreateAdminForm from "@/components/Admin/CreateAdminForm";
import Link from "next/link";

function page() {
  return (
    <div className="flex items-center h-dvh justify-center ">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Create New Admin</h2>
        <CreateAdminForm />
      </div>
      <button className="p-6 py-1 font-semibold text-lg absolute right-5 bottom-5 border rounded-full">
        <Link href="/admin">Back</Link>
      </button>
    </div>
  );
}

export default page;
