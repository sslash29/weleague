import TopGoalRanking from "@/components/Ranking/TopGoalRanking";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();

  return (
    <div>
      <TopGoalRanking playerData={players} />
    </div>
  );
}

export default page;
