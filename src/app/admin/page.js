import RootAdminOptionDisplayer from "@/components-(presentation)/RootAdminOptionDisplayer";
import RootAdminOptions from "@/components-(presentation)/RootAdminOptions";
import { RootAdminProvider } from "@/context/rootAdminContext";
import { getAllAdmins } from "@/services-(Bussiness)/rootAdminService";

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
