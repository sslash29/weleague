"use server";

const {
  getAllTeamsRepository,
  getTeamDataRepository,
  updateReportTypeRepository,
  getPlayerTeamRepository,
  getTeamPlayersRepository,
  getPlayerDataRepository,
  getBestAwardsRepository,
  addVoteRepository,
  getVoteRepository,
  getUserDataRepository,
  deleteAccountRepository,
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

async function addVote(prevState, formData) {
  return await addVoteRepository(prevState, formData);
}
async function getVote(student_id = "aa20eca5-773e-444d-9391-489739ce3a9d") {
  const data = await getVoteRepository(student_id);
  const bestGoals = data.filter(
    (item) => item.best_award?.award_type === "bestGoal"
  );
  const bestAssists = data.filter(
    (item) => item.best_award?.award_type === "bestAssist"
  );
  const bestTackles = data.filter(
    (item) => item.best_award?.award_type === "bestTackle"
  );
  return {
    bestGoals,
    bestAssists,
    bestTackles,
  };
}

async function getUserData(studentId) {
  return await getUserDataRepository(studentId);
}

async function deleteAccount(prevState, formData) {
  return await deleteAccountRepository(prevState, formData);
}
export {
  getAllTeams,
  getTeamData,
  updateReportType,
  getPlayerTeam,
  getTeamPlayers,
  getPlayerData,
  getBestAwards,
  addVote,
  getVote,
  getUserData,
  deleteAccount,
};
