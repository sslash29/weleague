import TopDefenderRanking from "@/components/Ranking/TopDefenderRanking";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div>
      <TopDefenderRanking playerData={players} />
    </div>
  );
}

export default page;
