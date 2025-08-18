"use server";

import { getAllTeamsQuery, getTeamDataQuery } from "../queries/queries";

async function getAllTeamsRepository() {
  return await getAllTeamsQuery();
}

async function getTeamDataRepository(teamId) {
  return await getTeamDataQuery(teamId);
}

export { getAllTeamsRepository, getTeamDataRepository };
