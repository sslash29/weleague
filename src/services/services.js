"use server";

const {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getPlayerTeamRepository,
} = require("@/lib/db/repositories/repositories");

async function getAllTeams() {
  return await getAllTeamsRepository();
}

async function getTeamData(teamId) {
  return await getTeamDataRepository(teamId);
}

async function updateReportType(prevState, formData) {
  return await updateReportTypeRepository(prevState, formData);
}

async function getPlayerTeam(playerId) {
  return await getPlayerTeamRepository(playerId);
}

export { getAllTeams, getTeamData, updateReportType, getPlayerTeam };
