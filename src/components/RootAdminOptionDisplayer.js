"use client";

import { useRootAdmin } from "@/context/rootAdminContext";
import ManageAdminAndModerator from "./ManageAdminAndModerator";

function RootAdminOptionDisplayer({ admins, moderators }) {
  console.log(admins);
  const { active } = useRootAdmin();
  if (active === "manage-admins")
    return <ManageAdminAndModerator users={admins} />;
  if (active === "manage-moderators")
    return <ManageAdminAndModerator users={moderators} type="Moderator" />;
}

export default RootAdminOptionDisplayer;
