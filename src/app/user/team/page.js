import Team from "@/components/User/Team";
import { getAllPlayers } from "@/services/moderatorServices";
import { getUser } from "@/services/server/services";
import {
  getStudentTeam,
  isBenchBoostUsed,
  isTripleCaptain,
} from "@/services/userServices";

async function page() {
  const players = await getAllPlayers();
  const student = await getUser();
  const team = await getStudentTeam(student.id);
  const isTripleCaptainUsed = await isTripleCaptain(student.id);
  const benchBoostUsed = await isBenchBoostUsed(student.id);
  return (
    <Team
      players={players}
      studentId={student.id}
      team={team}
      isTripleCaptainUsed={isTripleCaptainUsed}
      benchBoostUsed={benchBoostUsed}
    />
  );
}

export default page;
