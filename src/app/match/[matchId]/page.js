import CreateScoreDataForm from "@/components/league/match/CreateScoreDataForm";
import { getTeamData, getTeamPlayers } from "@/services/services";

async function page({ params, searchParams }) {
  const { team1id, team2id } = await searchParams;
  const team1Players = await getTeamPlayers(team1id);
  const team2Players = await getTeamPlayers(team2id);
  const team1 = await getTeamData(team1id);
  const team2 = await getTeamData(team2id);
  const { matchId } = await params;
  console.log(matchId);
  return (
    <div className="flex items-center h-dvh justify-center -translate-y-15">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Add Score Data</h2>
        <CreateScoreDataForm
          team1Players={team1Players}
          team2Players={team2Players}
          team1={{ name: team1.name, id: team1.id }}
          team2={{ name: team2.name, id: team2.id }}
          matchId={matchId}
        />
      </div>
    </div>
  );
}

export default page;
