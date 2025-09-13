"use server";
import { getPlayerDataRepository } from "@/lib/db/repositories/repositories";
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

  const { assignment, team: savedTeam } = await addPlayerToTeamRepository(
    formData
  );
  return savedTeam;
}

async function getStudentTeam(studentId) {
  // Fetch the base team data from repository
  const team = await getStudentTeamRepository(studentId);

  if (!team) return null;

  // Helper to fetch enriched player data
  async function enrichPlayers(players) {
    const enriched = await Promise.all(
      players.map(async (player) => {
        const extraData = await getPlayerDataRepository(player.id);
        return {
          ...player, // keep existing props (name, positionOnField, etc.)
          ...extraData, // merge Supabase player data
        };
      })
    );
    return enriched;
  }

  // Enrich both main and bench players
  const mainPlayers = await enrichPlayers(team.mainPlayers || []);
  const benchPlayers = await enrichPlayers(team.benchPlayers || []);

  return {
    ...team,
    mainPlayers,
    benchPlayers,
  };
}

async function updateTeamName(teamName, studentId) {
  return await updateTeamNameRepository(teamName, studentId);
}

export { createReport, addPlayerToTeam, getStudentTeam, updateTeamName };
