import CreateAdminForm from "@/components/CreateAdminForm";

function page() {
  return (
    <div className="flex flex-col">
      <h2>Set Up a new admin</h2>
      <CreateAdminForm />
    </div>
  );
}

export default page;
