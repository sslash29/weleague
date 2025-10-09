import RootAdminOptionDisplayer from "@/components/Admin/RootAdminOptionDisplayer";
import RootAdminOptions from "@/components/Admin/RootAdminOptions";
import { RootAdminProvider, useRootAdmin } from "@/context/rootAdminContext";
import { getReports } from "@/services/rootAdminService";
import { getAllTeams } from "@/services/services";

async function page() {
  const reports = await getReports();
  const teamData = await getAllTeams();
  const adminType = "root-admin";

  return (
    <div>
      <RootAdminProvider>
        <div className="flex flex-col gap-10">
          <RootAdminOptions adminType={adminType} />
          <RootAdminOptionDisplayer reports={reports} teamData={teamData} />
        </div>
      </RootAdminProvider>
    </div>
  );
}

export default page;
