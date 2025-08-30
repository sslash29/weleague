"use server";

import {
  createPlayerRepository,
  createTeamRepository,
  deletePlayerRepository,
  deleteTeamRepository,
  addPlayerDataRepository,
  getTeamPlayersRepository,
  updateTeamDataRepository,
  addBestGoalVideoRepository,
  addBestAssistVideoRepository,
  addBestTackleVideoRepository,
  addCoolImgRepository,
} from "@/lib/db/repositories/moderatorRepositories";
import { getRulePointsRepository } from "@/lib/db/repositories/repositories";
import { toNumber } from "@/utils/toNumber";
import { redirect } from "next/navigation";
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
  const rulePoints = await getRulePointsRepository();
  console.log(formData);
  const points = rulePoints[0];
  const teamId = formData.get("teamId");
  const coolImg = formData.get("coolImg") || "";
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
  // Map incoming form values into the nested weekly data structure
  // Expecting formData to contain: freekick, normal, penalty, goalToGoal, ownGoal

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

  //* Variables for point calculation
  const normalGoalPoint = points.goal * normal;
  const freekickGoalPoint = points.freekick_goal * freekick;
  const penaltyGoalPoint = points.goal * penalty;
  const goalToGoalPoint = points.goal_to_goal * goalToGoal;
  const ownGoalPoint = points.goal_conceeded * ownGoal;

  const assistPoint = points.assist * assists;

  const clearancePoint = points.goal_clearance * clearance;
  const shotBlockPoint = points.shot_block * shotBlock;
  const interceptionPoint = points.tackle * interception;

  const normalSavePoint = points.save * normalSaves;
  const penaltySavePoint = points.penalty_save * penaltySaves;

  const yellowCardPoint = points.yellow_card * yellowCards;
  const redCardPoint = points.red_card * redCards;

  // Calculate total points
  const totalPoints =
    normalGoalPoint +
    freekickGoalPoint +
    penaltyGoalPoint +
    goalToGoalPoint +
    ownGoalPoint +
    assistPoint +
    clearancePoint +
    shotBlockPoint +
    interceptionPoint +
    normalSavePoint +
    penaltySavePoint +
    yellowCardPoint +
    redCardPoint;

  formData.set("totalPoints", totalPoints);

  // Attach the weeklyData JSON to the formData so repository/query can read it
  const weeklyDataString = JSON.stringify(playerWeeklyData);

  // Use FormData.set if available to avoid duplicate entries, otherwise append
  if (typeof formData.set === "function") {
    formData.set("weeklyData", weeklyDataString);
  } else {
    formData.append("weeklyData", weeklyDataString);
  }

  // Forward to repository which will call the DB query
  formData.append("coolImg", coolImg);
  await addPlayerDataRepository(prevState, formData);
  formData.set("teamId", teamId);
  await updateTeamDataRepository(prevState, formData);

  redirect("/moderator");
}

async function addBestAward(prevState, formData) {
  const awardType = formData.get("awardType");
  if (awardType === "bestGoal")
    return await addBestGoalVideoRepository(prevState, formData);
  if (awardType === "bestAssist")
    return await addBestAssistVideoRepository(prevState, formData);
  if (awardType === "bestTackle")
    return await addBestTackleVideoRepository(prevState, formData);
}

export {
  getAllPlayers,
  createPlayer,
  createTeam,
  deletePlayer,
  deleteTeam,
  addPlayerData,
  addBestAward,
};
