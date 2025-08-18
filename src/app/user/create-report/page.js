import CreateReport from "@/components/User/CreateReport";

function page() {
  return (
    <div className="flex items-center h-dvh justify-center ">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Create New Report</h2>
        <CreateReport />
      </div>
    </div>
  );
}

export default page;
