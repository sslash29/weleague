import AddBest from "@/components/Moderator/AddBest";
import { getAllPlayers } from "@/services/moderatorServices";
import { getAllTeams } from "@/services/services";

async function page() {
  const players = await getAllPlayers();
  return (
    <div className="flex items-center h-dvh justify-center ">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Create New Video</h2>
        <AddBest players={players} />
      </div>
    </div>
  );
}

export default page;
