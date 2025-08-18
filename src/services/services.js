"use server";

const {
  getAllTeamsRepository,
  getTeamDataRepository,
} = require("@/lib/db/repositories/repositories");

async function getAllTeams() {
  return await getAllTeamsRepository();
}

async function getTeamData(teamId) {
  return await getTeamDataRepository(teamId);
}

export { getAllTeams, getTeamData };
