"use client";

import { useRootAdmin } from "@/context/rootAdminContext";
import ManageAdmin from "./ManageAdmin";

function RootAdminOptionDisplayer({ admins }) {
  console.log(admins);
  const { active } = useRootAdmin();
  if (active === "manage-admins") return <ManageAdmin admins={admins} />;
}

export default RootAdminOptionDisplayer;
