"use client";

import { useRootAdmin } from "@/context/rootAdminContext";
import ManageAdminAndModerator from "./ManageAdminAndModerator";
import ViewReports from "./ViewReports";

function RootAdminOptionDisplayer({ admins, moderators, reports }) {
  console.log(admins);
  const { active } = useRootAdmin();
  if (active === "manage-admins")
    return <ManageAdminAndModerator users={admins} />;
  if (active === "manage-moderators")
    return <ManageAdminAndModerator users={moderators} type="Moderator" />;
  if (active === "view-reports") return <ViewReports reports={reports} />;
}

export default RootAdminOptionDisplayer;
