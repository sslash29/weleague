"use server";
import {
  addPlayerToTeamRepository,
  createReportRepository,
  getStudentTeamRepository,
  updateTeamNameRepository,
} from "@/lib/db/repositories/userRepositories";

async function createReport(prevState, formData) {
  return await createReportRepository(prevState, formData);
}

async function addPlayerToTeam(formData) {
  const studentId = formData.get("studentId");
  const selectedPlayer = JSON.parse(formData.get("selectedPlayer"));
  const type = formData.get("type");
  const positionOnField = Number(formData.get("positionOnField"));
  const { mainPlayers, benchPlayers, moneyLeft } =
    await getStudentTeamRepository(studentId);

  if (moneyLeft < selectedPlayer.price)
    return { success: false, message: "Don't have enough money" };

  const newPlayer = {
    id: selectedPlayer.id,
    name: selectedPlayer.full_name,
    player_img: selectedPlayer.player_image,
    positionOnField,
  };

  let updatedMainPlayers = Array.isArray(mainPlayers) ? [...mainPlayers] : [];
  let updatedBenchPlayers = Array.isArray(benchPlayers)
    ? [...benchPlayers]
    : [];

  if (type === "main") {
    updatedMainPlayers = updatedMainPlayers.filter(
      (p) => p.positionOnField !== positionOnField
    );
    updatedMainPlayers.push(newPlayer);
  } else if (type === "bench") {
    updatedBenchPlayers = updatedBenchPlayers.filter(
      (p) => p.positionOnField !== positionOnField
    );
    updatedBenchPlayers.push(newPlayer);
  }

  const team = {
    teamName: formData.get("teamName") || "",
    mainPlayers: updatedMainPlayers,
    benchPlayers: updatedBenchPlayers,
    moneyLeft: (moneyLeft - selectedPlayer.price).toFixed(2),
  };

  formData.set("team", JSON.stringify(team));

  // save in DB
  const { assignment, team: savedTeam } = await addPlayerToTeamRepository(
    formData
  );
  ("team");
  savedTeam;
  return savedTeam;
}

async function getStudentTeam(studentId) {
  return await getStudentTeamRepository(studentId);
}

async function updateTeamName(teamName, studentId) {
  return await updateTeamNameRepository(teamName, studentId);
}

export { createReport, addPlayerToTeam, getStudentTeam, updateTeamName };
