"use client";

import { useModerator } from "@/context/moderatorContext";
import ManagePlayers from "./ManagePlayers";
import ManageTeams from "./ManageTeams";
import ViewReports from "../ViewReports";
import ManageUsers from "../ManageUsers";

function ModeratorOptionDisplayer({ players, teams, reports }) {
  const { active } = useModerator();
  if (active === "manage-players") return <ManagePlayers players={players} />;
  if (active === "manage-teams") return <ManageTeams teams={teams} />;
  if (active === "view-reports") return <ViewReports reports={reports} />;
  if (active === "manage-users") return <ManageUsers />;
}

export default ModeratorOptionDisplayer;
