"use server";

import {
  createPlayerRepository,
  createTeamRepository,
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

export { getAllPlayers, createPlayer, createTeam };
