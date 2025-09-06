import Team from "@/components/User/Team";
import { getAllPlayers } from "@/services/moderatorServices";
import { getUser } from "@/services/server/services";
import { getStudentTeam } from "@/services/userServices";

async function page() {
  const players = await getAllPlayers();
  const student = await getUser();
  const team = await getStudentTeam(student.id);
  return (
    <div>
      <Team players={players} studentId={student.id} team={team} />
    </div>
  );
}

export default page;
