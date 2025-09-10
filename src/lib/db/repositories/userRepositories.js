"use server";
import {
  addPlayerToAssignmentQuery,
  addPlayerToStudentTeamQuery,
  createReportQuery,
  getStudentTeamQuery,
  updateTeamNameQuery,
} from "../queries/userQueries";

async function createReportRepository(prevState, formData) {
  return await createReportQuery(prevState, formData);
}

async function addPlayerToTeamRepository(formData) {
  const studentId = formData.get("studentId");
  const playerId = formData.get("playerId");
  const assignment = await addPlayerToAssignmentQuery(playerId, studentId);
  const team = await addPlayerToStudentTeamQuery(formData);
  return { assignment, team };
}

async function getStudentTeamRepository(studentId) {
  const studentTeam = await getStudentTeamQuery(studentId);

  // Parse team if it exists and ensure arrays
  const team = studentTeam[0]?.team
    ? studentTeam[0]?.team
    : { teamName: "", mainPlayers: [], benchPlayers: [], moneyLeft: 50 };

  const result = {
    teamName: team.teamName || "",
    mainPlayers: Array.isArray(team.mainPlayers) ? team.mainPlayers : [],
    benchPlayers: Array.isArray(team.benchPlayers) ? team.benchPlayers : [],
    moneyLeft: team.moneyLeft,
  };

  return result;
}
async function updateTeamNameRepository(teamName, studentId) {
  return await updateTeamNameQuery(teamName, studentId);
}
export {
  createReportRepository,
  addPlayerToTeamRepository,
  getStudentTeamRepository,
  updateTeamNameRepository,
};
