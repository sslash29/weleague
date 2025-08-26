"use server";

import {
  getAllTeamsQuery,
  getBestAssistVideoQuery,
  getBestGoalVideoQuery,
  getBestTackleVideoQuery,
  getPlayerDataQuery,
  getPlayerTeamQuery,
  getRulePointsQuery,
  getTeamDataQuery,
  getTeamPlayersQuery,
  updateReportTypeQuery,
} from "../queries/queries";

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

export {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getRulePointsRepository,
  getPlayerTeamRepository,
  getTeamPlayersRepository,
  getPlayerDataRepository,
  getBestAwardsRepository,
};
