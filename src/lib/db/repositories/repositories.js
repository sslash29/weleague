"use server";

import { getAllTeamsQuery } from "../queries/queries";

async function getAllTeamsRepository() {
  return await getAllTeamsQuery();
}

export { getAllTeamsRepository };
