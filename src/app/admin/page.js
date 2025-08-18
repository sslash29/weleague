import RootAdminOptionDisplayer from "@/components/Admin/RootAdminOptionDisplayer";
import RootAdminOptions from "@/components/Admin/RootAdminOptions";
import { RootAdminProvider, useRootAdmin } from "@/context/rootAdminContext";
import {
  getAllAdmins,
  getAllModerators,
  getReports,
  getSuspentionStatistics,
} from "@/services/rootAdminService";
import { getAllTeams, getTeamData } from "@/services/services";

async function page() {
  const admins = await getAllAdmins();
  const moderators = await getAllModerators();
  const reports = await getReports();
  const teamData = await getAllTeams();
  const adminType = "root-admin";

  return (
    <div>
      <RootAdminProvider>
        <div className="flex flex-col gap-10">
          <RootAdminOptions adminType={adminType} />
          <RootAdminOptionDisplayer
            admins={admins}
            moderators={moderators}
            reports={reports}
            teamData={teamData}
          />
        </div>
      </RootAdminProvider>
    </div>
  );
}

export default page;
