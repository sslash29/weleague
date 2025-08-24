import TopPointsRanking from "@/components/Ranking/TopPointsRanking";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div>
      <TopPointsRanking playerData={players} />
    </div>
  );
}

export default page;
