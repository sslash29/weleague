import CreatePlayerForm from "@/components/Moderator/CreatePlayerForm";
import { getAllTeams } from "@/services/services";

async function page() {
  const teams = await getAllTeams();
  return (
    <div>
      <CreatePlayerForm teams={teams} />
    </div>
  );
}

export default page;
