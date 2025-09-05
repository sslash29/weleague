import Team from "@/components/User/Team";
import { getAllPlayers } from "@/services/moderatorServices";

async function page() {
  const players = await getAllPlayers();
  return (
    <div>
      <Team players={players} />
    </div>
  );
}

export default page;
