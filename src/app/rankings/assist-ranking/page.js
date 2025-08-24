import TopAssistRanking from "@/components/Ranking/TopAssistRanking";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div>
      <TopAssistRanking playerData={players} />
    </div>
  );
}

export default page;
