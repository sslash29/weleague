import ViewTeam from "@/components/ViewTeam";
import { getTeamPlayersQuery } from "@/lib/db/queries/queries";
import { getTeamData } from "@/services/services";

async function page({ params }) {
  const { id } = params;
  const teamData = await getTeamData(id);
  const teamPlayers = await getTeamPlayersQuery(id);
  return (
    <div>
      <ViewTeam teamData={teamData} players={teamPlayers} />
    </div>
  );
}

export default page;
