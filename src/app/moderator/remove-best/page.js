import RemoveBest from "@/components/Moderator/RemoveBest";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div className="flex items-center h-dvh justify-center ">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Remove Best Award</h2>
        <RemoveBest players={players} />
      </div>
    </div>
  );
}

export default page;
