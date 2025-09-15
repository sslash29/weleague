"use server";
import { getPlayerDataQuery } from "@/lib/db/queries/queries";
import { getPlayerDataRepository } from "@/lib/db/repositories/repositories";
import {
  addPlayerToTeamRepository,
  applyTripleCaptainRepository,
  createReportRepository,
  getStudentTeamRepository,
  isTripleCaptainUsedRepository,
  updateTeamNameRepository,
} from "@/lib/db/repositories/userRepositories";
import { getWeekNumber } from "@/utils/helpers";

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

  if (moneyLeft < selectedPlayer.playerPrice)
    return { success: false, message: "Don't have enough money" };

  const playerData = await getPlayerDataQuery(selectedPlayer.id);

  const newPlayer = {
    id: selectedPlayer.id,
    name: selectedPlayer.full_name,
    player_img: selectedPlayer.player_image,
    point_this_week: playerData.point_this_week,
    playerPrice: selectedPlayer.price,
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
    moneyLeft: (
      moneyLeft -
      (selectedPlayer?.calculationPrice
        ? selectedPlayer?.calculationPrice
        : selectedPlayer?.price)
    ).toFixed(2),
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
        console.log(player);
        console.log("player");
        const extraData = await getPlayerDataRepository(player.id);

        if (!extraData) return player;

        // 🚀 Keep boosted points if player has Triple Captain
        if (player.isTripleCaptain) {
          return {
            ...extraData,
            ...player, // put player last so boosted values + flag win
          };
        }

        // Normal merge (DB wins)
        return {
          ...player,
          ...extraData,
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

async function applyTripleCaptain(prevState, formData) {
  const currentTeam = JSON.parse(formData.get("currentTeam"));
  const playerData = JSON.parse(formData.get("playerData"));
  const playerType = formData.get("playerType");
  const studentId = formData.get("studentId");

  const currentWeek = getWeekNumber();
  formData.append("currentWeek", currentWeek);
  const student = await isTripleCaptainUsedRepository(studentId);
  if (
    student.triple_captain_used &&
    student.triple_captain_week === currentWeek
  ) {
    return {
      success: false,
      message: "You can only use Triple Captain once per week!",
    };
  }

  // 🚀 Update player points
  const updatedPlayerData = {
    ...playerData,
    point_this_week: playerData.point_this_week * 3,
    isTripleCaptain: true,
  };

  let updatedTeamData;
  if (playerType === "bench") {
    updatedTeamData = {
      ...currentTeam,
      benchPlayers: currentTeam.benchPlayers.map((p) =>
        p.id === playerData.id ? updatedPlayerData : p
      ),
    };
  } else {
    updatedTeamData = {
      ...currentTeam,
      mainPlayers: currentTeam.mainPlayers.map((p) =>
        p.id === playerData.id ? updatedPlayerData : p
      ),
    };
  }

  // FIX: Serialize the JavaScript object to a JSON string before appending.
  // This ensures the data is correctly passed to the next function.
  formData.append("team", JSON.stringify(updatedTeamData));

  // Save team + mark Triple Captain used
  return await applyTripleCaptainRepository(prevState, formData);
}

export {
  createReport,
  addPlayerToTeam,
  getStudentTeam,
  updateTeamName,
  applyTripleCaptain,
};
