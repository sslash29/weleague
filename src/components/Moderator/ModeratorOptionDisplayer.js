"use client";

import { useModerator } from "@/context/moderatorContext";
import ManagePlayers from "./ManagePlayers";
import ManageTeams from "./ManageTeams";
import ViewReports from "../ViewReports";

function ModeratorOptionDisplayer({ players, teams, reports }) {
  const { active } = useModerator();
  if (active === "manage-players") return <ManagePlayers players={players} />;
  if (active === "manage-teams") return <ManageTeams teams={teams} />;
  if (active === "view-reports") return <ViewReports reports={reports} />;
}

export default ModeratorOptionDisplayer;
