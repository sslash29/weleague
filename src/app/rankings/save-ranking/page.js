import TopSavesRanking from "@/components/Ranking/TopSavesRanking";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div>
      <TopSavesRanking playerData={players} />
    </div>
  );
}

export default page;
