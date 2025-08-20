import TeamRankings from "@/components/TeamRankings";
import { getAllTeams } from "@/services/services";

async function page() {
  const teams = await getAllTeams();
  return (
    <div className="">
      <TeamRankings teamData={teams} />
    </div>
  );
}

export default page;
