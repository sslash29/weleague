import ViewPlayer from "@/components/ViewPlayer";
import { getPlayerData, getPlayerTeam, getTeamData } from "@/services/services";

async function Page({ params }) {
  const { id } = await params;
  const playerData = await getPlayerData(id);
  const teamId = await getPlayerTeam(id);
  const teamData = await getTeamData(teamId[0].team_id);
  return (
    <div>
      <ViewPlayer playerData={playerData} teamData={teamData} />
    </div>
  );
}

export default Page;
