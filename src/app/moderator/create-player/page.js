import LogIn from "@/components/Auth/LogIn";
import CreatePlayerForm from "@/components/Moderator/CreatePlayerForm";
import { getAllTeams } from "@/services/services";

async function page() {
  const teams = await getAllTeams();
  return (
    <div className="flex items-center h-dvh justify-center -translate-y-15">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Create New Player</h2>

        <LogIn />
      </div>
    </div>
  );
}

export default page;
