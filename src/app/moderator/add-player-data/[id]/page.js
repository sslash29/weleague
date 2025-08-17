import AddPlayerDataForm from "@/components/Moderator/AddPlayerDataForm";

async function Page({ params }) {
  const { id } = (await params) || {};

  return (
    <div>
      <AddPlayerDataForm playerId={id} />
    </div>
  );
}

export default Page;
