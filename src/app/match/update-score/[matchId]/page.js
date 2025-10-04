import EditScoreDataForm from "@/components/league/match/EditScoreDataForm";
import { getMatchData, getTeamData } from "@/services/services";

async function page({ params, searchParams }) {
  const { team1id, team2id } = await searchParams;
  const team1 = await getTeamData(team1id);
  const team2 = await getTeamData(team2id);
  const { matchId } = await params;
  const matchData = await getMatchData(matchId);
  console.dir(matchData);
  console.log("Match Data:", JSON.stringify(matchData, null, 2));
  return (
    <div className="flex items-center h-dvh justify-center -translate-y-15">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-5xl font-bold w-[300px]">Add Score Data</h2>
        <EditScoreDataForm
          team1={{ name: team1.name, id: team1.id }}
          team2={{ name: team2.name, id: team2.id }}
          matchId={matchId}
          matchData={matchData[0]}
        />
      </div>
    </div>
  );
}

export default page;
