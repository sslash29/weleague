"use server";

const {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getPlayerTeamRepository,
  getTeamPlayersRepository,
  getPlayerDataRepository,
  getBestAwardsRepository,
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

async function getTeamPlayers(teamdId) {
  return await getTeamPlayersRepository(teamdId);
}

async function getPlayerData(playerId) {
  return await getPlayerDataRepository(playerId);
}

async function getBestAwards() {
  return await getBestAwardsRepository();
}

export {
  getAllTeams,
  getTeamData,
  updateReportType,
  getPlayerTeam,
  getTeamPlayers,
  getPlayerData,
  getBestAwards,
};
