"use server";

import {
  addPlayerToAssignmentQuery,
  addPlayerToStudentTeamQuery,
  createReportQuery,
  getStudentTeamQuery,
} from "../queries/userQueries";

async function createReportRepository(prevState, formData) {
  return await createReportQuery(prevState, formData);
}

async function addPlayerToTeamRepository(prevState, formData) {
  const studentId = formData.get("studentId");
  const playerId = formData.get("playerId");
  const assignment = await addPlayerToAssignmentQuery(playerId, studentId);
  const team = await addPlayerToStudentTeamQuery(prevState, formData);
  return { assignment, team };
}

async function getStudentTeamRepository(studentId) {
  const studentTeam = await getStudentTeamQuery(studentId);

  // Parse team if it exists
  const team = studentTeam[0]?.team
    ? JSON.parse(studentTeam[0].team)
    : { teamName: "", mainPlayers: {}, benchPlayers: {} };

  return {
    teamName: team.teamName || "",
    mainPlayers: team.mainPlayers || {},
    benchPlayers: team.benchPlayers || {},
  };
}

export {
  createReportRepository,
  addPlayerToTeamRepository,
  getStudentTeamRepository,
};
