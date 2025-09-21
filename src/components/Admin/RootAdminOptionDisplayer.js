"use client";

import { useRootAdmin } from "@/context/rootAdminContext";
import ManageAdminAndModerator from "./ManageAdminAndModerator";
import ViewReports from "../ViewReports";
import ViewSuspensionStatistics from "./ViewSuspensionStatistics";
import ManageUsers from "../ManageUsers";

function RootAdminOptionDisplayer({ reports, teamData }) {
  const { active } = useRootAdmin();

  if (active === "manage-admins")
    return <ManageAdminAndModerator type="Admin" />;

  if (active === "manage-moderators")
    return <ManageAdminAndModerator type="Moderator" />;

  if (active === "view-reports") return <ViewReports reports={reports} />;

  if (active === "manage-users") return <ManageUsers />;

  if (active === "view-suspension-statistics")
    return <ViewSuspensionStatistics teamData={teamData} />;

  return null;
}

export default RootAdminOptionDisplayer;
