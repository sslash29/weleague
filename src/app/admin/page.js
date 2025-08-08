import RootAdminOptionDisplayer from "@/components/RootAdminOptionDisplayer";
import RootAdminOptions from "@/components/RootAdminOptions";
import { RootAdminProvider } from "@/context/rootAdminContext";
import { getAllAdmins } from "@/services/rootAdminService";

async function page() {
  const admins = await getAllAdmins();
  return (
    <div>
      <RootAdminProvider>
        <RootAdminOptions />
        <RootAdminOptionDisplayer admins={admins} />
      </RootAdminProvider>
    </div>
  );
}

export default page;
