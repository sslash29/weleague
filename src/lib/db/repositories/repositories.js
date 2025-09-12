"use server";

import { getUser } from "@/services/server/services";
import {
  addVoteQuery,
  getAllTeamsQuery,
  getBestAssistVideoQuery,
  getBestGoalVideoQuery,
  getBestTackleVideoQuery,
  getPlayerDataQuery,
  getPlayerTeamQuery,
  getRulePointsQuery,
  getTeamDataQuery,
  getTeamPlayersQuery,
  getUserDataQuery,
  getVoteQuery,
  updateReportTypeQuery,
} from "../queries/queries";
import { getVote } from "@/services/services";
import { getUserQuery } from "../queries/server/queries";

async function getAllTeamsRepository() {
  return await getAllTeamsQuery();
}

async function getTeamDataRepository(teamId) {
  return await getTeamDataQuery(teamId);
}

async function updateReportTypeRepository(prevState, formData) {
  return await updateReportTypeQuery(prevState, formData);
}

async function getRulePointsRepository() {
  return await getRulePointsQuery();
}

async function getPlayerTeamRepository(playerId) {
  return await getPlayerTeamQuery(playerId);
}

async function getTeamPlayersRepository(teamId) {
  return await getTeamPlayersQuery(teamId);
}

async function getPlayerDataRepository(playerId) {
  return await getPlayerDataQuery(playerId);
}

async function getBestAwardsRepository() {
  const [bestGoal, bestAssist, bestTackle] = await Promise.all([
    getBestGoalVideoQuery(),
    getBestAssistVideoQuery(),
    getBestTackleVideoQuery(),
  ]);

  return {
    bestGoal,
    bestAssist,
    bestTackle,
  };
}

async function addVoteRepository(prevState, formData) {
  const data = await getUserQuery();
  formData.set("studentId", data.user.id);
  return await addVoteQuery(prevState, formData);
}
async function getVoteRepository(student_id) {
  return await getVoteQuery(student_id);
}

async function getUserDataRepository(studentId) {
  return await getUserDataQuery(studentId);
}

export {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getRulePointsRepository,
  getPlayerTeamRepository,
  getTeamPlayersRepository,
  getPlayerDataRepository,
  getBestAwardsRepository,
  addVoteRepository,
  getVoteRepository,
  getUserDataRepository,
};
