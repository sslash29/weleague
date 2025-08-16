"use server";

const { getAllTeamsRepository } = require("@/lib/db/repositories/repositories");

async function getAllTeams() {
  return await getAllTeamsRepository();
}

export { getAllTeams };
