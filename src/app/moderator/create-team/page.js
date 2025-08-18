import CreateTeamForm from "@/components/Moderator/CreateTeamForm";

function page() {
  return (
    <div className="flex items-center h-dvh justify-center ">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Create New Team</h2>
        <CreateTeamForm />
      </div>
    </div>
  );
}

export default page;
