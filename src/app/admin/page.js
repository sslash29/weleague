import RootAdminOptionDisplayer from "@/components/RootAdminOptionDisplayer";
import RootAdminOptions from "@/components/RootAdminOptions";
import { RootAdminProvider } from "@/context/rootAdminContext";
import {
  getAllAdmins,
  getAllModerators,
  getReports,
} from "@/services/rootAdminService";

async function page() {
  const admins = await getAllAdmins();
  const moderators = await getAllModerators();
  const reports = await getReports();
  return (
    <div>
      <RootAdminProvider>
        <div className="flex flex-col gap-10">
          <RootAdminOptions />
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
