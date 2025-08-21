import AddPlayerDataForm from "@/components/Moderator/PlayerData/AddPlayerDataForm";
import { getPlayerTeam } from "@/services/services";

async function Page({ params }) {
  const { playerId, teamId } = (await params) || {};

  return (
    <div>
      <AddPlayerDataForm playerId={playerId} teamId={teamId} />
    </div>
  );
}

export default Page;
