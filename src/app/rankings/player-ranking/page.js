import PlayerRankings from "@/components/PlayerRankings";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div>
      <PlayerRankings playerData={players} />
    </div>
  );
}

export default page;
