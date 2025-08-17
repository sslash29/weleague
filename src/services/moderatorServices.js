"use server";

import {
  createPlayerRepository,
  createTeamRepository,
  deletePlayerRepository,
  deleteTeamRepository,
  addPlayerDataRepository,
} from "@/lib/db/repositories/moderatorRepositories";

const { getAllPlayersQuery } = require("@/lib/db/queries/moderatorQuries");

async function getAllPlayers() {
  const data = await getAllPlayersQuery();
  return data;
}

async function createPlayer(prevState, formData) {
  const data = await createPlayerRepository(prevState, formData);
  return data;
}

async function createTeam(prevState, formData) {
  const data = await createTeamRepository(prevState, formData);
  return data;
}

async function deletePlayer(prevState, formData) {
  const data = await deletePlayerRepository(prevState, formData);
  return data;
}

async function deleteTeam(prevState, formData) {
  const data = await deleteTeamRepository(prevState, formData);
  return data;
}

async function addPlayerData(prevState, formData) {
  const playerWeeklyData = {
    goals: {
      ownGoals: 0,
      GoalToGoal: 0,
      normalGoals: 0,
      penaltyGoals: 0,
      freekickGoals: 0,
    },
    saves: {
      normalSaves: 0,
      penaltySaves: 0,
    },
    assists: 0,
    tackles: {
      clearance: 0,
      shotBlock: 0,
      interception: 0,
    },
    redCards: 0,
    yellowCards: 0,
  };

  console.log(formData);
  // Map incoming form values into the nested weekly data structure
  // Expecting formData to contain: freekick, normal, penalty, goalToGoal, ownGoal
  const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const freekick = toNumber(formData.get("freekick"));
  const normal = toNumber(formData.get("normal"));
  const penalty = toNumber(formData.get("penalty"));
  const goalToGoal = toNumber(formData.get("goalToGoal"));
  const ownGoal = toNumber(formData.get("ownGoal"));
  const normalSaves = toNumber(formData.get("normalSaves"));
  const penaltySaves = toNumber(formData.get("penaltySaves"));
  const clearance = toNumber(formData.get("clearance"));
  const shotBlock = toNumber(formData.get("shotBlock"));
  const interception = toNumber(formData.get("interception"));
  const assists = toNumber(formData.get("assists"));
  const yellowCards = toNumber(formData.get("yellowCards"));
  const redCards = toNumber(formData.get("redCards"));

  playerWeeklyData.tackles.clearance = clearance;
  playerWeeklyData.tackles.shotBlock = shotBlock;
  playerWeeklyData.tackles.interception = interception;
  playerWeeklyData.assists = assists;
  playerWeeklyData.yellowCards = yellowCards;
  playerWeeklyData.redCards = redCards;

  playerWeeklyData.goals.freekickGoals = freekick;
  playerWeeklyData.goals.normalGoals = normal;
  playerWeeklyData.goals.penaltyGoals = penalty;
  playerWeeklyData.goals.GoalToGoal = goalToGoal;
  playerWeeklyData.goals.ownGoals = ownGoal;

  playerWeeklyData.saves.normalSaves = normalSaves;
  playerWeeklyData.saves.penaltySaves = penaltySaves;

  // Attach the weeklyData JSON to the formData so repository/query can read it
  const weeklyDataString = JSON.stringify(playerWeeklyData);

  // Use FormData.set if available to avoid duplicate entries, otherwise append
  if (typeof formData.set === "function") {
    formData.set("weeklyData", weeklyDataString);
  } else {
    formData.append("weeklyData", weeklyDataString);
  }

  // Forward to repository which will call the DB query
  const data = await addPlayerDataRepository(prevState, formData);
  return {
    success: true,
    message: "Player weekly data submitted successfully",
    data,
  };
}

export {
  getAllPlayers,
  createPlayer,
  createTeam,
  deletePlayer,
  deleteTeam,
  addPlayerData,
};
