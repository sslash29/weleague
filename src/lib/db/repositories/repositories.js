"use server";

import {
  getAllTeamsQuery,
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

export {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getRulePointsRepository,
  getPlayerTeamRepository,
  getTeamPlayersRepository,
};
