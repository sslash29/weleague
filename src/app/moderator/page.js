import ModeratorOptionDisplayer from "@/components/Moderator/ModeratorOptionDisplayer";
import ModeratorOptions from "@/components/Moderator/ModeratorOptions";
import { ModeratorProvider } from "@/context/moderatorContext";
import { getAllPlayers } from "@/services/moderatorServices";
import { getReports } from "@/services/rootAdminService";
import { getAllTeams } from "@/services/services";

async function page() {
  const players = await getAllPlayers();
  const teams = await getAllTeams();
  const reports = await getReports();
  return (
    <div>
      <ModeratorProvider>
        <ModeratorOptions />
        <ModeratorOptionDisplayer
          players={players}
          teams={teams}
          reports={reports}
        />
      </ModeratorProvider>
    </div>
  );
}

export default page;
