import RootAdminOptionDisplayer from "@/components/RootAdminOptionDisplayer";
import RootAdminOptions from "@/components/RootAdminOptions";
import { RootAdminProvider, useRootAdmin } from "@/context/rootAdminContext";
import {
  getAllAdmins,
  getAllModerators,
  getReports,
} from "@/services/rootAdminService";

async function page() {
  const admins = await getAllAdmins();
  const moderators = await getAllModerators();
  const reports = await getReports();
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
          />
        </div>
      </RootAdminProvider>
    </div>
  );
}

export default page;
